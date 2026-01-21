// .claude/hooks/permission-request.js
// PermissionRequest Hook - MCP Usage Tracking & Cost Monitoring
// Version: 1.0.0
// Created: 2025-11-19

import fs from 'fs/promises';
import path from 'path';

/**
 * Permission Request Hook
 *
 * Tracks MCP usage and implements auto-approval rules for cost optimization.
 *
 * @param {Object} context - Hook context
 * @param {Object} context.tool - MCP tool being called
 * @param {Object} context.inputs - Tool inputs
 * @param {Object} context.project - Current project info
 * @returns {Object|null} - Permission decision or null for default behavior
 */
export default async function permissionRequestHook({ tool, inputs, project }) {
  try {
    // MCP Usage Logging
    const logEntry = {
      timestamp: new Date().toISOString(),
      tool: tool.name,
      project: project.name || 'unknown',
      inputs: {
        operation: inputs.operation || inputs.method || inputs.prompt?.substring(0, 50) || 'unknown',
        size: JSON.stringify(inputs).length
      }
    };

    // Ensure .serena directory exists
    const serenaDir = path.join(project.root, '.serena');
    try {
      await fs.mkdir(serenaDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore
    }

    // Append to .serena/mcp_usage_log.jsonl
    const logPath = path.join(serenaDir, 'mcp_usage_log.jsonl');
    await fs.appendFile(logPath, JSON.stringify(logEntry) + '\n');

    // Template Usage Tracking (Month 2: v5.5.1-templates consolidation)
    if (tool.name === 'Read' && inputs.file_path) {
      const filePath = inputs.file_path;

      // Check if reading a v5.5.1 template
      if (filePath.includes('v5.5.1-templates') && filePath.endsWith('.md')) {
        const fileName = path.basename(filePath);

        // Only track workflow templates (01-13), not support files
        const isTemplate = /^\d{2}_[A-Z_]+_(OPTION_D|UNIFIED|LEAN)\.md$/.test(fileName);

        if (isTemplate) {
          const templateLogEntry = {
            timestamp: new Date().toISOString(),
            template: fileName,
            user: `session_${Date.now().toString(36)}`, // Unique session identifier
            action: 'read'
          };

          // Append to .serena/template_usage_log.jsonl
          const templateLogPath = path.join(serenaDir, 'template_usage_log.jsonl');
          await fs.appendFile(templateLogPath, JSON.stringify(templateLogEntry) + '\n');
        }
      }
    }

    // Auto-Approval Rules (v2.0.70+ Wildcard Support)
    const autoApproveList = [
      // Wildcard patterns (MCP v2.0.70+)
      'mcp__serena-memory__*',                    // All Serena Memory tools
      'mcp__clear-thought__*',                    // All Clear Thought tools
      'mcp__clear-thought-1.5__*',                // All Clear Thought 1.5 tools
      'mcp__sequential-thinking-tools__*',        // All Sequential Thinking tools
      'mcp__context7__*',                         // All Context7 tools
      'mcp__code-context-provider-mcp__*',        // All Code Context Provider tools
      'mcp__github-mcp__*',                       // All GitHub MCP tools
      'mcp__npm-sentinel-mcp__*',                 // All NPM Sentinel tools
      'mcp__node-omnibus-mcp__*',                 // All Node Omnibus tools
      'mcp__magic-mcp__*',                        // All Magic MCP tools

      // Legacy exact matches (backward compatibility)
      'mcp__serena-memory__list_memories',
      'mcp__serena-memory__search_memories',
      'mcp__serena-memory__read_memory',
      'mcp__serena-memory__write_memory',
      'mcp__clear-thought__sequentialthinking',
      'mcp__clear-thought-1.5__clear_thought',
      'mcp__sequential-thinking-tools__sequential_thinking',
      'mcp__context7__analyze_context',
      'mcp__code-context-provider-mcp__get_code_context',
      'mcp__github-mcp__github_action',
      'mcp__npm-sentinel-mcp__npmLatest',
      'mcp__npm-sentinel-mcp__npmVersions',
      'mcp__npm-sentinel-mcp__npmDeps',
    ];

    // Wildcard matching logic
    const isAutoApproved = autoApproveList.some(pattern => {
      if (pattern.endsWith('__*')) {
        const prefix = pattern.slice(0, -1); // Remove trailing '*'
        return tool.name.startsWith(prefix);
      }
      return tool.name === pattern;
    });

    if (isAutoApproved) {
      return { decision: 'allow' };
    }

    // High-Cost MCPs (require user confirmation)
    const highCostMCPs = [
      // Stochastic Analysis (computational expensive)
      'mcp__stochastic-thinking__stochastic_analysis',

      // Model Enhancement (intensive reasoning)
      'mcp__model-enhancement-servers__enhance_reasoning',

      // Playwright (browser automation)
      'mcp__playwright-mcp__browser_navigate',
      'mcp__playwright-mcp__browser_snapshot',
      'mcp__playwright-mcp__browser_take_screenshot',

      // Mobile (device automation)
      'mcp__mobile-mcp__mobile_list_available_devices',
      'mcp__mobile-mcp__mobile_launch_app',

      // Supabase (database operations)
      'mcp__supabase-mcp__execute_sql',
      'mcp__supabase-mcp__apply_migration',
    ];

    if (highCostMCPs.includes(tool.name)) {
      console.log(`⚠️ High-cost MCP detected: ${tool.name}`);
      console.log(`   Operation: ${logEntry.inputs.operation}`);
      console.log(`   Input size: ${logEntry.inputs.size} bytes`);
      return { decision: 'ask' }; // Ask user for confirmation
    }

    // Default: let Claude Code decide
    return null;

  } catch (error) {
    // Hook should never break the workflow
    console.error(`PermissionRequest Hook error: ${error.message}`);
    return null;
  }
}

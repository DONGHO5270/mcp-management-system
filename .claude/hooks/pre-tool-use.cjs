// .claude/hooks/pre-tool-use.js
// PreToolUse Hook - Input Validation & Optimization + Pre-Analysis Gate
// Version: 2.0.0
// Created: 2025-11-19
// Updated: 2026-01-06 (P2.2: Pre-Analysis Gate - Items 1+5 auto, 2-4 manual)

/**
 * PreToolUse Hook
 *
 * Validates and optimizes MCP inputs before execution.
 * - Truncates long prompts to reduce token costs
 * - Limits excessive iterations in stochastic analysis
 * - Validates file sizes for Read operations
 *
 * @param {Object} context - Hook context
 * @param {Object} context.tool - MCP tool being called
 * @param {Object} context.inputs - Tool inputs (can be modified)
 * @returns {Object|null} - Modified inputs or null for no changes
 */
function preToolUseHook({ tool, inputs }) {
  try {
    // Case 1: Truncate long prompts (Clear Thought, Sequential Thinking)
    if (
      (tool.name === 'mcp__clear-thought__sequentialthinking' ||
       tool.name === 'mcp__clear-thought-1.5__clear_thought' ||
       tool.name === 'mcp__sequential-thinking-tools__sequential_thinking') &&
      inputs.thought
    ) {
      const MAX_THOUGHT_LENGTH = 5000;
      if (inputs.thought.length > MAX_THOUGHT_LENGTH) {
        console.warn(
          `⚠️ Thought too long (${inputs.thought.length} chars), truncating to ${MAX_THOUGHT_LENGTH}...`
        );
        return {
          modifiedInputs: {
            ...inputs,
            thought:
              inputs.thought.substring(0, MAX_THOUGHT_LENGTH) +
              '\n\n[... truncated for performance. Original length: ' +
              inputs.thought.length +
              ' chars]'
          }
        };
      }
    }

    // Case 2: Limit Stochastic iterations (prevent excessive computation)
    if (
      tool.name === 'mcp__stochastic-thinking__stochastic_analysis' &&
      inputs.parameters
    ) {
      const MAX_ITERATIONS = 50000;
      if (inputs.parameters.iterations > MAX_ITERATIONS) {
        console.warn(
          `⚠️ Too many iterations (${inputs.parameters.iterations}), limiting to ${MAX_ITERATIONS}`
        );
        return {
          modifiedInputs: {
            ...inputs,
            parameters: {
              ...inputs.parameters,
              iterations: MAX_ITERATIONS
            }
          }
        };
      }

      // Also limit scenarios for stochastic analysis
      const MAX_SCENARIOS = 20;
      if (inputs.parameters.scenarios > MAX_SCENARIOS) {
        console.warn(
          `⚠️ Too many scenarios (${inputs.parameters.scenarios}), limiting to ${MAX_SCENARIOS}`
        );
        return {
          modifiedInputs: {
            ...inputs,
            parameters: {
              ...inputs.parameters,
              scenarios: MAX_SCENARIOS
            }
          }
        };
      }
    }

    // Case 3: Clear Thought prompt length optimization
    if (tool.name === 'mcp__clear-thought-1.5__clear_thought' && inputs.prompt) {
      const MAX_PROMPT_LENGTH = 8000;
      if (inputs.prompt.length > MAX_PROMPT_LENGTH) {
        console.warn(
          `⚠️ Clear Thought prompt too long (${inputs.prompt.length} chars), truncating...`
        );
        return {
          modifiedInputs: {
            ...inputs,
            prompt:
              inputs.prompt.substring(0, MAX_PROMPT_LENGTH) +
              '\n\n[Truncated for performance]'
          }
        };
      }
    }

    // Case 4: Context7 path validation (prevent analyzing entire system)
    if (tool.name === 'mcp__context7__analyze_context' && inputs.path) {
      const dangerousPaths = ['/', 'C:\\', '/home', '/usr', '/System'];
      if (dangerousPaths.some(p => inputs.path === p || inputs.path.startsWith(p + '/'))) {
        console.error(`❌ Dangerous path detected: ${inputs.path}`);
        console.error('   Context7 should not analyze system directories.');
        return {
          modifiedInputs: {
            ...inputs,
            path: process.cwd() // Fallback to current directory
          }
        };
      }
    }

    // Case 5: Playwright screenshot size optimization
    if (
      tool.name === 'mcp__playwright-mcp__browser_take_screenshot' &&
      !inputs.element &&
      !inputs.fullPage
    ) {
      // Suggest element screenshot instead of full page
      if (inputs.filename && !inputs.filename.includes('full')) {
        console.log(
          '💡 Tip: Use element screenshots instead of full page for better performance'
        );
      }
    }

    // Case 6: Model Enhancement reasoning depth limit
    if (
      tool.name === 'mcp__model-enhancement-servers__enhance_reasoning' &&
      inputs.task
    ) {
      const MAX_TASK_LENGTH = 10000;
      if (inputs.task.length > MAX_TASK_LENGTH) {
        console.warn(
          `⚠️ Enhancement task too long (${inputs.task.length} chars), truncating...`
        );
        return {
          modifiedInputs: {
            ...inputs,
            task:
              inputs.task.substring(0, MAX_TASK_LENGTH) +
              '\n\n[Truncated for performance]'
          }
        };
      }
    }

    // Case 7: OPTION_D Template Auto-Redirection + Usage Tracking (Month 1 & 2)
    if (tool.name === 'Read' && inputs.file_path) {
      const path = require('path');
      const fs = require('fs');

      // Template Usage Tracking (Month 2) - Track ALL template reads
      if (inputs.file_path.includes('v5.5.1-templates') && inputs.file_path.endsWith('.md')) {
        const fileName = path.basename(inputs.file_path);

        // Only track workflow templates (01-13), not support files
        const isTemplate = /^\d{2}_[A-Z_]+_(OPTION_D|UNIFIED|LEAN)\.md$/.test(fileName);

        if (isTemplate) {
          try {
            const projectRoot = process.cwd();
            const serenaDir = path.join(projectRoot, '.serena');

            // Ensure .serena directory exists
            if (!fs.existsSync(serenaDir)) {
              fs.mkdirSync(serenaDir, { recursive: true });
            }

            const templateLogEntry = {
              timestamp: new Date().toISOString(),
              template: fileName,
              user: `session_${Date.now().toString(36)}`,
              action: 'read'
            };

            // Append to .serena/template_usage_log.jsonl
            const templateLogPath = path.join(serenaDir, 'template_usage_log.jsonl');
            fs.appendFileSync(templateLogPath, JSON.stringify(templateLogEntry) + '\n');
          } catch (error) {
            // Don't break workflow if logging fails
            console.error(`Template usage logging error: ${error.message}`);
          }
        }
      }

      // Auto-Redirection (Month 1) - Only for OPTION_D templates
      if (inputs.file_path.includes('v5.5.1-templates') && inputs.file_path.includes('OPTION_D.md')) {
        const templatePath = inputs.file_path;

        // Extract template base name (e.g., "06_HEALTH_CHECK")
        const fileName = path.basename(templatePath, '.md');
        const baseName = fileName.replace('_OPTION_D', '');

        // Templates with LEAN versions (actual existence verified 2025-01-24)
        const hasLean = [
          '11_PRD_TO_UIUX_GUIDE',
          '12_PRD_UIUX_TO_SPEC',
          '13_REQUIREMENTS_TO_PRD'
        ];

        // Determine redirect target (LEAN if available, otherwise UNIFIED)
        const templateId = baseName.split('_')[0];
        const redirectSuffix = hasLean.some(t => t.startsWith(templateId)) ? 'LEAN' : 'UNIFIED';
        const redirectPath = templatePath.replace('_OPTION_D.md', `_${redirectSuffix}.md`);

        console.warn(
          `⚠️ OPTION_D template deprecated! Auto-redirecting:\n` +
          `   FROM: ${path.basename(templatePath)}\n` +
          `   TO:   ${path.basename(redirectPath)}\n` +
          `   Migration Guide: v5.5.1-templates/MIGRATION_GUIDE.md`
        );

        return {
          modifiedInputs: {
            ...inputs,
            file_path: redirectPath
          }
        };
      }
    }

    // ============================================
    // PHASE 2.2: PRE-ANALYSIS GATE (2026-01-06)
    // ============================================

    // Case 8: Item 1 - Availability Bias Prevention (Read call detection)
    if (isImplementationTask(tool, inputs)) {
      const recentReadCalls = getRecentToolCalls('Read', 5);

      if (recentReadCalls.length === 0) {
        console.warn('');
        console.warn('⚠️ PRE-ANALYSIS GATE: Availability Bias Risk Detected');
        console.warn('   Item 1: Read actual files before implementation');
        console.warn('   ');
        console.warn('   Risk: Working from memory/cache can lead to incorrect assumptions.');
        console.warn('   Required: Use Read tool to verify current file contents.');
        console.warn('');

        logBiasDetection('Availability', tool.name, inputs);
      }
    }

    // Case 9: Item 5 - Error Propagation Prevention (Git checkpoint detection)
    if (isImplementationTask(tool, inputs)) {
      const hasGitStrategy = checkForGitKeywords(inputs);

      if (!hasGitStrategy) {
        console.warn('');
        console.warn('⚠️ PRE-ANALYSIS GATE: Error Propagation Risk Detected');
        console.warn('   Item 5: Define git checkpoint strategy');
        console.warn('   ');
        console.warn('   Risk: One subtask failure → entire implementation failure.');
        console.warn('   Required: Plan git checkpoints for each subtask.');
        console.warn('   Example: "P1.1 complete → git commit → P1.2 start"');
        console.warn('');

        logBiasDetection('Error Propagation', tool.name, inputs);
      }
    }

    // Case 10: Manual Checklist Reminder (Items 2-4)
    if (isImplementationTask(tool, inputs)) {
      console.log('');
      console.log('📋 PRE-ANALYSIS CHECKLIST (Manual Review):');
      console.log('   ');
      console.log('   [ ] Item 2: Review previous attempts (Confirmation Bias)');
      console.log('       • Check .serena/memories/ for past failures');
      console.log('       • Read FIX_ATTEMPT_LOG.md or git history');
      console.log('       • Ask: Why did previous attempts fail?');
      console.log('   ');
      console.log('   [ ] Item 3: Identify Pareto 20% (Anchoring Bias)');
      console.log('       • Compare 3+ approaches');
      console.log('       • Find 20% effort for 80% effect');
      console.log('       • Avoid 80% effort for 20% effect trap');
      console.log('   ');
      console.log('   [ ] Item 4: Dunning-Kruger correction (Overconfidence)');
      console.log('       • Halve confidence estimates (90% → 45%)');
      console.log('       • List 3 failure scenarios');
      console.log('       • Identify unknown unknowns');
      console.log('   ');
      console.log('   Full checklist: .claude/pre-analysis-checklist.md');
      console.log('');
    }

    // No modifications needed
    return null;

  } catch (error) {
    // Hook should never break the workflow
    console.error(`PreToolUse Hook error: ${error.message}`);
    return null;
  }
}

// ============================================
// HELPER FUNCTIONS (P2.2)
// ============================================

function isImplementationTask(tool, inputs) {
  const implKeywords = [
    'implement', 'create', 'modify', 'add', 'update', 'refactor',
    'build', 'write', 'code', 'develop', 'construct',
    'P1.', 'P2.', 'Phase', 'Task', 'subtask', 'checkpoint',
    '구현', '작성', '수정', '추가' // Korean keywords
  ];

  const inputStr = JSON.stringify(inputs).toLowerCase();
  return implKeywords.some(kw => inputStr.includes(kw.toLowerCase()));
}

function getRecentToolCalls(toolName, withinMinutes) {
  // V1: Simple heuristic - check context for Read mentions
  // V2: Implement session state tracking via .serena/tool_call_history.jsonl

  // For now, return empty array (triggers warning)
  // This is conservative: better false positive than false negative
  return [];
}

function checkForGitKeywords(inputs) {
  const gitKeywords = [
    'git commit', 'checkpoint', 'rollback', 'git add',
    'subtask', 'independent', 'isolated', 'commit message',
    'git status', 'git log'
  ];

  const inputStr = JSON.stringify(inputs).toLowerCase();
  return gitKeywords.some(kw => inputStr.includes(kw.toLowerCase()));
}

function logBiasDetection(biasType, toolName, inputs) {
  try {
    const fs = require('fs');
    const path = require('path');

    const projectRoot = process.cwd();
    const serenaDir = path.join(projectRoot, '.serena');

    // Ensure .serena directory exists
    if (!fs.existsSync(serenaDir)) {
      fs.mkdirSync(serenaDir, { recursive: true });
    }

    const logPath = path.join(serenaDir, 'bias_detection_log.jsonl');
    const logEntry = {
      timestamp: new Date().toISOString(),
      bias_type: biasType,
      tool: toolName,
      inputs_size: JSON.stringify(inputs).length
    };

    fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');
  } catch (error) {
    // Don't break workflow if logging fails
    console.error(`Bias logging error: ${error.message}`);
  }
}

// ============================================
// HOOK EXECUTION (stdin/stdout)
// ============================================

if (require.main === module) {
  let inputData = '';

  process.stdin.setEncoding('utf8');

  process.stdin.on('data', (chunk) => {
    inputData += chunk;
  });

  process.stdin.on('end', () => {
    try {
      const context = JSON.parse(inputData);
      const result = preToolUseHook(context);

      if (result) {
        process.stdout.write(JSON.stringify(result));
      }

      process.exit(0);
    } catch (error) {
      console.error(`Hook execution error: ${error.message}`);
      process.exit(1);
    }
  });
}

// .claude/hooks/subagent-stop.js
// SubagentStop Hook - Serena Memory Integration
// Version: 2.0.0 (Claude Code v2.0.42+ compatible)
// Created: 2025-11-19
// Updated: 2025-12-31

import fs from 'fs/promises';
import path from 'path';

// Configuration: which agents to track
const TRACKED_AGENTS = [
  'prd-auto-executor',
  'general-purpose',
  'Explore',
  'Plan'
];

// Minimum transcript length to save (avoid empty/trivial records)
const MIN_TRANSCRIPT_LENGTH = 500;

/**
 * SubagentStop Hook
 *
 * Automatically saves subagent execution records to Serena Memory.
 * Updated for Claude Code v2.0.42+ with agent_transcript_path support.
 *
 * @param {Object} context - Hook context
 * @param {string} context.agent_id - Subagent identifier (v2.0.42+)
 * @param {string} context.agent_transcript_path - Path to execution transcript (v2.0.42+)
 * @param {string} context.transcript_path - Legacy path (fallback)
 * @param {Object} context.metadata - Execution metadata
 * @param {Object} context.project - Project information
 * @returns {Object|null} - Hook result or null for default behavior
 */
export default async function subagentStopHook({
  agent_id,
  agent_transcript_path,  // v2.0.42+ new field
  transcript_path,        // legacy fallback
  metadata,
  project
}) {
  try {
    // Use new field with fallback to legacy
    const transcriptFile = agent_transcript_path || transcript_path;

    // Check if agent should be tracked
    const shouldTrack = TRACKED_AGENTS.some(tracked =>
      agent_id && agent_id.toLowerCase().includes(tracked.toLowerCase())
    );

    if (!shouldTrack) {
      return null;
    }

    console.log(`📝 SubagentStop Hook: Processing ${agent_id}`);

    // Check if transcript path exists
    if (!transcriptFile) {
      console.warn(`⚠️ No transcript path provided for ${agent_id}`);
      return null;
    }

    // Read transcript
    let transcript = '';
    try {
      transcript = await fs.readFile(transcriptFile, 'utf-8');
    } catch (error) {
      console.warn(`⚠️ Could not read transcript: ${error.message}`);
      return null;
    }

    // Skip trivial transcripts
    if (transcript.length < MIN_TRANSCRIPT_LENGTH) {
      console.log(`⏭️ Skipping short transcript (${transcript.length} chars < ${MIN_TRANSCRIPT_LENGTH})`);
      return null;
    }

    // Extract insights from transcript
    const insights = extractInsights(transcript, metadata);

    // Ensure .serena/memories directory exists
    const memoriesDir = path.join(project.root, '.serena', 'memories');
    try {
      await fs.mkdir(memoriesDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Generate memory file path with agent type prefix
    const dateStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toISOString().split('T')[1].split('.')[0].replace(/:/g, '-');
    const agentType = agent_id.split('-')[0] || 'agent';
    const memoryFileName = `${agentType}_execution_${dateStr}_${timeStr}.md`;
    const memoryPath = path.join(memoriesDir, memoryFileName);

    // Create memory content
    const memoryContent = generateMemoryContent(agent_id, metadata, insights, transcriptFile);

    // Write to Serena Memory
    await fs.writeFile(memoryPath, memoryContent);

    console.log(`✅ Serena Memory saved: ${path.basename(memoryPath)}`);
    console.log(`   Location: ${memoryPath}`);
    console.log(`   Insights: ${insights.completed_tasks.length} tasks, ${insights.failures.length} failures`);

    return null; // Allow default behavior to continue

  } catch (error) {
    // Hook should never break the workflow
    console.error(`SubagentStop Hook error: ${error.message}`);
    return null;
  }
}

/**
 * Extract insights from execution transcript
 */
function extractInsights(transcript, metadata) {
  const insights = {
    summary: '',
    completed_tasks: [],
    failures: [],
    phase0_insights: '',
    lessons: '',
    mcp_calls: [],
    execution_duration: 'N/A'
  };

  // Extract summary (first 500 chars or first paragraph)
  const lines = transcript.split('\n');
  const summaryLines = lines.slice(0, 20).join('\n');
  insights.summary = summaryLines.substring(0, 500) + (summaryLines.length > 500 ? '...' : '');

  // Extract completed tasks (look for ✅, [x], "completed" patterns)
  const taskPatterns = [
    /✅\s+(.+)/g,
    /\[x\]\s+(.+)/gi,
    /completed:\s+(.+)/gi,
    /finished:\s+(.+)/gi
  ];

  taskPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(transcript)) !== null) {
      insights.completed_tasks.push({
        name: match[1].trim().substring(0, 100),
        duration: 'N/A'
      });
    }
  });

  // Extract failures (look for ❌, [failed], "error" patterns)
  const failurePatterns = [
    /❌\s+(.+)/g,
    /\[failed\]\s+(.+)/gi,
    /error:\s+(.+)/gi,
    /failed:\s+(.+)/gi
  ];

  failurePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(transcript)) !== null) {
      const errorText = match[1].trim().substring(0, 200);
      // Filter out meaningless failures (just numbers, too short, etc.)
      if (errorText.length > 10 && !/^\d+\/\d+/.test(errorText)) {
        insights.failures.push({
          name: errorText,
          error: errorText
        });
      }
    }
  });

  // Extract Phase 0 insights (look for "Phase 0", "analysis" sections)
  const phase0Match = transcript.match(/Phase 0[\s\S]{0,1000}/i);
  if (phase0Match) {
    insights.phase0_insights = phase0Match[0].substring(0, 500);
  } else {
    insights.phase0_insights = 'No Phase 0 analysis found in transcript';
  }

  // Extract MCP calls (look for mcp__ patterns)
  const mcpPattern = /mcp__[\w.-]+__[\w_]+/g;
  let mcpMatch;
  const mcpSet = new Set();
  while ((mcpMatch = mcpPattern.exec(transcript)) !== null) {
    mcpSet.add(mcpMatch[0]);
  }
  insights.mcp_calls = Array.from(mcpSet);

  // Extract lessons learned (look for "lesson", "learning", "insight" sections)
  const lessonPatterns = [
    /lessons?\s+learned:?\s*(.+)/gi,
    /key\s+insights?:?\s*(.+)/gi,
    /takeaways?:?\s*(.+)/gi
  ];

  const lessonMatches = [];
  lessonPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(transcript)) !== null) {
      lessonMatches.push(match[1].trim().substring(0, 200));
    }
  });

  insights.lessons = lessonMatches.length > 0
    ? lessonMatches.join('\n- ')
    : 'No explicit lessons documented in transcript';

  // Calculate execution duration (if available in metadata)
  if (metadata && metadata.duration) {
    insights.execution_duration = metadata.duration;
  }

  return insights;
}

/**
 * Generate Serena Memory content
 */
function generateMemoryContent(agent_id, metadata, insights, transcript_path) {
  const transcriptBasename = path.basename(transcript_path);

  const content = `# PRD Execution Record

**Agent ID**: ${agent_id}
**Date**: ${new Date().toISOString()}
**Project**: ${metadata?.project || 'unknown'}
**Execution Duration**: ${insights.execution_duration}

---

## 📊 Execution Summary

${insights.summary}

---

## ✅ Tasks Completed (${insights.completed_tasks.length})

${insights.completed_tasks.length > 0
  ? insights.completed_tasks.map((t, i) => `${i + 1}. ${t.name}`).join('\n')
  : '*No tasks explicitly marked as completed in transcript*'}

---

## ❌ Failures (${insights.failures.length})

${insights.failures.length > 0
  ? insights.failures.map((f, i) => `${i + 1}. **${f.name}**\n   Error: ${f.error}`).join('\n\n')
  : '*No failures detected in transcript*'}

---

## 🧠 Phase 0 Insights

${insights.phase0_insights}

---

## 🔧 MCP Services Used (${insights.mcp_calls.length})

${insights.mcp_calls.length > 0
  ? insights.mcp_calls.map((mcp, i) => `${i + 1}. \`${mcp}\``).join('\n')
  : '*No MCP calls detected in transcript*'}

---

## 💡 Lessons Learned

${insights.lessons}

---

## 📎 Reference

**Full Transcript**: \`${transcriptBasename}\`
**Transcript Path**: \`${transcript_path}\`

---

*🤖 Auto-generated by SubagentStop Hook v2.0.0*
*Generated at: ${new Date().toISOString()}*
`;

  return content;
}

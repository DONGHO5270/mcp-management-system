// .claude/hooks/session-end.js
// SessionEnd Hook - Serena Memory 기반 Session Summary 대체
// Version: 1.0.0
// Purpose: 140k-150k tokens 소비하는 auto summary를 1-5k tokens로 축소

import fs from 'fs/promises';
import path from 'path';

/**
 * SessionEnd Hook
 *
 * 세션 종료 시 핵심만 추출하여 Serena Memory에 저장.
 * 자동 생성되는 140k-150k token session summary 대체.
 *
 * @param {Object} context - Hook context
 * @param {string} context.session_id - Session identifier
 * @param {string} context.transcript_path - Path to session transcript
 * @param {Object} context.metadata - Session metadata
 * @param {Object} context.project - Project information
 * @returns {Object|null} - Hook result or null for default behavior
 */
export default async function sessionEndHook({ session_id, transcript_path, metadata, project }) {
  try {
    console.log(`📝 SessionEnd Hook: Processing session ${session_id || 'unknown'}`);

    // Read transcript
    let transcript = '';
    try {
      transcript = await fs.readFile(transcript_path, 'utf-8');
    } catch (error) {
      console.warn(`⚠️ Could not read transcript: ${error.message}`);
      return null;
    }

    // Extract lightweight session insights (target: 1-5k tokens instead of 140k)
    const insights = extractSessionInsights(transcript, metadata);

    // Ensure .serena/memories directory exists
    const memoriesDir = path.join(project.root, '.serena', 'memories');
    try {
      await fs.mkdir(memoriesDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Generate memory file path
    const dateStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toISOString().split('T')[1].split('.')[0].replace(/:/g, '-');
    const memoryFileName = `session_${dateStr}_${timeStr}.md`;
    const memoryPath = path.join(memoriesDir, memoryFileName);

    // Create lightweight session summary (1-5k tokens)
    const memoryContent = generateSessionSummary(session_id, metadata, insights, transcript_path);

    // Write to Serena Memory
    await fs.writeFile(memoryPath, memoryContent);

    console.log(`✅ Session summary saved: ${path.basename(memoryPath)}`);
    console.log(`   Location: ${memoryPath}`);
    console.log(`   Token savings: ~140k → ~2k (98% reduction)`);

    return null; // Allow default behavior to continue

  } catch (error) {
    // Hook should never break the workflow
    console.error(`SessionEnd Hook error: ${error.message}`);
    return null;
  }
}

/**
 * Extract lightweight session insights (target: 1-5k tokens)
 * Focus on ESSENTIAL information only - skip full conversation history
 */
function extractSessionInsights(transcript, metadata) {
  const insights = {
    key_changes: [],
    decisions_made: [],
    pending_tasks: [],
    next_steps: '',
    files_modified: [],
    skills_used: [],
    token_usage: 'N/A'
  };

  const lines = transcript.split('\n');

  // Extract key changes (files created/modified)
  const filePatterns = [
    /Write\(.+?file_path:\s*"(.+?)"/g,
    /Edit\(.+?file_path:\s*"(.+?)"/g,
    /created:\s*(.+\.(?:js|ts|md|json))/gi,
    /modified:\s*(.+\.(?:js|ts|md|json))/gi
  ];

  const filesSet = new Set();
  filePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(transcript)) !== null) {
      filesSet.add(match[1].trim());
    }
  });
  insights.files_modified = Array.from(filesSet).slice(0, 10); // Top 10 files

  // Extract decisions made (look for decision keywords)
  const decisionPatterns = [
    /decided:\s*(.+)/gi,
    /chose:\s*(.+)/gi,
    /selected:\s*(.+)/gi,
    /recommended:\s*(.+)/gi
  ];

  decisionPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(transcript)) !== null) {
      const decision = match[1].trim().substring(0, 150);
      if (decision.length > 20) {
        insights.decisions_made.push(decision);
      }
    }
  });
  insights.decisions_made = insights.decisions_made.slice(0, 5); // Top 5 decisions

  // Extract pending tasks (TodoWrite entries)
  const todoMatch = transcript.match(/TodoWrite[^}]+todos[^}]+/g);
  if (todoMatch && todoMatch.length > 0) {
    const lastTodo = todoMatch[todoMatch.length - 1];
    const pendingMatch = lastTodo.match(/status.*?pending/g);
    insights.pending_tasks = pendingMatch ?
      pendingMatch.slice(0, 5).map(t => t.replace(/[{}"]/g, '').trim()) :
      [];
  }

  // Extract Skills used
  const skillPattern = /Skill\(\{[^}]*skill:\s*"([^"]+)"/g;
  let skillMatch;
  const skillsSet = new Set();
  while ((skillMatch = skillPattern.exec(transcript)) !== null) {
    skillsSet.add(skillMatch[1]);
  }
  insights.skills_used = Array.from(skillsSet);

  // Extract next steps (look for "next", "TODO", "pending")
  const nextStepsPatterns = [
    /next\s+steps?:(.+)/gi,
    /TODO:(.+)/gi,
    /pending:(.+)/gi
  ];

  const nextStepsMatches = [];
  nextStepsPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(transcript)) !== null) {
      nextStepsMatches.push(match[1].trim().substring(0, 100));
    }
  });
  insights.next_steps = nextStepsMatches.slice(0, 3).join('\n- ');

  // Extract token usage (if available in metadata)
  if (metadata && metadata.token_usage) {
    insights.token_usage = metadata.token_usage;
  }

  return insights;
}

/**
 * Generate lightweight session summary (target: 1-5k tokens)
 *
 * Focus on ESSENTIAL information:
 * - Key file changes (not full diffs)
 * - Decisions made (not full analysis)
 * - Pending tasks (from TodoWrite)
 * - Next steps (actionable items)
 *
 * SKIP:
 * - Full conversation history
 * - Detailed code snippets
 * - Intermediate analysis steps
 */
function generateSessionSummary(session_id, metadata, insights, transcript_path) {
  const transcriptBasename = path.basename(transcript_path);

  const content = `# Session Summary

**Session ID**: ${session_id || 'unknown'}
**Date**: ${new Date().toISOString()}
**Project**: ${metadata?.project || 'unknown'}
**Token Usage**: ${insights.token_usage}

---

## 📁 Key Changes (${insights.files_modified.length})

${insights.files_modified.length > 0
  ? insights.files_modified.map((f, i) => `${i + 1}. \`${f}\``).join('\n')
  : '*No files modified in this session*'}

---

## 🎯 Decisions Made (${insights.decisions_made.length})

${insights.decisions_made.length > 0
  ? insights.decisions_made.map((d, i) => `${i + 1}. ${d}`).join('\n')
  : '*No major decisions recorded*'}

---

## ⏳ Pending Tasks (${insights.pending_tasks.length})

${insights.pending_tasks.length > 0
  ? insights.pending_tasks.map((t, i) => `${i + 1}. ${t}`).join('\n')
  : '*No pending tasks*'}

---

## ➡️ Next Steps

${insights.next_steps || '*No explicit next steps defined*'}

---

## 🔧 Skills Used (${insights.skills_used.length})

${insights.skills_used.length > 0
  ? insights.skills_used.map((s, i) => `${i + 1}. \`${s}\``).join('\n')
  : '*No skills invoked in this session*'}

---

## 📎 Reference

**Full Transcript**: \`${transcriptBasename}\`
**Transcript Path**: \`${transcript_path}\`

---

## 💡 Usage Note

**Purpose**: Lightweight session context (1-5k tokens) instead of 140k-150k auto summary.

**How to use in next session**:
1. Read this file to understand previous session context
2. Focus on "Pending Tasks" and "Next Steps" sections
3. Reference full transcript only if detailed context needed

**Token Efficiency**:
- Previous approach: 140k-150k tokens (70-75% of budget)
- This approach: 1-5k tokens (0.5-2.5% of budget)
- **Savings: ~97% token reduction**

---

*🤖 Auto-generated by SessionEnd Hook v1.0.0*
*Generated at: ${new Date().toISOString()}*
`;

  return content;
}

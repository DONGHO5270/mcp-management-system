/**
 * TaskCompleted Hook
 * 에이전트 작업 완료 시 자동 실행
 *
 * @version 1.0.0
 * @requires Claude Code 2.1.33+
 * @event TaskCompleted
 */

const fs = require('fs');
const path = require('path');

// 설정
const CONFIG = {
  logDir: '.serena/task_logs',
  metricsFile: '.serena/task_metrics.jsonl',
  enableSerenaMemory: true,
  enableNotifications: false,
  trackAgentTypes: ['Explore', 'Plan', 'general-purpose', 'Bash']
};

/**
 * 메인 핸들러
 */
async function handleTaskCompleted(event) {
  try {
    const { task, result, timestamp } = event;

    // 유효성 검사
    if (!task || !task.id) {
      return { success: false, error: 'Invalid event: missing task data' };
    }

    // 1. 기본 로깅
    await logTaskCompletion(task, result, timestamp);

    // 2. 메트릭 수집
    await collectMetrics(task, result);

    // 3. Serena Memory 저장 (선택적)
    if (CONFIG.enableSerenaMemory && task.subagent_type) {
      await saveToSerenaMemory(task, result);
    }

    // 4. 워크플로우 체인 체크
    await checkWorkflowChain(task, result);

    return { success: true, processed: true };
  } catch (error) {
    console.error(`[TaskCompleted] Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * 작업 완료 로깅
 */
async function logTaskCompletion(task, result, timestamp) {
  const logEntry = {
    timestamp: timestamp || new Date().toISOString(),
    taskId: task.id,
    description: task.description || 'No description',
    agentType: task.subagent_type || 'unknown',
    status: task.status || 'completed',
    duration: task.duration_ms || 0,
    tokens: task.token_count || 0,
    toolUses: task.tool_uses || 0,
    success: result?.success ?? true,
    filesCount: result?.files_touched?.length || 0
  };

  // 일별 로그 파일
  const dateStr = new Date(logEntry.timestamp).toISOString().split('T')[0];
  const logFile = path.join(CONFIG.logDir, `tasks_${dateStr}.jsonl`);

  // 디렉토리 생성
  ensureDir(CONFIG.logDir);

  // 로그 추가
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');

  console.log(`[TaskCompleted] ${logEntry.agentType}: ${logEntry.description} (${logEntry.duration}ms, ${logEntry.tokens} tokens)`);
}

/**
 * 메트릭 수집 (집계용)
 */
async function collectMetrics(task, result) {
  const metric = {
    timestamp: new Date().toISOString(),
    agent_type: task.subagent_type || 'unknown',
    duration_ms: task.duration_ms || 0,
    token_count: task.token_count || 0,
    tool_uses: task.tool_uses || 0,
    success: result?.success ?? true
  };

  ensureDir(path.dirname(CONFIG.metricsFile));
  fs.appendFileSync(CONFIG.metricsFile, JSON.stringify(metric) + '\n');
}

/**
 * Serena Memory 저장
 */
async function saveToSerenaMemory(task, result) {
  const memoryContent = `# Task Completed: ${task.description || 'No description'}

## Metadata
- **Task ID**: ${task.id}
- **Agent Type**: ${task.subagent_type}
- **Duration**: ${task.duration_ms || 0}ms
- **Tokens Used**: ${task.token_count || 0}
- **Tool Uses**: ${task.tool_uses || 0}
- **Status**: ${result?.success ? 'Success' : 'Failed'}

## Files Touched
${result?.files_touched?.map(f => `- ${f}`).join('\n') || 'None'}

## Output Summary
${(result?.output || 'No output captured').substring(0, 1000)}
`;

  const dateStr = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
  const filename = path.join('.serena/memories', `task_${task.subagent_type}_${dateStr}.md`);

  ensureDir('.serena/memories');
  fs.writeFileSync(filename, memoryContent);
}

/**
 * 워크플로우 체인 체크
 */
async function checkWorkflowChain(task, result) {
  const chainRules = {
    'Explore': {
      onSuccess: 'Exploration complete. Consider Plan agent for implementation strategy.',
      onFailure: 'Exploration failed. Check search patterns or expand scope.'
    },
    'Plan': {
      onSuccess: 'Planning complete. Ready for implementation phase.',
      onFailure: 'Planning failed. May need more exploration first.'
    },
    'general-purpose': {
      onSuccess: 'Task completed successfully.',
      onFailure: 'Task failed. Review logs for details.'
    }
  };

  const rule = chainRules[task.subagent_type];
  if (rule) {
    const message = result?.success ? rule.onSuccess : rule.onFailure;
    console.log(`[Workflow] ${message}`);
  }
}

/**
 * 디렉토리 생성 헬퍼
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Export for Claude Code hook system
module.exports = { handleTaskCompleted };

// CLI 실행 지원
if (require.main === module) {
  const input = process.argv[2];
  if (input) {
    try {
      const event = JSON.parse(input);
      handleTaskCompleted(event)
        .then(r => {
          console.log(JSON.stringify(r));
          process.exit(r.success ? 0 : 1);
        })
        .catch(e => {
          console.error(e);
          process.exit(1);
        });
    } catch (e) {
      console.error('Invalid JSON input:', e.message);
      process.exit(1);
    }
  } else {
    console.log('Usage: node task-completed.js \'{"task": {...}, "result": {...}}\'');
  }
}

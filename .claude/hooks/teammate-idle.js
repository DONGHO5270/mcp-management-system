/**
 * TeammateIdle Hook
 * Agent Teams 사용 시 팀메이트 대기 상태 감지
 *
 * @version 1.0.0
 * @requires Claude Code 2.1.33+
 * @requires CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
 * @event TeammateIdle
 */

const fs = require('fs');
const path = require('path');

// 설정
const CONFIG = {
  logFile: '.serena/teammate_events.jsonl',
  idleWarningThreshold: 300000,  // 5분
  idleCriticalThreshold: 600000  // 10분
};

/**
 * 메인 핸들러
 */
async function handleTeammateIdle(event) {
  try {
    const { teammate, idle_since, session_id } = event;

    // 유효성 검사
    if (!teammate || !teammate.id) {
      return { success: false, error: 'Invalid event: missing teammate data' };
    }

    const idleDuration = Date.now() - new Date(idle_since).getTime();

    const logEntry = {
      timestamp: new Date().toISOString(),
      event: 'TeammateIdle',
      teammate_id: teammate.id,
      teammate_name: teammate.name || 'Unknown',
      teammate_role: teammate.role || 'Unspecified',
      idle_since: idle_since,
      idle_duration_ms: idleDuration,
      session_id: session_id
    };

    // 로그 기록
    ensureDir(path.dirname(CONFIG.logFile));
    fs.appendFileSync(CONFIG.logFile, JSON.stringify(logEntry) + '\n');

    // 경고 수준 결정
    let severity = 'info';
    let message = `Teammate ${teammate.name} is idle`;

    if (idleDuration > CONFIG.idleCriticalThreshold) {
      severity = 'critical';
      message = `CRITICAL: ${teammate.name} has been idle for ${Math.round(idleDuration / 60000)}min - consider reassigning or checking status`;
    } else if (idleDuration > CONFIG.idleWarningThreshold) {
      severity = 'warning';
      message = `WARNING: ${teammate.name} has been idle for ${Math.round(idleDuration / 60000)}min`;
    }

    console.log(`[TeammateIdle:${severity}] ${message}`);

    return {
      success: true,
      acknowledged: true,
      severity,
      idle_duration_ms: idleDuration
    };
  } catch (error) {
    console.error(`[TeammateIdle] Error: ${error.message}`);
    return { success: false, error: error.message };
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
module.exports = { handleTeammateIdle };

// CLI 실행 지원
if (require.main === module) {
  const input = process.argv[2];
  if (input) {
    try {
      const event = JSON.parse(input);
      handleTeammateIdle(event)
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
    console.log('Usage: node teammate-idle.js \'{"teammate": {...}, "idle_since": "...", "session_id": "..."}\'');
  }
}

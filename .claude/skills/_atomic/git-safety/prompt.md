# git-safety Atomic Skill

**Version**: 1.0.0
**Type**: Atomic (독립 실행 가능)
**Purpose**: Git checkpoint + rollback 로직 - 안전한 코드 변경 및 복구

## Overview

prd-auto-executor에서 추출한 핵심 안전 기능:
- Git checkpoint 생성 (작업 전 상태 저장)
- Validation 실패 시 자동 롤백
- 상태 확인 및 복구 가능 여부 판단

## MCP Dependencies

| Service | Operations | Purpose |
|---------|------------|---------|
| (none) | Bash commands | Git CLI 직접 사용 |

## Usage Pattern

### Standalone (Atomic)
```
/git-safety checkpoint "작업 전 백업"
/git-safety rollback checkpoint_abc123
```

### As Dependency (Composite)
```yaml
# In composite skill's skill.md
dependencies:
  - _atomic/git-safety
```

## Core Operations

### 1. Create Checkpoint
```javascript
async function createCheckpoint(message) {
  // 현재 상태 확인
  const status = await bash("git status --porcelain");

  if (status.trim()) {
    // 변경사항 있으면 stash
    await bash(`git stash push -m "checkpoint: ${message}"`);
    return { checkpoint_id: getStashId(), type: "stash" };
  } else {
    // 변경사항 없으면 현재 commit hash 저장
    const hash = await bash("git rev-parse HEAD");
    return { checkpoint_id: hash.trim(), type: "commit" };
  }
}
```

### 2. Restore Checkpoint
```javascript
async function restoreCheckpoint(checkpointId, type) {
  if (type === "stash") {
    await bash(`git stash pop ${checkpointId}`);
  } else {
    await bash(`git reset --hard ${checkpointId}`);
  }
  return { restored: true, checkpoint_id: checkpointId };
}
```

### 3. Status Check
```javascript
async function checkStatus() {
  const status = await bash("git status --porcelain");
  const stashList = await bash("git stash list");

  return {
    has_changes: status.trim().length > 0,
    stash_count: stashList.split('\n').filter(l => l).length,
    can_rollback: true
  };
}
```

## Safety Rules

| Rule | Description |
|------|-------------|
| Checkpoint First | 작업 전 반드시 checkpoint 생성 |
| Validate Before Commit | 테스트 통과 후에만 commit |
| Rollback on Fail | 검증 실패 시 즉시 rollback |
| No Force Push | force push 절대 금지 |

## Output Format

```json
{
  "checkpoint_id": "stash@{0}",
  "status": "created",
  "can_rollback": true,
  "changes": {
    "modified": 3,
    "added": 1,
    "deleted": 0
  },
  "timestamp": "2026-01-01T10:00:00Z"
}
```

## Token Estimate

| Operation | Tokens | Time |
|-----------|--------|------|
| Create Checkpoint | 50-100 | <5s |
| Restore | 50-100 | <5s |
| Status Check | 30-50 | <3s |
| **Total** | **130-250** | **<15s** |

## Dependent Skills

This Atomic is used by:
- prd-auto-executor (primary)
- deployment-checklist (optional)

---

**Created**: 2026-01-01
**Extracted From**: prd-auto-executor v1.1.0

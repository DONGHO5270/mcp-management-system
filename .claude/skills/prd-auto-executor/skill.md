---
name: prd-auto-executor
version: 2.0.0
type: composite
description: Semi-automated PRD execution with Git safety and intelligent MCP selection
dependencies:
  - _atomic/prd-tracker
  - _atomic/git-safety
  - _atomic/session-memory
auto_load: true
subagent_compatible: true
permission_mode: "interactive"
tags:
  - prd
  - automation
  - git-safety
  - serena-memory
  - mcp-integration
  - validation
skill_dependencies:
  - prd-implementation-tracker
  - mcp-selector
capabilities:
  - task_execution
  - git_rollback
  - sdd_validation
  - state_persistence
  - phase0_analysis
---

# prd-auto-executor Skill

Semi-automated PRD checklist execution with Git safety.

## Mission

Execute PRD checklists with:
- Git checkpoint safety (automatic rollback on failure)
- SDD-style verification (test/build/lint)
- User approval at every step
- State persistence for session resume

## Execution Flow

### Phase 1: Initialize
- Load `execution_state.json` (resume if exists)
- Load checklist JSON from prd-implementation-tracker

### Phase 2: Task Loop
```
FOR EACH task:
  1. Create Git checkpoint
  2. Request user approval (승인/건너뛰기/중단)
  3. Execute task (Claude performs work)
  4. Validate (npm test/build/lint)
  5. Success → Git commit | Failure → Rollback
  6. Save state
```

### Phase 3: Complete
- Summary report (completed/failed/skipped)

## Safety Rules

| Rule | Description |
|------|-------------|
| Checkpoint First | Always create checkpoint BEFORE task |
| Rollback on Fail | Rollback on any validation failure |
| Save State | Save after every operation |
| Approval Required | Never auto-execute without approval |

---

**Detailed protocol and examples**: See `prompt.md`

---
name: git-safety
version: 1.0.0
description: Git checkpoint + rollback 로직 - 안전한 코드 변경 및 복구
type: atomic
mcp_dependencies: {}
operations:
  - checkpoint_create (git stash/commit)
  - checkpoint_restore (git reset/stash pop)
  - status_check (git status/diff)
outputs:
  schema: json
  format: "{ checkpoint_id, status, can_rollback }"
inputs:
  required: ["operation"]
  optional: ["checkpoint_id", "message", "files"]
metadata:
  created: "2026-01-01"
  extracted_from: "prd-auto-executor v1.1.0"
---

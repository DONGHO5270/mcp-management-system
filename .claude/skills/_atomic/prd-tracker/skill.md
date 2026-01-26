---
name: prd-tracker
version: 1.0.0
description: PRD 파싱 + TodoWrite 통합 - 계층적 작업 추출 및 상태 관리
type: atomic
mcp_dependencies:
  serena-memory: "^1.0.0"
operations:
  - write_memory (state persistence)
  - read_memory (state retrieval)
  - list_memories (discovery)
outputs:
  schema: json
  format: "{ tasks[], hierarchy, metadata, state }"
inputs:
  required: ["prd_content"]
  optional: ["uiux_guide", "functional_spec", "existing_state"]
metadata:
  created: "2026-01-01"
  extracted_from: "prd-implementation-tracker v2.0.0"
---

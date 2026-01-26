---
name: session-memory
version: 1.0.0
description: Serena Memory 래퍼 - 세션 상태 및 프로젝트 기억 관리
type: atomic
mcp_dependencies:
  serena-memory: "^1.0.0"
operations:
  - write_memory (state persistence)
  - read_memory (state retrieval)
  - list_memories (discovery)
  - delete_memory (cleanup)
outputs:
  schema: json
  format: "{ success, memory_name, content }"
inputs:
  required: ["operation"]
  optional: ["memory_name", "content", "filter"]
fallback:
  enabled: true
  primary: serena-memory
  secondary: file-system (.claude/cache/)
  tertiary: context (in-memory)
metadata:
  created: "2026-01-01"
  spof_status: "Fallback 구현으로 85% → 15% 연쇄 실패 확률 감소"
---

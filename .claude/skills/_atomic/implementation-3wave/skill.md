---
name: implementation-3wave
version: 1.0.0
description: 3-Wave 병렬 구현 워크플로우 - 고품질 코드 생성
type: atomic
mcp_dependencies:
  sequential-thinking-tools: "^1.0.0"
  stochastic-thinking: "^2.0.0"
  serena-memory: "^1.0.0"
operations:
  - sequential_thinking (implementation planning)
  - stochastic_analysis (success probability)
  - write_memory (baseline storage)
outputs:
  schema: json
  format: "{ implementation_plan, tasks[], risk_assessment, baseline }"
inputs:
  required: ["feature_description"]
  optional: ["context", "constraints", "existing_code"]
metadata:
  created: "2026-01-01"
  extracted_from: "implementation-workflow v2.1.0"
---

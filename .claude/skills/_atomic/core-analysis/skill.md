---
name: core-analysis
version: 1.0.0
description: 5-Task 병렬 분석 엔진 - clear-thought-1.5 캡슐화
type: atomic
mcp_dependencies:
  clear-thought-1.5: "^1.0.0"
  clear-thought: "^1.0.0"
  sequential-thinking-tools: "^1.0.0"
operations:
  - clear_thought (sequential_thinking, mental_model, systems_thinking)
  - sequentialthinking (10 thoughts chain)
  - mentalmodel (first_principles, opportunity_cost, error_propagation)
outputs:
  schema: json
  format: "{ analysis, insights[], confidence, recommendations[] }"
inputs:
  required: ["query"]
  optional: ["context", "depth"]
metadata:
  created: "2026-01-01"
  extracted_from: "multidimensional-analysis v3.4.0 W1"
---

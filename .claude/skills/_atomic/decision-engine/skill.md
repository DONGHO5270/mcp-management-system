---
name: decision-engine
version: 1.0.0
description: 4-Step 빠른 의사결정 엔진 + bias-detection
type: atomic
mcp_dependencies:
  stochastic-thinking: "^2.0.0"
  model-enhancement-servers: "^1.0.0"
  clear-thought-1.5: "^1.5.0"
operations:
  - stochastic_analysis (MDP, Bayesian, Bandit)
  - enhance_reasoning (bias-detection)
  - clear_thought (decision_framework)
outputs:
  schema: json
  format: "{ decision, confidence, alternatives[], risks[], biases[] }"
inputs:
  required: ["query", "options"]
  optional: ["context", "constraints", "risk_level"]
metadata:
  created: "2026-01-01"
  extracted_from: "decision-workflow v2.9.0 Quick Mode"
  phase2_status: "bias-detection 영구 통합 (2025-12-29)"
---

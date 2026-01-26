---
name: multidimensional-analysis
version: 4.0.0
type: composite
description: 연구급 다차원 분석 - Level 2~5 선택형 시스템
dependencies:
  - _atomic/core-analysis
  - _atomic/decision-engine
  - _atomic/session-memory
autoLoad: true
levels:
  2: [core-analysis]
  3: [core-analysis, decision-engine]
  4: [core-analysis, decision-engine, session-memory]
  5: [ALL]
subagent_compatible: true
permission_mode: "ask"
mcp_dependencies:
  sequential-thinking-tools: "^1.0.0"
  stochastic-thinking: "^2.0.0"
  serena-memory: "^1.0.0"
  clear-thought: "^1.0.0"
  model-enhancement-servers: "^1.0.0"
  clear-thought-1.5: "^1.5.0"
token_budget:
  level5_research: 3800-5300
  level4_production: 3400-4500
  level3_standard: 2300-3000
  level2_quick: 1400-1800
metadata:
  release_date: "2025-12-28"
  design: "Top-down (Performance-first → Efficiency ladder)"
  mcp_services: 6
  mcp_operations: 46
  confidence_range: "86-99.7%+"
---

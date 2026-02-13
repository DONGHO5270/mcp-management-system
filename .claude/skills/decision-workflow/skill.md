---
name: decision-workflow
version: 3.1.0
type: composite
description: Hybrid B+ 의사결정 워크플로우 - Quick/Deep Mode + bias-detection
dependencies:
  - _atomic/decision-engine
  - _atomic/session-memory
autoLoad: true
modes:
  quick: [decision-engine]
  deep: [decision-engine, session-memory]
subagent_compatible: true
permission_mode: "ask"
mcp_dependencies:
  sequential-thinking-tools: "^1.0.0"
  stochastic-thinking: "^2.0.0"
  serena-memory: "^1.0.0"
  clear-thought: "^1.0.0"
  clear-thought-1.5: "^1.5.0"
token_budget:
  quick: 200-350
  deep: 350-600
metadata:
  phase2_status: "Complete (2025-12-29)"
  bias_detection: "영구 통합 (가치 4.0/5)"
# Claude Code 2.1.33+ Task Restrictions
tools:
  - Task(Plan)              # 의사결정 계획만 허용
  - Read
  - Glob
  - Grep
# Claude Code 2.1.33+ Memory
memory:
  scope: project
  categories:
    - decision_history
    - trade_off_analysis
    - consensus_records
---

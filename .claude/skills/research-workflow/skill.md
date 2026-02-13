---
name: research-workflow
version: 3.1.0
type: composite
description: Hybrid B+ 리서치 워크플로우 - Quick/Deep Mode + bias-detection
dependencies:
  - _atomic/core-analysis
  - _atomic/decision-engine
  - _atomic/session-memory
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
  deep: 600-850
metadata:
  phase2_status: "Complete (2025-12-29)"
  bias_detection: "영구 통합 (가치 4.0/5)"
# Claude Code 2.1.33+ Task Restrictions
tools:
  - Task(Explore)           # 탐색 전용 - 다른 에이전트 차단
  - Read
  - Glob
  - Grep
  - WebFetch
  - WebSearch
# Claude Code 2.1.33+ Memory
memory:
  scope: project
  categories:
    - research_findings
    - source_references
    - hypotheses
---

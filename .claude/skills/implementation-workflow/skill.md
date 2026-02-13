---
name: implementation-workflow
version: 3.1.0
type: composite
description: 고품질 기능 구현을 위한 3-Wave 병렬 인지 강화 워크플로우
dependencies:
  - _atomic/implementation-3wave
  - _atomic/session-memory
autoLoad: true
subagent_compatible: true
permission_mode: "ask"
mcp_dependencies:
  sequential-thinking-tools: "^1.0.0"
  stochastic-thinking: "^2.0.0"
  serena-memory: "^1.0.0"
compatible_templates:
  - v5.5.8
# Claude Code 2.1.33+ Task Restrictions
tools:
  - Task(Explore)           # 코드 분석
  - Task(Bash)              # 빌드/테스트 실행
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
# Claude Code 2.1.33+ Memory
memory:
  scope: project
  categories:
    - implementation_progress
    - code_changes
    - test_results
---

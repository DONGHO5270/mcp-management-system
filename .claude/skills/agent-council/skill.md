---
name: agent-council
version: 2.0.0
type: composite
description: 5-Persona 전문가 토론 시스템 - Architect/CFO/DevOps/Security/PM 다관점 합의 의사결정 (800-1200 tokens). Team Attention 컨셉 구현, MCP collaborative_reasoning + bias-detection 활용. Agent Teams (2.1.32+) 지원.
dependencies:
  - _atomic/decision-engine
  - _atomic/session-memory
autoLoad: false
auto_load: false
subagent_compatible: true
permission_mode: "ask"
# Claude Code 2.1.32+ Agent Teams 통합
experimental:
  agentTeams: true
  teamDefinition: ".claude/teams/council.yaml"
# Claude Code 2.1.33+ Task Restrictions
tools:
  - Task(Plan)              # 각 페르소나의 계획 수립
  - Task(Explore)           # 기술 정보 탐색
  - Read
  - Grep
  - Glob
# Claude Code 2.1.33+ Memory
memory:
  scope: project
  categories:
    - council_decisions
    - consensus_history
    - dissent_records
allowed-tools:
  - Read
  - Grep
  - Glob
  - clear-thought
  - clear-thought-1.5
  - stochastic-thinking
  - serena-memory
tags:
  - agent-council
  - multi-persona
  - collaborative-decision
  - team-attention
  - expert-panel
  - consensus-building
  - mcp-integration
triggers:
  - "전문가 의견"
  - "다관점 검토"
  - "팀 토론"
  - "전문가 패널"
  - "합의 도출"
  - "expert panel"
  - "multi-perspective review"
  - "team consensus"
  - "stakeholder analysis"
capabilities:
  - 5-Persona Expert Panel (Architect, CFO, DevOps, Security, PM)
  - Round-based Discussion (3 rounds: Opinion → Challenge → Consensus)
  - Weighted Consensus Calculation (Stochastic)
  - Bias Detection across Personas
  - Compatible with multidimensional-analysis (parallel execution)
  - MCP Integration: collaborative_reasoning, bias-detection, stochastic weighting
mcp_dependencies:
  clear-thought: "^1.0.0"
  clear-thought-1.5: "^1.5.0"
  stochastic-thinking: "^2.0.0"
  model-enhancement-servers: "^1.0.0"
  serena-memory: "^1.0.0"
mcp_verified:
  clear-thought-1.5:
    operations:
      - collaborative_reasoning (다관점 협업 토론, persona-based)
    verification_status: "Verified"
    note: "5-persona 시스템에 최적화된 도구"
  clear-thought:
    operations:
      - collaborativereasoning (페르소나 정의 및 토론 구조)
    verification_status: "Verified"
  model-enhancement-servers:
    operations:
      - bias-detection (각 페르소나 의견의 편향 검사)
    verification_status: "Phase 2 Complete (2025-12-29)"
  stochastic-thinking:
    operations:
      - bayesian (합의 가중치 계산)
    verification_status: "Stage 1 passed (2025-12-28)"
compatible_templates:
  - v5.5.8
token_budget:
  total: 800-1200
  persona_definition: 50-100
  round1_opinions: 200-300
  round2_challenges: 250-350
  round3_consensus: 200-300
  final_synthesis: 100-150
  bias_detection_overhead: +50
  stochastic_overhead: +100
differentiation:
  vs_multidimensional_analysis: "Agent Council은 인간 전문가 시뮬레이션 (5-persona), MDA는 기술 분석 심층화 (5-dimensional). 병렬 사용 가능."
  vs_decision_workflow: "Agent Council은 이해관계자 합의 (stakeholder consensus), Decision Workflow은 개인 의사결정 (single decision maker)."
usage_scenarios:
  - "고위험 의사결정 시 다양한 전문가 관점 필요"
  - "팀 합의가 중요한 아키텍처 결정"
  - "이해관계자 충돌 예상 시 사전 시뮬레이션"
  - "Production 배포 전 다관점 검증"
  - "조직 전체 영향 분석 (재무/기술/운영/보안/일정)"
---

# Agent Council Skill

**Version**: 1.0.0
**Purpose**: 5-Persona 전문가 토론을 통한 다관점 합의 의사결정

## 개요

Team Attention 컨셉을 MCP 기반으로 구현한 전문가 패널 시뮬레이션 시스템입니다.

### 5-Persona 구성

1. **🏗️ Architect** (기술 아키텍처 관점)
   - 기술적 실현 가능성
   - 시스템 설계 품질
   - 기술 부채 영향

2. **💰 CFO** (비용/ROI 관점)
   - 초기 투자 비용
   - 운영 비용 (OpEx)
   - ROI 및 payback period

3. **🔧 DevOps** (운영/배포 관점)
   - 배포 복잡도
   - 모니터링 요구사항
   - 운영 안정성

4. **🛡️ Security** (보안 관점)
   - 보안 취약점
   - Compliance 요구사항
   - 데이터 보호

5. **📊 PM** (일정/리소스 관점)
   - 개발 일정
   - 팀 리소스 할당
   - 마일스톤 달성 가능성

### 워크플로우

**Round 1** (Opinion): 각 페르소나별 초안 의견 (MCP: collaborative_reasoning)
**Round 2** (Challenge): 페르소나 간 반박 및 질문 (MCP: bias-detection)
**Round 3** (Consensus): 가중 합의 도출 (MCP: stochastic weighting)

### MCP 통합

- **clear-thought-1.5** (collaborative_reasoning): 페르소나 간 구조화된 토론
- **clear-thought** (collaborativereasoning): 페르소나 정의 및 역할
- **model-enhancement-servers** (bias-detection): 각 페르소나 의견 편향 검사
- **stochastic-thinking** (bayesian): 합의 가중치 계산

### 토큰 예산

| 단계 | 토큰 | 비고 |
|------|------|------|
| Persona 정의 | 50-100 | 5-persona 배경 |
| Round 1 | 200-300 | 5 × 40-60 tokens/persona |
| Round 2 | 250-350 | 반박/질문 |
| Round 3 | 200-300 | 합의 도출 |
| Final Synthesis | 100-150 | 최종 통합 |
| **Total** | **800-1200** | MCP overhead 포함 |

## 사용 시나리오

### 적합한 경우
- 고위험 의사결정 (팀 합의 필요)
- 이해관계자 충돌 예상
- 다관점 검증 필요 (기술/재무/운영/보안/일정)
- Production 배포 전 사전 검토

### 부적합한 경우
- 개인 의사결정 (→ decision-workflow 사용)
- 기술 심층 분석 (→ multidimensional-analysis 사용)
- 빠른 결정 필요 (800-1200 tokens 소요)

## 병렬 사용 (Multidimensional Analysis)

Agent Council과 Multidimensional Analysis는 **상호 보완적**입니다:

```
Case 1: 기술 + 인간 관점 병렬 분석
- multidimensional-analysis (Level 4): 기술 심층 분석 (3400-4600 tokens)
- agent-council: 이해관계자 합의 시뮬레이션 (800-1200 tokens)
- Total: 4200-5800 tokens
- 효과: 기술적 엄격성 + 조직 합의

Case 2: 순차 사용
- agent-council → 합의 도출 → multidimensional-analysis로 검증
- multidimensional-analysis → 기술 분석 → agent-council로 이해관계자 설득 시뮬레이션
```

## 참조

**상세 워크플로우**: `prompt.md`
**MCP Operations**: clear-thought-1.5 collaborative_reasoning, bias-detection, stochastic bayesian

---

**Release Date**: 2026-01-25
**Design Pattern**: Composite Skill (decision-engine + session-memory)
**MCP Integration**: 4 services, 4 operations
**Token Range**: 800-1200
**Confidence Range**: 85-92% (합의 기반)

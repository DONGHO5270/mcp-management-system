---
name: implementation-workflow
version: 3.0.0
type: composite
description: 고품질 기능 구현을 위한 3-Wave 병렬 인지 강화 워크플로우. 구현, 개발, 기능 추가 작업에 사용. 체계적인 분석과 의사결정을 통한 고품질 코드 생성.
dependencies:
  - _atomic/implementation-3wave
  - _atomic/session-memory
autoLoad: true
auto_load: true
subagent_compatible: true
permission_mode: "ask"
tags:
  - implementation-workflow
  - feature-development
  - 3-wave-parallel
  - code-quality
  - mcp-integration
mcp_dependencies:
  sequential-thinking-tools: "^1.0.0"
  stochastic-thinking: "^2.0.0"
  model-enhancement-servers: "^1.0.0"
  serena-memory: "^1.0.0"
compatible_templates:
  - v5.5.8
triggers:
  - 구현
  - 개발
  - 기능 추가
  - implementation
  - feature development
capabilities:
  - sequential_thinking
  - first_principles_analysis
  - systems_thinking
  - stochastic_analysis
  - bias_detection
  - collaborative_reasoning
  - scientific_method
---

# Implementation Workflow (3-Wave)

고품질 기능 구현을 위한 3-Wave 병렬 인지 강화 워크플로우.

## Conditional Execution

- **S1**: Phase 0 FULL → Baseline 저장
- **S2+**: Baseline 로드 → Coverage ≥70% → Phase 0 SKIP

## 3-Wave Structure

### W1: 병렬 분석 (4 Tasks 동시)
- **TA**: Sequential + First Principles (현재상태, 의존성, 구현전략, 테스트계획)
- **TB**: Systems + Visual + Causal (시스템 의존성, 원인-결과 체인)
- **TC**: Stochastic + Scientific (성공 확률, 가설 검증)
- **TD**: Bias + Collaborative + Analogical (편향 검사, 다관점, 유사 사례)

### W2: 통합 논증
- Thesis → Antithesis → Synthesis
- Decision Framework + Ulysses Protocol

### W3: 메타인지
- 품질 검증 + Baseline 저장

## Success Criteria

- [ ] W1: 4 Task 병렬 완료 + 텍스트 출력
- [ ] W2: 변증법 + Decision 완료
- [ ] W3: 메타인지 + Baseline 저장
- [ ] Token: S1<800 | S2+<200

---

**Detailed execution guide**: See `prompt.md`

---
name: research-workflow
version: 3.0.0
type: composite
description: Hybrid B+ 리서치 워크플로우 - Quick Mode (단순 조사) + Deep Mode (심층 리서치) + Phase 2 Complete (bias-detection 영구 통합) (6개 MCP 서비스)
dependencies:
  - _atomic/core-analysis
  - _atomic/decision-engine
  - _atomic/session-memory
auto_load: true
subagent_compatible: true
permission_mode: "ask"
allowed-tools:
  - Read
  - Grep
  - Glob
  - WebSearch
  - WebFetch
  - sequential-thinking-tools
  - stochastic-thinking
  - serena-memory
  - clear-thought
  - clear-thought-1.5
tags:
  - research-workflow
  - hybrid-mode
  - quick-research
  - deep-analysis
  - bias-detection
  - mcp-integration
  - verification-gate
  - cognitive-enhancement
triggers:
  - "리서치"
  - "조사"
  - "탐색"
  - "기술 선택"
  - "대안 분석"
  - "research"
  - "explore"
  - "심층 리서치"
  - "기술 비교"
  - "문헌 조사"
  - "자료 수집"
capabilities:
  - Quick Mode: 4-Step 빠른 리서치 (200-350 tokens)
  - Deep Mode: 3-Wave 심층 분석 (600-850 tokens)
  - MCP 통합: Sequential Thinking + Clear Thought + Stochastic Thinking + clear-thought-1.5 (6 operations)
  - 순차적 리서치 분해 (sequential_thinking)
  - 시스템 사고 (systems_thinking)
  - 유사 연구 패턴 탐색 (analogical_reasoning)
  - 과학적 방법론 (scientific_method)
  - 다관점 리서치 (collaborative_reasoning)
  - 구조화된 논증 (structured_argumentation)
  - 자동 모드 전환 (복잡도 기반)
mcp_dependencies:
  sequential-thinking-tools: "^1.0.0"
  stochastic-thinking: "^2.0.0"
  serena-memory: "^1.0.0"
  clear-thought: "^1.0.0"
  clear-thought-1.5: "^1.5.0"
  model-enhancement-servers: "^1.0.0"
mcp_verified:
  clear-thought:
    operations:
      - mentalmodel (first_principles, opportunity_cost, error_propagation)
      - debuggingapproach (root_cause_analysis for research gaps)
    verification_status: "Stage 1 passed (2025-12-28)"
    verification_date: "2025-12-28"
    success_rate: "100% (2/2 tests)"
clear-thought-1.5:
    operations:
      - systems_thinking (시스템 사고, 정보 생태계 분석)
      - scientific_method (과학적 방법론, 가설 검증)
      - structured_argumentation (논증 구조화, 주장-근거)
      - analogical_reasoning (유사 연구 패턴 탐색)
      - sequential_thinking (순차적 리서치 분해)
      - collaborative_reasoning (다관점 리서치)
    verification_status: "Re-verified successfully (2025-12-28)"
    verification_date: "2025-12-28"
    success_rate: "100% (6/6 research operations tested)"
    note: "이전 '템플릿 시스템' 오판 정정 - 프레임워크 제공자로 정상 작동"
    total_operations: "30+ operations available"
  model-enhancement-servers:
    operations:
      - bias-detection (편향 검출 및 완화, Deep Mode W1 RA)
    verification_status: "Phase 2 Complete (2025-12-29)"
    verification_date: "2025-12-29"
    success_rate: "100% (Phase 2 TC4-6, 가치 4.0/5)"
    note: "Phase 2 Option A - bias-detection 영구 통합. analogical-reasoning은 clear-thought-1.5 사용"
mcp_pending_verification:
  context7:
    features:
      - library_resolution
      - documentation_retrieval
    verification_status: "Not yet tested"
    purpose: "환각 방지 (문헌 조사 시)"
compatible_templates:
  - v5.5.8
token_budget:
  quick: 200-350
  deep: 600-850
  cognitive_enhancement_overhead: +50-150 per module
verification_gates:
  stage1:
    status: "✅ Completed (2025-12-28)"
    tests:
      - clear-thought-1.5 작동 확인: ✅ Passed (6/6 research operations)
      - clear-thought 작동 확인: ✅ Passed (2/2 tests)
    result: "2/2 passed - Full MCP integration"
circuit_breakers:
  - "출처 < 3개 → 추가 조사 필요"
  - "신뢰도 < 70% → 신뢰도 검증 강화"
  - "토큰 > 1000 → 롤백"
---

## ⭐ v2.9.0 변경사항 (2025-12-29)

**Phase 2 Complete**: bias-detection 영구 통합

**v2.8.0 → v2.9.0 개선사항**:
- **Phase 2 결과 반영**: Pilot → Complete
- **검증 근거**: Phase 2 TC4-6 tests (가치 4.0/5)
  - TC4 (Quick Mode): Baseline 확립, 85% 신뢰도
  - TC5 (Deep Mode 기술 비교): bias-detection 일관 작동
  - TC6 (Deep Mode 문헌 조사): bias-detection 일관 작동
- **변경 사항**: Version bump only (기능 변화 없음)
- **MCP Services**: 6개 유지 (bias-detection 영구 통합)

**Phase 2 Complete**:
- ✅ **Phase 1**: decision-workflow v2.8.0 성공 (2025-12-29)
- ✅ **Phase 2**: multidimensional v3.4.0 + research v2.9.0 (2025-12-29)
- ✅ **Option A 채택**: bias-detection만 영구 통합

## 📋 v2.8.0 변경사항 (2025-12-29)

**Phase 2 Pilot**: model-enhancement-servers bias-detection 재도입

**v2.7.0 → v2.8.0 개선사항**:
- **MCP Services**: 5개 → **6개** (+model-enhancement-servers)
- **재도입 모듈**: bias-detection (편향 검출 및 완화)
- **적용 위치**: Deep Mode W1 RA (Research Analysis with bias detection)
- **검증 근거**: decision-workflow Phase 1 성공 (TC1-5, 신뢰도 +1%p, 가치 4.4/5)
- **토큰 영향**: +0-50 tokens (기존 MCP 대체 가능)

**Phase 2 전략**:
- ✅ **Phase 1**: decision-workflow v2.8.0 성공 (2025-12-29)
- 🚧 **Phase 2**: multidimensional-analysis v3.3.0 + research-workflow v2.8.0 (검증 중)
- ⏳ **Phase 3**: 성공 시 영구 통합 / 실패 시 decision-workflow만 유지

**변경 배경**:
- 2025-12-27: "템플릿 시스템" 오판으로 model-enhancement-servers 제거
- 2025-12-28: Framework Provider 패턴 확인 (8/8 modules re-evaluated)
- 2025-12-29: 점진적 재도입 전략 (60k tokens vs 126k 전면 롤백, 52% 절감)

**Note**: analogical-reasoning은 clear-thought-1.5에 이미 존재하므로 model-enhancement-servers에서 제외

---

# Research Workflow (Hybrid B+)

정보 수집을 위한 Quick/Deep 하이브리드 워크플로우.

## Mode Selection

| Condition | Mode | Tokens |
|-----------|------|--------|
| 단순 조사, 빠른 확인 | **Quick** | 200-300 |
| 기술 비교, 심층 분석 | **Deep** | 600-800 |
| 복잡도 ≥5점 | Auto → Deep | - |

## Quick Mode (4-Step)

1. **R1: 목표 정의** - 핵심 질문 + 범위 + 성공 기준
2. **R2: 정보 수집** - 출처 3개+ 수집 + 신뢰도 평가
3. **R3: 핵심 요약** - 발견 + 권장사항 + 추가 조사 필요 여부
4. **R4: Serena 저장** - 리서치 히스토리 (선택)

## Deep Mode (3-Wave)

1. **W1: 4 Task 병렬** - RA(Sequential+FP), RB(Systems+Causal), RC(Stochastic+Analogical), RD(Bias+Scientific)
2. **W2: 통합 논증** - Thesis(주결론) → Antithesis(대안) → Synthesis(검증)
3. **W3: 메타인지** - 품질 검증 + Serena 저장

## Checklist

- 출처 3개+ 확보
- 신뢰도 평가 완료
- 편향 검사 (Deep)
- 불확실성 명시

---

**Detailed execution guide**: See `prompt.md`

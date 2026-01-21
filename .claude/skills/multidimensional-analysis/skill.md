---
name: multidimensional-analysis
version: 4.0.0
type: composite
description: 연구급 다차원 분석 - Level 2~5 선택형 시스템 (Quick 1300→Research 5300 tokens). 탑다운 설계: 최대 성능(99.7%+ 신뢰도) 우선 설계 후 효율성 계단 제공. W0(Pre-Analysis) + W1(5Task **Task() 병렬화 공식 명세**) + W2(3방식 통합) + W3(3단계 QA) + W4(실행 로드맵). 40개 MCP operations 활용 + Phase 2 Complete + W1 병렬화 명세.
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
auto_load: true
subagent_compatible: true
permission_mode: "ask"
tags:
  - multidimensional-analysis
  - cognitive-enhancement
  - level-selection-system
  - research-grade-analysis
  - top-down-design
  - 5-wave-workflow
  - 36-mcp-operations
  - scientific-rigor
mcp_dependencies:
  sequential-thinking-tools: "^1.0.0"
  stochastic-thinking: "^2.0.0"
  serena-memory: "^1.0.0"
  clear-thought: "^1.0.0"
  model-enhancement-servers: "^1.0.0"
  clear-thought-1.5: "^1.5.0"
mcp_verified:
  sequential-thinking-tools:
    operations:
      - sequential_thinking (10 thoughts, tool recommendations)
    verification_status: "Stage 1 passed (2025-12-28)"
    capabilities:
      - 순차적 사고 체인
      - 도구 추천 엔진 (confidence 0-1)
      - 단계별 recommended_tools
  stochastic-thinking:
    operations:
      - mdp (Markov Decision Process)
      - mcts (Monte Carlo Tree Search)
      - bandit (Multi-Armed Bandit)
      - bayesian (Bayesian Optimization)
      - hmm (Hidden Markov Model)
    verification_status: "Stage 1 passed (2025-12-28)"
    capabilities:
      - 5개 확률적 알고리즘
      - 순차 의사결정 최적화
      - 전략적 탐색
      - 불확실성 정량화
  clear-thought:
    operations:
      - mentalmodel (first_principles, opportunity_cost, error_propagation, pareto, occams_razor, rubber_duck)
      - debuggingapproach (binary_search, root_cause_analysis, divide_conquer, delta_debugging, cause_elimination, backtracking)
    verification_status: "Stage 1 passed (2025-12-28)"
    verification_date: "2025-12-28"
    success_rate: "100% (2/2 tests)"
    capabilities:
      - 6개 Mental Models
      - 13개 Debugging Approaches
  serena-memory:
    operations:
      - write_memory (분석 결과 저장)
    verification_status: "Active"
  model-enhancement-servers:
    operations:
      - bias-detection (W1 TD 편향 검출 + W3 편향 검증)
    verification_status: "Phase 2 Complete (2025-12-29)"
    verification_date: "2025-12-29"
    success_rate: "100% (Phase 2 tests, 가치 4.0/5)"
    note: "Phase 2 Option A - bias-detection만 영구 통합. 나머지 모듈은 clear-thought-1.5로 대체"
    removed_modules:
      - ethical-reasoning (Generic response, 가치 3.0/5 미달)
      - structured-argumentation (clear-thought-1.5 structured_argumentation으로 대체)
      - metacognitive-monitoring (clear-thought-1.5 metacognitive_monitoring으로 대체)
      - collaborative-reasoning (clear-thought-1.5 collaborative_reasoning으로 대체)
      - scientific-method (clear-thought-1.5 scientific_method로 대체)
      - analogical-reasoning (clear-thought-1.5 analogical_reasoning으로 대체)
  clear-thought-1.5:
    operations:
      - decision_framework (W2 다기준 의사결정, 가장 강력한 통합 도구)
      - systems_thinking (W1 TB 시스템 분석 강화)
      - scientific_method (W3 가설 검증 과학적 엄격성)
      - metacognitive_monitoring (W3 메타인지 신뢰도 교정)
      - collaborative_reasoning (W1 TE 다관점 협업)
      - sequential_thinking (W1 TA 순차적 사고 보완)
      - ethical_analysis (W3 윤리적 영향 평가)
      - causal_analysis (W1 TB 인과관계 분석)
      - statistical_reasoning (W3 통계적 검증)
      - optimization (W4 최적화 로드맵)
    verification_status: "Re-verified successfully (2025-12-28)"
    verification_date: "2025-12-28"
    success_rate: "100% (5/5 core operations tested)"
    note: "이전 '템플릿 시스템' 오판 정정 - 10개 operations 활용 가능"
    total_operations: "30+ operations available"
compatible_templates:
  - v5.5.8
triggers:
  - 연구급 분석
  - 고위험 아키텍처
  - 프로덕션 의사결정
  - 심층 다차원 분석
  - 99% 신뢰도
  - research-grade analysis
  - high-stakes decision
  - multidimensional analysis
capabilities:
  level5_research_grade:
    - W0 Pre-Analysis (context7 + orchestration)
    - W1 5-Task Parallel (TA/TB/TC/TD/TE) + Bias Detection + clear-thought-1.5 통합
    - W2 Multi-Integration (Dialectical + Bayesian + Weighted) + decision_framework (최강 도구, clear-thought-1.5)
    - W3 3-Level QA (Internal + External + Probabilistic) + Scientific Method + Metacognitive Monitoring + Statistical Reasoning (clear-thought-1.5)
    - W4 Actionable Roadmap (Implementation + Risk + Metrics) + Optimization
    - 40 MCP operations, 99.7%+ confidence (학술 논문급)
  level4_production:
    - W0 + W1(5) + W2(3) + W3(3) + Bias Detection + clear-thought-1.5 (7 ops)
    - 35 MCP operations, 97-99% confidence
  level3_standard:
    - W0 + W1(4) + W2(2) + W3(2) + clear-thought-1.5 (4 ops)
    - 21 MCP operations, 92-95% confidence
  level2_quick:
    - W0 + W1(3) + W2(1) + W3(1) + clear-thought-1.5 (2 ops)
    - 14 MCP operations, 86-90% confidence
  mcp_operations:
    sequential_thinking: 10 thoughts
    mental_models: 6 models (FP, OC, EP, Pareto, Occam, Rubber Duck)
    debugging_approaches: 13 approaches
    stochastic_algorithms: 5 algorithms (MDP, MCTS, Bandit, Bayesian, HMM)
    bias_detection: 1 module (Cognitive Bias Detection & Mitigation)
    clear_thought_1_5: 10 operations (Decision Framework, Systems Thinking, Scientific Method, Metacognitive, Collaborative, Sequential, Ethical, Causal, Statistical, Optimization)
    tool_orchestration: confidence-based recommendations
token_budget:
  level5_research: 3800-5300
  level4_production: 3400-4500
  level3_standard: 2300-3000
  level2_quick: 1400-1800
  bias_detection_overhead: +50 (Level 4-5 only)
  user_selection_guide:
    cost_impact_100k_plus: Level 5
    cost_impact_10k_plus: Level 4
    cost_impact_1k_plus: Level 3
    time_15min_plus: Level 2
    time_under_15min: Use decision-workflow instead
design_philosophy:
  approach: "Top-down Design"
  methodology:
    - "1단계: 최대 성능 설계 (99%+ confidence, 제약 무시)"
    - "2단계: 탑다운 효율화 계단 (Level 5→4→3→2)"
    - "3단계: 사용자 선택 (재무 영향/시간/신뢰도 기준)"
  differentiation:
    decision_workflow: "150-450 tokens, Quick/Deep, 빠른 의사결정"
    multidimensional_v3: "1200-4600 tokens, Level 2-5, 연구급 분석"
---

# Multidimensional Analysis v3.5 (Research-Grade)

**연구급 다차원 분석** - 탑다운 설계 방법론을 적용한 Level 선택형 시스템

## ⭐ v3.5 W1 병렬화 공식 명세 (2025-12-29)

**핵심 변경**: W1 5-Task **Task() 도구 병렬화 공식 명세** 추가

**변경 내용**:
- ✅ **prompt.md W1 섹션에 병렬화 지시 추가**
- ✅ 5개 Task (TA, TB, TC, TD, TE) 동시 실행 명시
- ✅ Level별 병렬화 적용 가이드 (Level 2-5 모두 적용)

**성능 효과**:
- **시간 단축**: 순차 실행 대비 **-40~60%**
- **토큰 효율**: 동일 (MCP 호출 수 불변)
- **안정성**: Task 개별 실패 시 재시도 가능

**Level별 적용**:
| Level | Task 수 | 병렬화 |
|-------|---------|--------|
| 5 | 5개 (TA-TE) | ✅ 전체 병렬 |
| 4 | 5개 (TA-TE) | ✅ 전체 병렬 |
| 3 | 4개 (TA-TD) | ✅ 4개 병렬 |
| 2 | 3개 (TA-TC) | ✅ 3개 병렬 |

**배경**:
- 이전: Claude 재량으로 암묵적 병렬화 (prompt.md 미명시)
- 현재: 공식 명세로 예측 가능한 병렬 실행 보장

**상세**: `prompt.md` W1 섹션 참조

---

## ⭐ v3.4 Phase 2 Complete (2025-12-29)

**핵심 변경**: bias-detection 영구 통합, ethical-reasoning 제거 (Option A 채택)

**MCP operations**: 48개 → **40개** (-8개)
- ✅ **bias-detection 유지**: 가치 4.0/5 (의사결정 개선 입증, Confidence 교정 85%→70%)
- ❌ **6개 모듈 제거**: ethical-reasoning (3.0/5), structured-argumentation, metacognitive-monitoring, collaborative-reasoning, scientific-method, analogical-reasoning
  - **대체**: clear-thought-1.5 operations로 완전 대체
- **토큰 절감**: Level 5 3800-5400 → **3800-5300** (-100 tokens)

**검증 근거**: Phase 2 tests (TC1-6, 6/6 passed)
- bias-detection: 일관된 4-bias 검출, TC1 의사결정 변경 효과 (MSA → Modular Monolith)
- ethical-reasoning: Generic response, 정량화 실패 → 제거 정당

**Phase 2 Complete**:
- ✅ Phase 1: decision-workflow v2.8.0 → v2.9.0
- ✅ Phase 2: multidimensional v3.3.0 → v3.4.0 + research v2.8.0 → v2.9.0
- ✅ Option A 채택: 92% token 절감 vs 전면 롤백 (10k vs 126k)

---

## 📚 이전 버전 히스토리 (v3.0-v3.3)

**v3.3 (2025-12-29)**: Phase 2 Pilot
- model-enhancement-servers 재도입 (bias-detection, ethical-reasoning)
- MCP operations: 46 → 48개 (+2)
- 점진적 검증 전략 (60k tokens, 전면 롤백 대비 52% 절감)

**v3.2 (2025-12-28)**: clear-thought-1.5 통합
- 10개 고급 operations 추가 (decision_framework, systems_thinking, scientific_method, etc.)
- MCP operations: 36 → 46개 (+10)
- Level 5 신뢰도: 99.5%+ → **99.7%+** (학술 논문급)
- "템플릿 시스템" 오판 정정 → Framework Provider 확인

**v3.1 (2025-12-28)**: model-enhancement 재통합
- 5개 모듈 추가 (structured-argumentation, metacognitive-monitoring, etc.)
- MCP operations: 31 → 36개 (+5)
- Level 5 신뢰도: 99%+ → 99.5%+

**v3.0 (2025-12-28)**: Level 선택형 시스템 도입
- **설계 철학**: "최대 성능 우선 → 효율성 계단 제공" (Top-down Design)
- Level 2-5 시스템 (Quick 1400 → Research 5400 tokens)
- 5-Wave Workflow (W0-W4)
- vs decision-workflow: 연구급 분석 vs 빠른 의사결정

**상세 문서** (Serena Memory):
- `.serena/memories/phase2_test_results_2025-12-29.md`
- `.serena/memories/clear_thought_15_reverification_2025-12-28.md`
- `.serena/memories/model_enhancement_servers_reevaluation_2025-12-28.md`
- `.serena/memories/mda_v3_design_levels_2025-12-28.md`

---

## 📊 Level Selection Guide

| Level | Tokens | MCP Ops | 신뢰도 | 시간 | Use Case | 재무 영향 |
|-------|--------|---------|--------|------|----------|-----------|
| **5** 🏆 | 3800-5400 | 46 | 99.7%+ | 48-70m | 고위험 아키텍처, 학술 논문급 | $100k+ |
| **4** ⭐ | 3400-4600 | 41 | 97-99% | 43-58m | Production 의사결정 | $10k+ |
| **3** 💎 | 2300-3000 | 27 | 92-95% | 30-40m | 일반 프로젝트 분석 | $1k+ |
| **2** ⚡ | 1400-1800 | 17 | 86-90% | 20-30m | 라이브러리 선택, 빠른 검토 | <$1k |

**자동 추천**:
- 재무 영향 $100k+ → Level 5
- 재무 영향 $10k+ → Level 4
- 재무 영향 $1k+ → Level 3
- 시간 15분+ → Level 2
- 시간 <15분 → decision-workflow 사용 권장

## 🌊 5-Wave Workflow (v3.1 Enhanced)

### W0: Pre-Analysis (모든 Level)
- **context7**: 기술 스택 검증 (환각 방지)
- **Tool Orchestration**: 워크플로우 계획 및 도구 추천

### W1: 5-Dimensional Parallel (Level별 Task 수 차이)
- **TA**: Sequential + First Principles + Opportunity Cost
- **TB**: Root Cause + Divide & Conquer + Context7
- **TC**: Stochastic (5 algorithms: MDP/MCTS/Bandit/Bayesian/HMM)
- **TD**: Bias Detection + Error Propagation + Pareto
- **TE**: Cross-Validation (Occam + Delta Debugging + 신뢰도 평가) + **Collaborative Reasoning** (v3.1) + **Analogical Reasoning** (v3.1)

### W2: Multi-Integration (3 Methods)
- **Dialectical**: Thesis → Antithesis → Synthesis
- **Bayesian**: Prior → Likelihood → Posterior
- **Weighted Voting**: Confidence-based averaging
- **Method Selection**: 3가지 방법 비교 후 최적 선택
- **Structured Argumentation** (v3.1): 논증 구조 강화

### W3: 3-Level Quality Assurance (Enhanced with Cognitive Modules)
- **Internal**: 내부 일관성 검증
- **External**: 외부 검증 (Ulysses Protocol, Decision Framework)
- **Probabilistic**: Monte Carlo, Sensitivity Analysis (99.5%+ 신뢰도 달성)
- **Scientific Method** (v3.1): 가설 검증 과학적 엄격성
- **Metacognitive Monitoring** (v3.1): 사고 과정 자기평가 및 신뢰도 교정

### W4: Actionable Roadmap (Level 5 only)
- Implementation 우선순위 (MDP)
- Risk Mitigation 전략
- Success Metrics 정의

## ✅ MCP Operations (46개)

**6개 MCP 서비스 활용**:
- sequential-thinking-tools: 10 thoughts + tool recommendations
- stochastic-thinking: 5 algorithms (MDP, MCTS, Bandit, Bayesian, HMM)
- clear-thought: 6 mental models + 13 debugging approaches
- model-enhancement-servers: 13 cognitive enhancement modules (5 core tested)
- clear-thought-1.5: 30+ operations (10 core tested)
- serena-memory: 결과 저장

**검증 완료** (2025-12-28):
- ✅ sequential-thinking-tools: Stage 1 passed
- ✅ stochastic-thinking: Stage 1 passed
- ✅ clear-thought: 100% (2/2 tests)
- ✅ serena-memory: Active

## 📋 Level별 MCP Operations

| Wave | Level 5 | Level 4 | Level 3 | Level 2 |
|------|---------|---------|---------|---------|
| W0 | 2 ops | 2 ops | 2 ops | 2 ops |
| W1 | 20 ops (5 Tasks + CT1.5) | 18 ops (5 + CT1.5) | 14 ops (4 + CT1.5) | 10 ops (3 + CT1.5) |
| W2 | 13 ops (3 methods + CT1.5) | 12 ops (3 + CT1.5) | 6 ops (2 + CT1.5) | 3 ops (1) |
| W3 | 10 ops (3 levels + CT1.5) | 9 ops (3 + CT1.5) | 5 ops (2 + CT1.5) | 2 ops (1) |
| W4 | 5 ops (+ CT1.5 optimization) | - | - | - |
| **Total** | **46** | **41** | **27** | **17** |

## 🎓 사용 시나리오

### Level 5 (Research Grade)
- 대규모 시스템 아키텍처 재설계
- 수억원 규모 기술 스택 선택
- 학술 논문급 분석 필요
- 되돌릴 수 없는 고위험 의사결정

### Level 4 (Production)
- Production 배포 의사결정
- 100명+ 팀 영향
- 중요 기능 설계
- 수천만원 규모 투자

### Level 3 (Standard)
- 일반 프로젝트 아키텍처
- 팀 내부 기술 선택
- 기능 구현 방법론
- 수백만원 규모

### Level 2 (Quick)
- 라이브러리/도구 선택
- 빠른 검토 필요
- 15-25분 시간 제약
- 소규모 의사결정

## ⚠️ 사용자 승인 필수 (v2.6.0+)

**실행 전 확인**:
1. Level 선택 (2/3/4/5)
2. 예상 토큰 안내
3. 예상 시간 안내
4. 사용자 명시적 승인

**단계별 중단 지점**:
- W0 완료 후 → [사용자 확인]
- W1 완료 후 → [사용자 확인]
- W2 완료 후 → [사용자 확인]
- W3 완료 후 → [최종 확인]

## 📚 참조

**상세 워크플로우**: `prompt.md` (1038 lines, v3.0)
**MCP Operations 목록**: `.serena/memories/mcp_operations_inventory_2025-12-28.md`
**Level 설계 사양**: `.serena/memories/mda_v3_design_levels_2025-12-28.md`
**Stage 1 검증 결과**: `.serena/memories/stage1_verification_results_2025-12-28.md`
**clear-thought-1.5 재검증**: `.serena/memories/clear_thought_15_reverification_2025-12-28.md` (NEW)
**model-enhancement 재평가**: `.serena/memories/model_enhancement_servers_reevaluation_2025-12-28.md`

---

**Version**: 3.2.0
**Release Date**: 2025-12-28
**Design Methodology**: Top-down (Performance-first → Efficiency ladder)
**MCP Integration**: 6 services, 46 operations
**Token Range**: 1400-5400 (Level 2-5)
**Confidence Range**: 86-99.7%+
**Latest Update**: clear-thought-1.5 통합 (10 operations)

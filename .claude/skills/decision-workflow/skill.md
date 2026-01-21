---
name: decision-workflow
version: 3.0.0
type: composite
description: Hybrid B+ 의사결정 워크플로우 - Quick Mode (기본) + Deep Mode (고위험) + Phase 2 Complete (bias-detection 영구 통합)
dependencies:
  - _atomic/decision-engine
  - _atomic/session-memory
autoLoad: true
modes:
  quick: [decision-engine]
  deep: [decision-engine, session-memory]
auto_load: true
subagent_compatible: true
permission_mode: "ask"
allowed-tools:
  - Read
  - Grep
  - Glob
  - sequential-thinking-tools
  - stochastic-thinking
  - serena-memory
  - clear-thought
  - clear-thought-1.5
  - model-enhancement-servers
tags:
  - decision-workflow
  - hybrid-mode
  - quick-decision
  - deep-analysis
  - mcp-integration
  - verification-gate
  - cognitive-enhancement
triggers:
  - "의사결정"
  - "선택"
  - "비교"
  - "A vs B"
  - "어떤 것을 선택"
  - "추천"
  - "결정"
  - "심층 의사결정"
  - "중요한 결정"
  - "아키텍처"
  - "MSA"
  - "모노리스"
  - "마이크로서비스"
  - "시스템 설계"
capabilities:
  - Quick Mode: 4-Step 빠른 의사결정 (200-350 tokens)
  - Deep Mode: 3-Wave 심층 분석 (350-600 tokens)
  - MCP 통합: Sequential Thinking + Clear Thought + Stochastic Thinking + Bias Detection
  - First Principles 분석 (mentalmodel)
  - Root Cause 디버깅 (debuggingapproach)
  - 편향 감지 및 완화 (bias-detection)
  - 다기준 의사결정 (decision-framework via clear-thought-1.5)
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
      - debuggingapproach (binary_search, root_cause_analysis, divide_conquer)
    verification_status: "Stage 1 passed (2025-12-28)"
    verification_date: "2025-12-28"
    success_rate: "100% (2/2 tests)"
  model-enhancement-servers:
    operations:
      - bias-detection (인지 편향 감지 및 완화)
    verification_status: "Phase 2 Complete (2025-12-29)"
    verification_date: "2025-12-29"
    success_rate: "100% (Phase 1+2 tests, 가치 4.0/5)"
    note: "Phase 2 Option A - bias-detection 영구 통합, ethical-reasoning 제거 (가치 3.0/5)"
    removed_modules:
      - ethical-reasoning (Generic response, 가치 미달)
      - decision-framework (clear-thought-1.5로 대체)
  clear-thought-1.5:
    operations:
      - decision_framework (다기준 의사결정, model-enhancement보다 강력)
      - systems_thinking (시스템 사고, components/relationships 분석)
      - scientific_method (과학적 방법론, 가설 검증)
      - metacognitive_monitoring (메타인지 모니터링, 신뢰도 교정)
      - collaborative_reasoning (다관점 협업, 더 구조화됨)
    verification_status: "Re-verified successfully (2025-12-28)"
    verification_date: "2025-12-28"
    success_rate: "100% (5/5 core operations tested)"
    note: "이전 '템플릿 시스템' 오판 정정 - 프레임워크 제공자로 정상 작동"
    total_operations: "30+ operations available"
mcp_pending_verification:
  context7:
    features:
      - library_resolution
      - documentation_retrieval
    verification_status: "Not yet tested"
    purpose: "환각 방지 (코드 생성 시)"
compatible_templates:
  - v5.5.8
token_budget:
  quick: 200-350
  deep: 350-600
  cognitive_enhancement_overhead: +50 per bias-detection
verification_gates:
  phase2:
    status: "✅ Completed (2025-12-29)"
    tests:
      - multidimensional TC1-3: ✅ Passed (bias-detection 가치 4.0/5)
      - research TC4-6: ✅ Passed (bias-detection 일관 작동)
      - ethical-reasoning: ❌ Failed (가치 3.0/5, generic response)
    result: "Option A 채택 - bias-detection만 영구 통합"
    rollback_savings: "92% tokens (10k vs 126k 전면 롤백)"
circuit_breakers:
  - "가치 평가 < 4.0/5 → 제거"
  - "Generic response 지속 → 제거"
  - "토큰 > 600 → 롤백"
---

# decision-workflow Skill

**Version**: 2.9.0
**Purpose**: 고품질 의사결정을 위한 MCP 통합 워크플로우

Quick/Deep Mode 워크플로우 및 MCP 호출 지시는 **prompt.md 참조 필수**.

**⚠️ 중요**: 이 Skill 실행 시 반드시 prompt.md를 읽고 지시에 따라 MCP를 호출하세요.

## ✅ Phase 2 Complete - bias-detection 영구 통합 (v2.9.0)

**검증 일자**: 2025-12-29

**현재 활성화 MCP** (6/6, 100%):
- ✅ **sequential-thinking-tools** - 순차적 사고 + 도구 추천
- ✅ **stochastic-thinking** - 확률적 의사결정 (MDP, MCTS, Bandit, Bayesian, HMM)
- ✅ **serena-memory** - 프로젝트 기억 저장
- ✅ **clear-thought** - First Principles + Root Cause 분석 (6 models, 13 approaches)
- ✅ **clear-thought-1.5** - 고급 인지 도구 (30+ operations)
- ✅ **model-enhancement-servers** - bias-detection (Phase 2 영구 통합)

**Phase 2 검증 결과** (2025-12-29):
- ✅ bias-detection: 6/6 tests passed, 가치 4.0/5
  - TC1: 의사결정 변경 효과 입증 (MSA → Modular Monolith)
  - Confidence 교정: 85% → 70% (불확실성 인정)
  - 일관된 작동 (항상 4 biases 검출)
- ❌ ethical-reasoning: 제거됨 (가치 3.0/5)
  - Generic response, 이해관계자 영향 정량화 실패
  - clear-thought-1.5 scientific_method로 대체
- **Total Operations**: ~45개 (sequential 10 + stochastic 5 + clear-thought 19 + model-enhancement 1 + clear-thought-1.5 5 core + serena 5)

**v2.9.0 개선사항** (Phase 2 Option A - from v2.8.0):
- ✅ **bias-detection 영구 통합** (가치 4.0/5)
  - 의사결정 품질 개선 입증
  - Confidence 교정 효과 (85% → 70%)
  - 토큰 오버헤드 +50 (acceptable)
- ❌ **ethical-reasoning 제거** (가치 3.0/5)
  - Generic response로 실질적 도움 제한적
  - clear-thought-1.5 scientific_method로 대체 가능
- **토큰 절감**: Deep Mode 400-650 → **350-600** (-50 tokens)
- **MCP 활용률**: 유지 (6/6, 100%)

**v2.8.0 개선사항** (Phase 1 Pilot - from v2.7.0):
- model-enhancement-servers **재도입** (점진적 검증 전략)
- 재도입 모듈: bias-detection, ethical-reasoning, decision-framework (3/13 modules)
- MCP 활용률: 85.7% (6/7) → **100% (6/6)** (+14.3%p)
- 검증 전략: Phase 1 (decision-workflow만) → Phase 2 (성공 시 확장)
- 비용: ~15k tokens (전면 Rollback 126k 대비 88% 절감)

**v2.7.0 개선사항** (from v2.6.0):
- MCP 활용률: 71.4% (5/7) → **85.7% (6/7)** (+14.3%p)
- MCP Operations: ~20개 → **~50개** (+30개, clear-thought-1.5)
- 신뢰도: 97-98%+ → **98-99%+** (과학적 방법론 + 메타인지)
- 추가 기능: 시스템 사고, 과학적 방법론, 메타인지 모니터링
- 토큰: +100-200 (강력한 프레임워크 비용)

**검증 상세**:
- `.serena/memories/phase2_test_results_2025-12-29.md`
- `.serena/memories/stage1_verification_results_2025-12-28.md`
- `.serena/memories/model_enhancement_servers_reevaluation_2025-12-28.md`
- `.serena/memories/clear_thought_15_reverification_2025-12-28.md`

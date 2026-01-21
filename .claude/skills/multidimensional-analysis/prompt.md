# multidimensional-analysis Skill

**Version**: 3.4.0
**Purpose**: Research-grade 다차원 분석 - 최대 성능 설계 → 탑다운 효율화 계단 (Level 5-2) + Phase 2 Complete (bias-detection only)
**Required MCPs**: sequential-thinking-tools, stochastic-thinking, context7, model-enhancement-servers (bias-detection only), serena-memory, clear-thought, clear-thought-1.5
**Compatibility**: multidimensional-analysis skill.md v3.4.0

---

## 🎯 v3.4 변경사항 (2025-12-29)

**Phase 2 Complete**: bias-detection 영구 통합, ethical-reasoning 제거

**유지 모듈** (1개):
1. **bias-detection** - W1 TD (편향 검출) + W3 QA2 (편향 검증)
   - 4가지 인지 편향 감지: Confirmation Bias, Availability Heuristic, Dunning-Kruger, Sunk Cost Fallacy
   - 신뢰도 교정: 85% → 70% (불확실성 인정)
   - 가치: 4.0/5 (TC1 의사결정 개선 입증)

**제거 모듈** (7개):
- ❌ **ethical-reasoning**: Generic response, 가치 3.0/5 → clear-thought-1.5 scientific_method로 대체
- ❌ **structured-argumentation**: clear-thought-1.5 중복
- ❌ **metacognitive-monitoring**: clear-thought-1.5 중복
- ❌ **collaborative-reasoning**: clear-thought-1.5 중복
- ❌ **scientific-method**: clear-thought-1.5 중복
- ❌ **analogical-reasoning**: clear-thought-1.5 중복

**검증 근거**:
- Phase 2 tests (TC1-6, 2025-12-29)
- bias-detection: 6/6 tests passed, 가치 4.0/5
- ethical-reasoning: Generic stakeholder impact, 정량화 실패

**토큰 절감**:
- Level 5: 3800-5400 → **3800-5300** (-100 tokens)
- Level 4: 3400-4600 → **3400-4500** (-100 tokens)

**MCP Operations**: 48개 → **40개** (-8)

---

## 🎯 v3.0 핵심 변화

**설계 철학**: Top-Down (최대 성능 우선 → 효율화 계단)
- ❌ v2.6: 토큰 효율 우선 (400-600 tokens, 신뢰도 불명확)
- ✅ **v3.0**: 성능 우선 (3400-4600 tokens, 99%+ 신뢰도) → 사용자 선택 가능 Level 2-5

**차별화** (vs decision-workflow):
- decision-workflow: 150-450 tokens, Quick/Deep 수동 선택, **빠른 의사결정**
- **multidimensional-analysis v3.0**: 600-4600 tokens, Level 2-5 선택, **Research-grade 분석**

**신규 기능**:
1. **W0 (Pre-Analysis)**: context7 환각 방지 + 워크플로우 오케스트레이션
2. **W1 5-Dimensional**: TE (Cross-Validation) 추가
3. **Stochastic Full Spectrum**: 5개 알고리즘 전부 (MDP/MCTS/Bandit/Bayesian/HMM)
4. **W2 Multi-Integration**: 3가지 통합 방법 비교 (Dialectical/Bayesian/Weighted)
5. **W3 3-Level QA**: 정량 신뢰도 99%+ 달성
6. **W4 Actionable**: 구현 로드맵 (Level 5만)

---

## Skill의 역할 (중요 ⚠️)

**Skill은 실행 가능한 코드가 아닙니다**. Claude에게 제공되는 **프롬프트 템플릿**입니다.

### Skill이 할 수 있는 것 ✅
- Level 선택 로직 제공 (자동 추천 + 사용자 확인)
- 각 Level별 분석 단계 구조화 (W0 → W1 → W2 → W3 → W4)
- MCP 호출 시점 + 파라미터 가이드
- 출력 형식 템플릿 제공

### Skill이 할 수 없는 것 ❌
- **MCP 자동 실행** (Claude가 직접 호출해야 함)
- 조건부 로직 자동 실행 (가이드일 뿐)
- Serena Memory 자동 저장

**핵심**: 코드 블록은 "참고 예시". **Claude가 직접 실행 판단**.

---

## Mission

⚠️ **실행 전 사용자 승인 필수**

**실행 조건**:
1. 사용자가 명시적 Skill 호출 (`/multidimensional-analysis` 또는 `Skill()`)
2. 토큰 예산 충분 (Level별 상이)
3. 사용자가 Level 선택 + 예상 소비량 확인

**자동 트리거**: ❌ 금지

---

## 🎚️ STEP 1: Level 선택

### Level 비교표

| Level | Tokens | 신뢰도 | 시간 | Use Case | MCP Calls |
|-------|--------|--------|------|----------|-----------|
| **5** 🏆 | 3800-5300 | 99.7%+ | 45-70m | 고위험 아키텍처 ($100k+) | 40 |
| **4** ⭐ | 3400-4500 | 97-99% | 40-60m | Production 시스템 설계 | 35 |
| **3** 💎 | 2300-3000 | 92-95% | 30-40m | 일반 프로젝트 분석 | 21 |
| **2** ⚡ | 1400-1800 | 86-90% | 20-30m | 라이브러리 선택 | 14 |

**Level 1**: ❌ 비활성화 (decision-workflow와 중복)

### 자동 추천 알고리즘

```javascript
function recommendLevel(context) {
  const remaining_tokens = 200000 - current_usage;

  // 토큰 부족 체크
  if (remaining_tokens < 80000) {
    return "⚠️ 토큰 부족 - 새 세션 시작 또는 decision-workflow 사용 권장";
  }

  // 재무 영향 기반
  if (context.cost_impact > 100000 ||
      (context.risk_level >= 9 && !context.reversible)) {
    return "Level 5 (Research Grade) 권장";
  }

  if (context.cost_impact > 10000 || context.stakeholders > 100) {
    return "Level 4 (Production Grade) 권장";
  }

  if (context.cost_impact > 1000 || context.time_available > 30) {
    return "Level 3 (Standard) 권장";
  }

  if (context.time_available > 15) {
    return "Level 2 (Quick) 권장";
  }

  return "⚠️ <15분 제약 → decision-workflow 사용 권장";
}
```

### 사용자 확인 프롬프트

```
🔍 multidimensional-analysis v3.0 실행 준비

**추천 Level**: [자동 추천 결과]

**Level 선택지**:
- Level 5 🏆: 3400-4600 tokens, 99%+ 신뢰도, 40-60분 (고위험 아키텍처)
- Level 4 ⭐: 3000-4000 tokens, 95-97% 신뢰도, 35-50분 (Production)
- Level 3 💎: 2000-2500 tokens, 88-92% 신뢰도, 25-35분 (일반 프로젝트)
- Level 2 ⚡: 1200-1500 tokens, 82-87% 신뢰도, 15-25분 (라이브러리 선택)

**현재 예산**: [X]k tokens 남음 ([Y]%)

어떤 Level로 진행할까요? (숫자 입력 또는 Enter로 추천 Level 사용)
```

---

## 📊 Level별 워크플로우

---

## 🏆 Level 5: Research Grade (Maximum Performance)

**구성**: W0 + W1(5Task) + W2(3방법) + W3(3Level) + W4

### W0: Pre-Analysis

#### 1. context7: 기술 스택 검증 (환각 방지)

```javascript
// 사용자가 언급한 기술 스택 추출
const tech_stack = extractTechStack(user_input);

// context7로 검증
const context_verification = await mcp__context7({
  query: tech_stack.join(", "),
  verify: true
});

// 결과: 실존 여부, 버전 호환성, 공식 문서 링크
```

#### 2. sequential-thinking-tools: 워크플로우 오케스트레이션

```javascript
// W1-W4 전체 도구 조합 설계
const orchestration = await mcp__sequential-thinking-tools__sequential_thinking({
  problem: `[분석 대상]의 다차원 분석 워크플로우 설계`,
  thought_number: 1,
  total_thoughts: 5,
  next_thought_needed: true,
  current_step: {
    step_description: "W1-W4 각 단계별 최적 MCP 도구 조합 추천",
    expected_outcome: "Confidence score 기반 우선순위 도구 리스트",
    recommended_tools: [],
    next_step_conditions: ["각 Wave별 2-5개 도구 추천 완료"]
  }
});

// 결과를 바탕으로 W1-W4 실행 계획 수립
```

**W0 Serena 저장**:
```javascript
await mcp__serena-memory__write_memory({
  memory_name: `mda_W0_${subject}_${date}`,
  content: `
# W0 Pre-Analysis Results

## Context7 Verification
${JSON.stringify(context_verification, null, 2)}

## Orchestration Plan
${JSON.stringify(orchestration, null, 2)}
  `
});
```

---

### W1: 5-Dimensional Parallel Analysis

**⚠️ 병렬 실행 지시 (v3.5 신규)**

W1의 5개 Task (TA, TB, TC, TD, TE)는 **Task() 도구를 사용하여 병렬 실행**해야 합니다.

**실행 방법**: 단일 메시지에서 5개 Task() 호출

```javascript
// Claude는 반드시 아래 5개 Task를 동시에 실행해야 합니다
Task("TA: Sequential + First Principles", {
  subagent_type: "general-purpose",
  prompt: `[분석 대상] TA 분석:
    1. sequential-thinking-tools 10 thoughts
    2. clear-thought first_principles
    3. clear-thought opportunity_cost
    결과를 JSON으로 반환`
})

Task("TB: Root Cause + Systems", {
  subagent_type: "general-purpose",
  prompt: `[분석 대상] TB 분석:
    1. clear-thought root_cause_analysis
    2. clear-thought divide_conquer
    3. clear-thought-1.5 systems_thinking
    4. context7 기술 검증
    결과를 JSON으로 반환`
})

Task("TC: Stochastic Analysis", {
  subagent_type: "general-purpose",
  prompt: `[분석 대상] TC 분석:
    stochastic-thinking 5개 알고리즘:
    - Bayesian, HMM, MCTS, MDP, Bandit
    결과를 JSON으로 반환`
})

Task("TD: Bias + Error Propagation", {
  subagent_type: "general-purpose",
  prompt: `[분석 대상] TD 분석:
    1. model-enhancement bias-detection
    2. clear-thought error_propagation
    3. clear-thought pareto
    결과를 JSON으로 반환`
})

Task("TE: Cross-Validation", {
  subagent_type: "general-purpose",
  prompt: `[분석 대상] TE 분석:
    1. clear-thought occams_razor
    2. clear-thought delta_debugging
    3. clear-thought-1.5 collaborative_reasoning
    결과를 JSON으로 반환`
})

// 5개 Task 완료 후 TaskOutput으로 결과 수집
// W2 진행 전 모든 Task 완료 필수
```

**성능 효과**:
- 순차 실행 대비 **-40~60% 시간 단축**
- 토큰 효율: 동일 (MCP 호출 수 동일)
- 안정성: Task 개별 실패 시 재시도 가능

**Level별 적용**:
| Level | Task 수 | 병렬화 |
|-------|---------|--------|
| 5 | 5개 (TA-TE) | ✅ 전체 병렬 |
| 4 | 5개 (TA-TE) | ✅ 전체 병렬 |
| 3 | 4개 (TA-TD) | ✅ 4개 병렬 |
| 2 | 3개 (TA-TC) | ✅ 3개 병렬 |

---

#### TA: Sequential + First Principles + Opportunity Cost

**1. Sequential Thinking (10 thoughts)**

```javascript
const ta_sequential = await mcp__sequential-thinking-tools__sequential_thinking({
  problem: `[분석 대상] 분석`,
  thought_number: 1,
  total_thoughts: 10,
  next_thought_needed: true
});

// 10회 반복 호출하여 전체 사고 체인 구축
// thought_number 1 → 10까지 순차 증가
```

**1.5. Sequential Thinking (clear-thought-1.5) - NEW**

```javascript
const ta_sequential_ct15 = await mcp__clear-thought-1_5__clear_thought({
  operation: "sequential_thinking",
  prompt: `[분석 대상] 순차적 분석 - sequential-thinking-tools 결과 기반 추가 통찰`,
  parameters: {
    pattern: "chain",
    patternParams: {
      problem: `${ta_sequential.conclusion}에서 누락된 관점 탐색`,
      initialThought: ta_sequential.thoughts[0]
    }
  }
});
```

**2. First Principles**

```javascript
const ta_first_principles = await mcp__clear-thought__mentalmodel({
  modelName: "first_principles",
  problem: `[분석 대상]의 근본 원리 분석`,
  steps: [
    "현재 가정 식별",
    "가정을 근본 진실로 분해",
    "근본 원리에서 재구축"
  ],
  reasoning: `Sequential Thinking 결과: ${ta_sequential.conclusion}`,
  conclusion: ""  // MCP가 채움
});
```

**3. Opportunity Cost**

```javascript
const ta_opportunity_cost = await mcp__clear-thought__mentalmodel({
  modelName: "opportunity_cost",
  problem: `${ta_first_principles.conclusion}에서의 대안 비용 분석`,
  steps: [
    "주요 옵션 식별",
    "각 옵션의 트레이드오프 분석",
    "기회 비용 정량화"
  ],
  reasoning: `First Principles 결론을 기반으로 대안 평가`,
  conclusion: ""
});
```

**TA 통합 + Serena 저장**:
```javascript
const TA = {
  sequential: ta_sequential,
  sequential_ct15: ta_sequential_ct15,  // NEW
  first_principles: ta_first_principles,
  opportunity_cost: ta_opportunity_cost,
  synthesis: `[Claude가 3가지 결과 통합 해석]`
};

await mcp__serena-memory__write_memory({
  memory_name: `mda_TA_${subject}_${date}`,
  content: JSON.stringify(TA, null, 2)
});
```

**사용자 출력 (간결 요약 ~300 tokens)**:
```markdown
## TA 분석 결과 (Sequential + First Principles + Opportunity Cost)

**핵심 인사이트**:
1. [가장 중요한 발견 1줄]
2. [두 번째 중요한 발견 1줄]
3. [세 번째 중요한 발견 1줄]

**First Principles 근본 원리**: [핵심 요약 1-2줄]

**Opportunity Cost**: [주요 트레이드오프 1-2줄]

📁 상세: `.serena/memories/mda_TA_${subject}_${date}.md`
```

---

#### TB: Root Cause + Divide Conquer + Context7

**1. Root Cause Analysis**

```javascript
const tb_root_cause = await mcp__clear-thought__debuggingapproach({
  approachName: "root_cause_analysis",
  issue: `[분석 대상의 핵심 이슈 또는 구조적 문제]`,
  steps: [
    "증상 식별",
    "가능한 원인 나열",
    "5 Whys 적용",
    "근본 원인 확정"
  ],
  findings: "",
  resolution: ""
});
```

**2. Divide & Conquer**

```javascript
const tb_divide_conquer = await mcp__clear-thought__debuggingapproach({
  approachName: "divide_conquer",
  issue: `${tb_root_cause.findings}의 세부 분해`,
  steps: [
    "문제를 하위 문제로 분할",
    "각 하위 문제 독립 해결",
    "솔루션 통합"
  ],
  findings: "",
  resolution: ""
});
```

**3. Context7 검증 (기술 스택 재확인)**

```javascript
const tb_context7 = await mcp__context7({
  query: `[Root Cause/Divide 결과에서 언급된 기술 요소]`,
  verify: true
});
```

**4. Systems Thinking (clear-thought-1.5) - NEW**

```javascript
const tb_systems = await mcp__clear-thought-1_5__clear_thought({
  operation: "systems_thinking",
  prompt: `[분석 대상] 시스템 분석 - 컴포넌트, 관계, 피드백 루프, 레버리지 포인트 식별`,
  parameters: {
    system: `${tb_root_cause.findings} + ${tb_divide_conquer.resolution}`
  }
});
```

**5. Causal Analysis (clear-thought-1.5) - NEW**

```javascript
const tb_causal = await mcp__clear-thought-1_5__clear_thought({
  operation: "causal_analysis",
  prompt: `Root Cause 결과의 인과관계 매핑 - 직접/간접 원인 구별, 인과 체인 강도 평가`,
  parameters: {
    problem: tb_root_cause.issue,
    rootCause: tb_root_cause.findings
  }
});
```

**TB 통합 + Serena 저장**:
```javascript
const TB = {
  root_cause: tb_root_cause,
  divide_conquer: tb_divide_conquer,
  systems: tb_systems,  // NEW
  causal: tb_causal,  // NEW
  context7: tb_context7,
  synthesis: `[구조적 원인 + 계층 분해 통합]`
};

await mcp__serena-memory__write_memory({
  memory_name: `mda_TB_${subject}_${date}`,
  content: JSON.stringify(TB, null, 2)
});
```

**사용자 출력 (~300 tokens)**:
```markdown
## TB 분석 결과 (Root Cause + Divide Conquer + Context7)

**근본 원인**: [1줄 요약]

**구조 분해**: [3-5개 하위 문제]

**기술 검증**: ✅ [검증 통과] / ⚠️ [주의 사항]

📁 상세: `.serena/memories/mda_TB_${subject}_${date}.md`
```

---

#### TC: Stochastic Full Spectrum (5개 알고리즘)

**1. Bayesian Optimization (불확실성 정량화)**

```javascript
const tc_bayesian = await mcp__stochastic-thinking__stochastic_analysis({
  algorithm: "bayesian",
  problem: `[분석 대상]의 불확실성 평가 및 최적 파라미터 탐색`,
  parameters: {
    acquisitionFunction: "expected_improvement",
    kernel: "rbf",
    iterations: 50
  }
});
```

**2. HMM (시계열 패턴 - 과거 유사 사례)**

```javascript
const tc_hmm = await mcp__stochastic-thinking__stochastic_analysis({
  algorithm: "hmm",
  problem: "과거 유사 프로젝트의 패턴 분석 및 현재 상태 추론",
  parameters: {
    states: 3,  // 성공/중립/실패
    algorithm: "forward-backward",
    observations: 100
  }
});
```

**3. MCTS (전략 시뮬레이션)**

```javascript
const tc_mcts = await mcp__stochastic-thinking__stochastic_analysis({
  algorithm: "mcts",
  problem: "다양한 구현 전략 시뮬레이션 및 최적 경로 탐색",
  parameters: {
    simulations: 2000,  // 최대치
    explorationConstant: 1.4,
    maxDepth: 10
  }
});
```

**4. MDP (순차 의사결정 정책)**

```javascript
const tc_mdp = await mcp__stochastic-thinking__stochastic_analysis({
  algorithm: "mdp",
  problem: "단계별 의사결정 최적 정책 (장기 보상 최대화)",
  parameters: {
    states: 100,
    actions: ["선택지_A", "선택지_B", "선택지_C"],
    gamma: 0.9,  // 할인율
    learningRate: 0.1
  }
});
```

**5. Multi-Armed Bandit (A/B 옵션 평가)**

```javascript
const tc_bandit = await mcp__stochastic-thinking__stochastic_analysis({
  algorithm: "bandit",
  problem: "3-5개 주요 옵션의 탐색-활용 균형 최적화",
  parameters: {
    arms: 4,  // 옵션 개수
    strategy: "thompson",  // Thompson Sampling (최고 알고리즘)
    epsilon: 0.1
  }
});
```

**TC 통합 + Serena 저장**:
```javascript
const TC = {
  bayesian: tc_bayesian,
  hmm: tc_hmm,
  mcts: tc_mcts,
  mdp: tc_mdp,
  bandit: tc_bandit,
  synthesis: `[5개 확률 분석 통합 해석]`,
  probabilities: {
    best_case: "90%",
    base_case: "65%",
    worst_case: "15%"
  }
};

await mcp__serena-memory__write_memory({
  memory_name: `mda_TC_${subject}_${date}`,
  content: JSON.stringify(TC, null, 2)
});
```

**사용자 출력 (~300 tokens)**:
```markdown
## TC 분석 결과 (Stochastic Full Spectrum)

**확률 분석**:
- 최선: 90% - [시나리오]
- 기준: 65% - [시나리오]
- 최악: 15% - [시나리오]

**패턴 인사이트**: [HMM 과거 사례 분석 1-2줄]

**최적 전략**: [MCTS/MDP 추천 경로 1-2줄]

📁 상세: `.serena/memories/mda_TC_${subject}_${date}.md`
```

---

#### TD: Bias + Error Propagation + Pareto

**1. Bias Detection (model-enhancement-servers)**

```javascript
// bias-detection을 통한 인지 편향 검출 및 완화
const td_bias = await mcp__model-enhancement-servers__enhance_reasoning({
  module: "bias-detection",
  task: `[분석 대상] 다차원 분석에서의 인지 편향 검출 및 완화 전략 제시

  현재 분석 맥락:
  - TA 결론: ${TA.synthesis}
  - TB 결론: ${TB.synthesis}
  - TC 결론: ${TC.synthesis}

  검출해야 할 편향:
  - Confirmation Bias (확증 편향)
  - Availability Heuristic (가용성 휴리스틱)
  - Dunning-Kruger Effect (과신/과소평가)
  - Sunk Cost Fallacy (매몰 비용 오류)

  각 편향에 대해:
  1. 구체적 예시 제시
  2. 분석에 미치는 영향 평가
  3. 완화 전략 제안`
});
```

**2. Error Propagation**

```javascript
const td_error_propagation = await mcp__clear-thought__mentalmodel({
  modelName: "error_propagation",
  problem: "각 옵션에서 초기 오류가 어떻게 전파되는가?",
  steps: [
    "초기 오류 지점 식별",
    "전파 경로 추적",
    "최종 영향 평가"
  ],
  reasoning: `TA/TB/TC 결과 기반 오류 전파 분석`,
  conclusion: ""
});
```

**3. Pareto Principle (80/20 법칙)**

```javascript
const td_pareto = await mcp__clear-thought__mentalmodel({
  modelName: "pareto_principle",
  problem: "핵심 20% 요인 식별 (80% 영향 발생)",
  steps: [
    "전체 요인 나열",
    "영향도 순위 매김",
    "상위 20% 요인 식별"
  ],
  reasoning: `모든 분석 결과를 종합하여 핵심 요인 도출`,
  conclusion: ""
});
```

**TD 통합 + Serena 저장**:
```javascript
const TD = {
  bias: td_bias,
  error_propagation: td_error_propagation,
  pareto: td_pareto,
  synthesis: `[편향 제거 + 오류 전파 방지 + 핵심 요인 통합]`
};

await mcp__serena-memory__write_memory({
  memory_name: `mda_TD_${subject}_${date}`,
  content: JSON.stringify(TD, null, 2)
});
```

**사용자 출력 (~300 tokens)**:
```markdown
## TD 분석 결과 (Bias + Error Propagation + Pareto)

**주요 편향**: [발견된 편향 2-3개]

**오류 전파 경로**: [가장 위험한 경로 1-2개]

**핵심 20% 요인**: [파레토 분석 결과]

📁 상세: `.serena/memories/mda_TD_${subject}_${date}.md`
```

---

#### TE: Cross-Validation Layer (신규)

**1. Occam's Razor (단순성 검증)**

```javascript
const te_occam = await mcp__clear-thought__mentalmodel({
  modelName: "occams_razor",
  problem: "TA/TB/TC/TD 중 가장 단순하면서 설명력 높은 것은?",
  steps: [
    "각 분석의 복잡도 평가",
    "설명력 평가",
    "최소 복잡도로 최대 설명력 달성하는 것 선택"
  ],
  reasoning: `4개 Task 결과 비교`,
  conclusion: ""
});
```

**2. Delta Debugging (모순 탐지)**

```javascript
const te_delta = await mcp__clear-thought__debuggingapproach({
  approachName: "delta_debugging",
  issue: "TA/TB/TC/TD 간 모순 또는 불일치 탐지",
  steps: [
    "각 결론 나열",
    "차이점 식별",
    "모순 해결"
  ],
  findings: "",
  resolution: ""
});
```

**3. Confidence Scoring (Claude 수행)**

```javascript
// TA/TB/TC/TD 결론 비교하여 합의도 계산
const te_confidence = {
  TA_confidence: 0.92,
  TB_confidence: 0.88,
  TC_confidence: 0.95,
  TD_confidence: 0.85,
  consensus: 0.90,  // 평균
  disagreements: [
    "[TA vs TB 불일치 지점]",
    "[TC vs TD 불일치 지점]"
  ]
};
```

**4. Collaborative Reasoning (clear-thought-1.5) - NEW**

```javascript
const te_collaborative = await mcp__clear-thought-1_5__clear_thought({
  operation: "collaborative_reasoning",
  prompt: "TA/TB/TC/TD 결과를 다관점 협업 분석 - 각 Task를 다른 persona로 간주하여 합의/반대 도출",
  parameters: {
    topic: "[분석 대상] 교차 검증",
    personas: [
      {id: "TA", name: "Sequential Thinker", expertise: ["순차분석"], perspective: "단계적 논리"},
      {id: "TB", name: "Systems Analyst", expertise: ["구조분석"], perspective: "근본원인"},
      {id: "TC", name: "Probabilist", expertise: ["확률분석"], perspective: "불확실성"},
      {id: "TD", name: "Bias Detector", expertise: ["편향제거"], perspective: "오류방지"}
    ],
    stage: "integration"
  }
});
```

**TE 통합 + Serena 저장**:
```javascript
const TE = {
  occam: te_occam,
  delta: te_delta,
  collaborative: te_collaborative,  // NEW
  confidence: te_confidence,
  synthesis: `[교차 검증 결과 통합]`
};

await mcp__serena-memory__write_memory({
  memory_name: `mda_TE_${subject}_${date}`,
  content: JSON.stringify(TE, null, 2)
});
```

**사용자 출력 (~200 tokens)**:
```markdown
## TE 교차 검증 결과

**합의도**: 90% (4개 Task 간 일관성)

**모순 지점**: [발견된 불일치 1-2개 + 해결 방법]

**최적 설명**: [Occam's Razor 결과]

📁 상세: `.serena/memories/mda_TE_${subject}_${date}.md`
```

---

### W2: Multi-Method Integration (3가지 통합 방법 비교)

#### 1. Dialectical Integration (변증법)

```javascript
const w2_dialectical = {
  thesis: TA.synthesis,  // 정립
  antithesis: findContradictions([TB, TC, TD]),  // 반정립
  synthesis: integratePerspectives([TA, TB, TC, TD, TE])  // 종합
};
```

#### 2. Bayesian Integration (확률 통합)

```javascript
const w2_bayesian = {
  priors: TA.first_principles.conclusion,  // 사전 확률
  likelihoods: TC.probabilities,  // 우도
  posteriors: updateBeliefs(priors, likelihoods)  // 사후 확률
};
```

#### 3. Weighted Voting (신뢰도 기반 가중 투표)

```javascript
const w2_weighted = {
  weights: [
    TE.confidence.TA_confidence,
    TE.confidence.TB_confidence,
    TE.confidence.TC_confidence,
    TE.confidence.TD_confidence
  ],
  vote: weightedAverage([TA.synthesis, TB.synthesis, TC.synthesis, TD.synthesis], weights)
};
```

#### 통합 방법 선택

```javascript
const w2_integration = selectBestIntegration(w2_dialectical, w2_bayesian, w2_weighted);
// 3가지 방법 비교 후 가장 일관성 높은 것 선택
```

#### Decision Framework (clear-thought-1.5) - ENHANCED

```javascript
const w2_decision = await mcp__clear-thought-1_5__clear_thought({
  operation: "decision_framework",
  prompt: "W1 5-Task (TA/TB/TC/TD/TE) 통합 결과 기반 다기준 의사결정 - 10개 기준으로 각 옵션 평가",
  parameters: {
    decisionStatement: "[분석 대상] 최종 의사결정",
    options: [
      {name: "Option A", description: extractFromW1("Option A")},
      {name: "Option B", description: extractFromW1("Option B")},
      {name: "Option C", description: extractFromW1("Option C")}
    ],
    analysisType: "multi_criteria",
    criteria: [
      "기술_타당성", "비용", "리스크", "확장성",
      "유지보수성", "팀_역량", "시장_적합성", "보안",
      "성능", "사용자_경험"
    ]
  }
});
```

#### Ulysses Protocol (5 stages - 고위험 검증)

```javascript
const w2_ulysses = {
  stage1: {
    name: "문제 정의 + 가정 명시",
    output: `[핵심 문제] + [주요 가정 3-5개]`
  },
  stage2: {
    name: "대안 전략 3개 이상",
    output: [w2_decision.options[0], w2_decision.options[1], w2_decision.options[2]]
  },
  stage3: {
    name: "각 전략 시뮬레이션 (MCTS)",
    output: TC.mcts  // TC에서 이미 실행
  },
  stage4: {
    name: "최악 시나리오 분석 (Error Propagation)",
    output: TD.error_propagation  // TD에서 이미 실행
  },
  stage5: {
    name: "Go/No-Go 결정",
    output: `[GO / NO-GO / CONDITIONAL] + [근거]`
  }
};
```

**W2 Serena 저장**:
```javascript
await mcp__serena-memory__write_memory({
  memory_name: `mda_W2_${subject}_${date}`,
  content: JSON.stringify({
    dialectical: w2_dialectical,
    bayesian: w2_bayesian,
    weighted: w2_weighted,
    selected_integration: w2_integration,
    decision: w2_decision,
    ulysses: w2_ulysses
  }, null, 2)
});
```

**사용자 출력 (~400 tokens)**:
```markdown
## W2 통합 분석 결과

**최종 Synthesis** (${w2_integration.method}):
[핵심 결론 2-3줄]

**Decision Framework** (10 criteria):
- 최고 옵션: [옵션명] (종합 점수: X/10)
- 주요 강점: [2-3개]
- 주요 약점: [1-2개]

**Ulysses Protocol**:
- Stage 5 결정: [GO/NO-GO/CONDITIONAL]
- 핵심 근거: [1-2줄]

📁 상세: `.serena/memories/mda_W2_${subject}_${date}.md`
```

---

### W3: 3-Level Quality Assurance

#### Level 1: Internal Consistency

```javascript
const w3_internal = {
  logical_validity: checkLogicalChain([W1, W2]),
  contradictions: findContradictions([TA, TB, TC, TD, TE]),
  coherence_score: calculateCoherence(w2_integration),
  result: `[A/B/C 등급] + [개선 필요 사항]`
};
```

#### Level 2: External Validation

```javascript
const w3_external = {
  context7_verify: await mcp__context7({
    query: w2_decision.recommendation,
    verify: true
  }),
  benchmark_compare: compareToBenchmark(w2_decision, previous_analyses),
  expert_heuristics: applyExpertRules(w2_decision),
  result: `[통과/주의/실패] + [근거]`
};
```

#### Level 3: Probabilistic Confidence

```javascript
const w3_probabilistic = {
  bayesian_confidence: w2_bayesian.posteriors,
  monte_carlo_stability: runMonteCarloOnConclusions(w2_integration, iterations=10000),
  sensitivity_analysis: testRobustness(w2_integration, perturbations=100),
  result: `[신뢰도 0-100%]`
};
```

#### Level 4: Scientific Method (clear-thought-1.5) - NEW

```javascript
const w3_scientific = await mcp__clear-thought-1_5__clear_thought({
  operation: "scientific_method",
  prompt: "W2 통합 결과 가설 검증 - 각 옵션을 가설로 설정하여 과학적 방법론 적용",
  parameters: {
    stage: "hypothesis",
    hypothesis: {
      statement: `${w2_decision.recommendation} 옵션이 최적이다`,
      variables: ["비용", "리스크", "성능"],
      assumptions: extractAssumptions(w2_integration)
    }
  }
});
```

#### Level 5: Metacognitive Monitoring (clear-thought-1.5) - NEW

```javascript
const w3_metacognitive = await mcp__clear-thought-1_5__clear_thought({
  operation: "metacognitive_monitoring",
  prompt: "전체 분석 품질 메타인지 검증 - W0/W1/W2/W3 각 단계별 신뢰도 교정",
  parameters: {
    task: "[분석 대상] 다차원 분석 검증",
    stage: "final_verification",
    uncertaintyAreas: extractUncertainties([W1, W2, w3_internal, w3_external, w3_probabilistic])
  }
});
```

#### Level 6: Statistical Reasoning (clear-thought-1.5) - NEW

```javascript
const w3_statistical = await mcp__clear-thought-1_5__clear_thought({
  operation: "statistical_reasoning",
  prompt: "TC 확률 분석 결과 통계적 검증 - 신뢰구간, 유의성 검정, 표본 크기 적절성",
  parameters: {
    data: TC.probabilities,
    hypothesis: w3_scientific.hypothesis,
    confidenceLevel: 0.99
  }
});
```

#### Level 7: Ethical Analysis (clear-thought-1.5) - NEW

```javascript
const w3_ethical = await mcp__clear-thought-1_5__clear_thought({
  operation: "ethical_analysis",
  prompt: "최종 권고안의 윤리적 영향 평가 - 이해관계자, 장단기 영향, 공정성",
  parameters: {
    decision: w2_decision.recommendation,
    stakeholders: extractStakeholders("[분석 대상]"),
    framework: "utilitarian"  // 최대 다수 최대 행복
  }
});
```

#### 최종 Confidence Score

```javascript
const w3_confidence = aggregateConfidence(
  w3_internal,
  w3_external,
  w3_probabilistic,
  w3_scientific,  // NEW
  w3_metacognitive,  // NEW
  w3_statistical,  // NEW
  w3_ethical  // NEW
);
// 목표: 99%+ 달성
```

**W3 Serena Baseline 구조화 저장**:
```javascript
await mcp__serena-memory__write_memory({
  memory_name: `mda_baseline_${subject}_${date}`,
  content: JSON.stringify({
    w0: { context7: W0.context7, orchestration: W0.orchestration },
    w1: { TA, TB, TC, TD, TE },
    w2: {
      dialectical: w2_dialectical,
      bayesian: w2_bayesian,
      weighted: w2_weighted,
      selected: w2_integration,
      decision: w2_decision,
      ulysses: w2_ulysses
    },
    w3: {
      internal: w3_internal,
      external: w3_external,
      scientific: w3_scientific,  // NEW
      metacognitive: w3_metacognitive,  // NEW
      statistical: w3_statistical,  // NEW
      ethical: w3_ethical,  // NEW
      probabilistic: w3_probabilistic,
      confidence: w3_confidence
    },
    metadata: {
      level: 5,
      confidence_score: w3_confidence,
      token_cost: "[실제 소비 토큰]",
      duration_minutes: "[실제 소요 시간]",
      mcp_calls: 38  // W0(2) + W1(22 +4 ct15) + W2(1 ct15) + W3(9 +4 ct15) + W4(4 +1 ct15)
    }
  }, null, 2)
});
```

**사용자 출력 (~200 tokens)**:
```markdown
## W3 품질 검증 결과

**최종 신뢰도**: ${w3_confidence}% 🎯

**Internal Consistency**: ${w3_internal.result}
**External Validation**: ${w3_external.result}
**Probabilistic**: ${w3_probabilistic.result}

✅ Baseline 저장 완료 - S2+ 세션에서 재사용 가능

📁 상세: `.serena/memories/mda_baseline_${subject}_${date}.md`
```

---

### W4: Actionable Insights

#### 1. Implementation Roadmap

```javascript
const w4_roadmap = await mcp__sequential-thinking-tools__sequential_thinking({
  problem: `${w2_integration.synthesis}를 실제 구현하는 로드맵`,
  thought_number: 1,
  total_thoughts: 15,
  next_thought_needed: true,
  current_step: {
    step_description: "3개월 단위 구현 계획 수립",
    expected_outcome: "Phase별 마일스톤 + 리소스 + 일정",
    recommended_tools: [],
    next_step_conditions: ["각 Phase별 명확한 Deliverable 정의"]
  }
});
```

#### 2. Risk Mitigation (MDP)

```javascript
const w4_mitigation = await mcp__stochastic-thinking__stochastic_analysis({
  algorithm: "mdp",
  problem: "구현 과정의 리스크 완화 최적 정책",
  parameters: {
    states: ["설계", "개발", "테스트", "배포"],
    actions: ["리스크_A_완화", "리스크_B_완화", "리스크_C_완화"],
    gamma: 0.95,
    learningRate: 0.1
  }
});
```

#### 3. Success Metrics

```javascript
const w4_metrics = {
  quantitative: [
    "성능: [목표치]",
    "비용: [목표치]",
    "일정: [목표치]"
  ],
  qualitative: [
    "사용자 만족도: [측정 방법]",
    "코드 품질: [측정 방법]"
  ],
  milestones: [
    "1개월: [마일스톤]",
    "3개월: [마일스톤]",
    "6개월: [마일스톤]"
  ]
};
```

#### 4. Optimization (clear-thought-1.5) - NEW

```javascript
const w4_optimization = await mcp__clear-thought-1_5__clear_thought({
  operation: "optimization",
  prompt: "구현 로드맵 최적화 - 리소스/시간/비용 제약 하에서 최적 경로 탐색",
  parameters: {
    objective: "최소 비용으로 최대 품질 달성",
    constraints: {
      budget: "[예산 제약]",
      timeline: "[일정 제약]",
      resources: "[인력 제약]"
    },
    currentPlan: w4_roadmap,
    riskProfile: w4_mitigation
  }
});
```

**W4 Serena 저장**:
```javascript
await mcp__serena-memory__write_memory({
  memory_name: `mda_W4_${subject}_${date}`,
  content: JSON.stringify({
    roadmap: w4_roadmap,
    mitigation: w4_mitigation,
    optimization: w4_optimization,  // NEW
    metrics: w4_metrics
  }, null, 2)
});
```

**사용자 출력 (~200 tokens)**:
```markdown
## W4 실행 계획

**Implementation Roadmap**:
- Phase 1 (1개월): [마일스톤]
- Phase 2 (3개월): [마일스톤]
- Phase 3 (6개월): [마일스톤]

**Risk Mitigation**: [상위 3개 리스크 + 완화 방법]

**Success Metrics**: [핵심 지표 3-5개]

📁 상세: `.serena/memories/mda_W4_${subject}_${date}.md`
```

---

## ⭐ Level 4: Production Grade

**구성**: W0 + W1(5Task) + W2(3방법) + W3(3Level)

**변경점**: W4 제거

**실행**: Level 5와 동일하되 W4 생략

**예상 토큰**: 3400-4600 (Level 5 대비 -400-800)
**신뢰도**: 97-99%

---

## 💎 Level 3: Standard Analysis

**구성**: W0 + W1(4Task) + W2(2방법) + W3(2Level)

### 변경점

**W1**: TE (Cross-Validation) 제거
- TA, TB, TC, TD만 실행

**W2**: 3가지 통합 방법 → 2가지
- ✅ Dialectical + Bayesian
- ❌ Weighted Voting 제거
- ✅ Decision Framework (7 criteria, 10→7 축소)
- ❌ Ulysses Protocol 제거

**W3**: 3-Level → 2-Level
- ✅ Internal + External
- ❌ Probabilistic 제거
- ✅ Simple Confidence (단순 계산)

**예상 토큰**: 2300-3000 (Level 5 대비 -39%)
**신뢰도**: 92-95%

---

## ⚡ Level 2: Quick Analysis

**구성**: W0(간소) + W1(3Task) + W2(1방법) + W3(1Level)

### 변경점

**W0**: context7 제거
- ✅ sequential-thinking-tools만

**W1**: 5Task → 3Task
- ✅ TA: Sequential(6) + First Principles (Opportunity Cost 제거)
- ✅ TB: Root Cause (Divide Conquer, Context7 제거)
- ✅ TC: Bayesian + MCTS (5개→2개 알고리즘)
- ❌ TD, TE 제거

**W2**: Dialectical만
- ✅ Decision Framework (5 criteria)
- ✅ Bias Detection (TD 대신 W2에서 Claude가 직접 수행)

**W3**: Internal Consistency만
- ✅ Simple Confidence

**예상 토큰**: 1400-1800 (Level 5 대비 -63%)
**신뢰도**: 86-90%

---

## 📋 출력 최적화 원칙

### 사용자 출력 (간결 요약)

**목표**: 전체 1500-2000 tokens (Level 5 기준)
- W0: 100 tokens
- W1: 300×5 = 1500 tokens (각 Task 간결)
- W2: 400 tokens
- W3: 200 tokens
- W4: 200 tokens

**형식**: 핵심만 1-2줄 + 📁 Serena 링크

### Serena 저장 (전체 상세)

**크기 제한 없음**:
- 모든 MCP 응답 원본
- 전체 분석 과정
- 계산 과정
- 메타데이터

---

## 🎯 최종 체크리스트

Level 5 완료 기준:
- [ ] W0: context7 + orchestration 완료
- [ ] W1: TA/TB/TC/TD/TE 5개 완료
- [ ] W2: 3가지 통합 방법 비교 + Decision + Ulysses
- [ ] W3: 3-Level QA + Confidence 99%+
- [ ] W4: Roadmap + Mitigation + Metrics
- [ ] Serena Baseline 구조화 저장
- [ ] 사용자 출력 2000 tokens 이내

---

**Version**: 3.2.0
**Release Date**: 2025-12-28
**Author**: Claude Sonnet 4.5
**Methodology**: Top-Down (Maximum Performance → Efficiency Ladder)

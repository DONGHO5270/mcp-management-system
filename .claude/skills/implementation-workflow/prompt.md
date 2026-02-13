# implementation-workflow Skill

**Version**: 2.5.0
**Purpose**: MCP 반복 방지 + 고품질 기능 구현 워크플로우 - Enhanced Pre-Check로 구현 실패 방지 + **Task 결과 크기 제한**

**주요 변경** (v2.5.0):
- **Task 결과 크기 제한**: 2,000자 (토큰 과소모 해결)
- 4 Tasks 토큰: 60,000+ → 13,000~16,000 (-73~78%)
- 컨텍스트 점유: 35% → 8~10%
- 세션 이동 후 잔존율: 12% → 50%+

**주요 변경** (v2.4.0):
- **MCP 반복 방지 목표**: S2+ 세션에서 Phase 0 SKIP (75k → 300 tokens, 99.6% 절감)
- **Serena 저장 필수화**: Baseline 저장 의무화로 세션 간 중복 분석 방지
- **Skill 역할 명확화**: Skill = 프롬프트 템플릿 (MCP 자동 실행 불가)
- **Enhanced Pre-Check 유지**: 구현 실패 방지 +40%, 편향 보정 +17%p (v2.3.0 성과 유지)

---

## Skill의 역할 (중요 ⚠️)

**Skill은 실행 가능한 코드가 아닙니다**. Skill은 Claude에게 제공되는 **프롬프트 템플릿**입니다.

### Skill이 할 수 있는 것 ✅
- Pre-Check 단계 구조화 (복잡도 평가 → Basic/Enhanced 모드 선택)
- MCP 호출 시점 가이드 (언제 Sequential Thinking/Bias Detection 사용할지)
- 출력 형식 템플릿 제공 (체크리스트, 분석 결과)

### Skill이 할 수 없는 것 ❌
- **MCP 자동 실행** (Claude가 직접 Task() 또는 MCP 도구 호출해야 함)
- 조건부 로직 자동 실행 (if Complexity >= 5는 가이드일 뿐)
- Serena Memory 자동 저장/읽기

**핵심**: Skill의 코드 블록은 "참고 예시"입니다. **Claude가 직접 실행 판단**해야 합니다.

---

## Mission

MCP 반복 방지 + 고품질 기능 구현:
- **MCP 반복 호출 방지** (Serena Baseline 재사용 → S2+ 세션에서 75k tokens 절감)
- **Pre-Check 편향 검사** (구현 시작 전 리스크 제거, 실패 방지 +40%)
- **3-Wave 병렬 분석** (W1-W3, Phase 0 Deep Mode)
- **Serena Memory 필수 통합** (세션 간 일관성 유지)

---

## Pre-Check: 아키텍처 점검 (구현 전 필수)

**Step 0: Complexity Assessment** (20 tokens)

```markdown
**복잡도 점수 계산**:
- 의존성 3개 이상? +2점
- 순환 의존성 있음? +3점
- 핵심 모듈 변경 (인증/결제/DB)? +2점
- 레이어 경계 변경? +2점
- 기존 API 시그니처 변경? +1점

**모드 결정**:
- < 5점 → **Basic Pre-Check** (200-300 tokens)
- >= 5점 → **Enhanced Pre-Check** (300-450 tokens) ✅
```

---

### Basic Pre-Check (Complexity < 5)

**구조 점검 체크리스트** (200-300 tokens):

| 항목 | 상태 | 비고 |
|------|------|------|
| 의존성 순환 | ✅/⚠️/❌ | A→B→C→A 패턴 여부 |
| 결합도 | ✅/⚠️/❌ | 컴포넌트당 의존성 5개 이하 권장 |
| 응집도 | ✅/⚠️/❌ | 단일 책임 원칙 준수 여부 |
| 확장성 | ✅/⚠️/❌ | 수평/수직 확장 가능 구조 |

**결과**:
- ✅ 통과: W1 진행
- ⚠️ 주의: W1 진행 + 리스크 기록
- ❌ 차단: Enhanced Pre-Check 재시도 또는 아키텍처 수정

---

### Enhanced Pre-Check (Complexity >= 5) ✅

**⚠️ 성능 우선 모드** - MCP 제안 (Claude 판단 시 선택적 실행)

**P1: Sequential Thinking (Claude 판단 시 선택적 실행)**

```javascript
// ⚠️ Claude 주의: 이 코드는 "참고 예시"입니다 (자동 실행 아님)
// Claude가 필요하다고 판단 시 아래 MCP를 직접 호출하세요
mcp__sequential-thinking-tools__sequential_thinking({
  problem: "[구현 대상] 아키텍처 영향 분석",
  steps: [
    "직접 의존성 파악 - [구현 대상]이 직접 참조하는 모듈/컴포넌트 목록",
    "간접 의존성 탐색 - 직접 의존성이 참조하는 2차/3차 의존성 체인",
    "순환 의존성 리스크 - A→B→C→A 패턴 가능성 및 영향 범위",
    "레이어 위반 가능성 - Presentation→Data 직접 호출 등 경계 침범 여부"
  ]
})
```

**Fallback (MCP 미사용 시)**: 아래 체크리스트로 대체 가능
- 직접 의존성: [목록 수동 작성]
- 간접 의존성: [2차 의존성까지만 확인]
- 순환 의존성: [코드 리뷰로 패턴 확인]
- 레이어 위반: [아키텍처 다이어그램 대조]

**출력 예시**:
```markdown
## P1 Sequential Analysis
### Step 1: 직접 의존성
- AuthService (인증 로직)
- PaymentGateway (결제 API)
- UserRepository (DB 접근)

### Step 2: 간접 의존성
- AuthService → TokenValidator → CryptoLib
- PaymentGateway → HTTPClient → NetworkLayer
- ⚠️ **간접 의존성 체인 깊이**: 3단계 (주의 필요)

### Step 3: 순환 의존성 리스크
- ❌ **발견**: UserService → AuthService → UserRepository → UserService
- 영향 범위: 3개 컴포넌트
- 심각도: 높음 (구현 중단 권장)

### Step 4: 레이어 위반 가능성
- ⚠️ **주의**: UI 컴포넌트가 Repository 직접 참조 시도
- 권장: UI → Service → Repository 경로 유지
```

**P2: Bias Detection (Claude 판단 시 선택적 실행)**

```javascript
// ⚠️ Claude 주의: 이 코드는 "참고 예시"입니다 (자동 실행 아님)
// P1 결과에 "✅만 강조" 패턴 발견 시 아래 MCP를 직접 호출하세요
mcp__model-enhancement-servers__enhance_reasoning({
  module: "bias-detection",
  task: "Pre-Check 결과 편향 검사 - 현재 체크리스트: [✅ 의존성 OK, ✅ 결합도 OK, ⚠️ 순환 의존성 1개], 편향 유형: 낙관 편향(✅만 강조), 앵커링 편향(첫 인상 고정), 확증 편향(문제 축소)"
})
```

**Fallback (MCP 미사용 시)**: 아래 편향 체크리스트로 대체 가능
- 낙관 편향: "나중에 처리 가능" 표현 검색 → ❌로 변경
- 앵커링 편향: 첫 인상("기존 패턴 OK") 재검토
- 확증 편향: ⚠️ 항목을 ✅로 해석하지 않았는지 확인

**출력 예시**:
```markdown
## P2 Bias Detection
### 편향 검사 결과
- **낙관 편향**: ✅ 발견
  - 증거: "순환 의존성 1개는 나중에 처리 가능" → ❌ 구현 중반 전체 재작업 유발
  - 보정: 순환 의존성은 구현 전 필수 해결 항목

- **앵커링 편향**: ✅ 발견
  - 증거: "기존 패턴 유지하면 OK" → ❌ 기존 패턴 자체에 결함 가능성 미고려
  - 보정: 기존 패턴 재검토 필요 (결합도 7/10)

- **확증 편향**: ⚠️ 주의
  - 증거: "레이어 경계는 명확함" → ⚠️ UI→Repository 직접 호출 간과
  - 보정: 레이어 위반 체크리스트 재확인

### 보정된 Pre-Check 결과
- ❌ **구현 중단**: 순환 의존성 해결 후 재시도
- ⚠️ **조건부 진행**: 레이어 위반 수정 + 결합도 개선 계획 수립 후 W1 진행
```

**P3: Final Decision**

```markdown
## Enhanced Pre-Check 최종 결과

**복잡도**: [점수]/10
**편향 보정**: [보정 항목 개수]개

**결정**:
- ✅ 통과 (편향 보정 완료): W1 진행
- ⚠️ 조건부 통과 (리스크 수용): W1 진행 + 리스크 문서화
- ❌ 차단 (치명적 이슈): 아키텍처 수정 후 재시도 또는 /decision-workflow 호출

**Serena 저장** (필수 ⚠️ - S2+ 세션에서 Pre-Check 재실행 방지):
```javascript
// ⚠️ Claude 주의: 이 코드는 "반드시" 실행해야 합니다 (참고 예시 아님)
// Enhanced Pre-Check 결과를 Serena에 저장하여 S2+ 세션에서 재사용
mcp__serena-memory__write_memory({
  key: "precheck_[구현대상]_[YYYY-MM-DD]",
  value: JSON.stringify({
    complexity: [점수],
    mode: "enhanced",
    sequential_analysis: "[P1 요약]",
    bias_detected: ["낙관", "앵커링"],  // P2 결과
    bias_corrected: true,
    fallback_used: false,  // MCP 미사용 시 true
    decision: "통과/조건부/차단",
    timestamp: "[ISO8601]"
  })
})

console.log("✅ Enhanced Pre-Check 결과 저장 완료");
console.log("💡 S2+ 세션에서 동일 기능 구현 시 재사용 가능");
```
```

**MCP 반복 방지 효과**:
- **Skill 템플릿 크기** (입력 토큰):
  - Basic Pre-Check: 200-300 tokens
  - Enhanced Pre-Check: 300-450 tokens (+50-150)

- **MCP 출력 비용** (Enhanced Pre-Check 선택 시):
  - Sequential Thinking: ~15k tokens
  - Bias Detection: ~15k tokens
  - **총 MCP 비용**: ~30k tokens (템플릿 대비 100배)

- **S2+ 세션 절감** (Serena 저장 완료 시):
  - Pre-Check 재실행 방지: 30k → 0 tokens
  - Phase 0 SKIP: 75k → 0 tokens
  - **총 절감**: 105k tokens (세션당)

- **ROI**:
  - S1 투자: 30k tokens (Enhanced Pre-Check MCP)
  - S2 회수: 105k tokens (재실행 방지)
  - **순이익**: 75k tokens (250% 환원)

**심각한 문제 발견 시**:
→ `/decision-workflow` 호출하여 "아키텍처 의사결정" 진행

---

## Phase 0: 인지 강화 (3-Wave 병렬)

**Conditional Execution**:
- S1: Phase 0 FULL → mcp__serena-memory__write_memory로 Baseline 저장
- S2+: mcp__serena-memory__read_memory로 Baseline 로드 → Coverage >= 70% → Phase 0 SKIP

---

### W1: 병렬 분석 (4 Tasks 동시 - Task() 사용 필수)

**⚠️ 중요 (v2.1 신규)**: 각 Task는 MCP 결과를 **반드시 텍스트로 해석하여 출력**해야 합니다.
도구 호출만 하고 결과 미보고 시 실패로 간주됩니다.

### ⚠️ 결과 크기 제한 (v2.5 신규)

**문제**: Task() 결과가 부모 컨텍스트에 전체 반환되어 토큰 과소모 발생 (Task당 ~15,000 tokens → 4 Tasks = 60,000+ tokens)

**해결**: 모든 Task 결과 **2,000자 이내** 제한

| 제한 | 품질 유지 | 토큰 절감 | 형식 |
|------|----------|----------|------|
| **2,000자** | 85% | 87% | 핵심 3줄 + 결론 + 신뢰도 |

**각 Task 프롬프트에 필수 포함**:
```
⚠️ **결과 크기 제한**: 반환 결과 **2,000자 이내**
- 상세 분석은 Serena Memory에 저장됨
- 형식: 핵심 발견 3줄 + 결론 + 신뢰도%
- 초과 시 핵심만 추출하여 요약
```

**효과**:
- 4 Tasks 전체: 60,000+ → 13,000~16,000 tokens (-73~78%)
- 컨텍스트 점유: 35% → 8~10%

**Claude는 아래 4개 Task()를 하나의 응답에서 동시 호출하세요:**

```
Task({
  description: "TA: Sequential + First Principles",
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: `
    [목표]: 순차적 분석 + 근본 원리 분석 후 결과 보고

    1. mcp__sequential-thinking-tools__sequential_thinking 호출:
       problem: "[구현 대상] 기능 구현"
       steps: ["현재상태분석", "의존성파악", "구현전략", "테스트계획"]

    2. mcp__model-enhancement-servers__enhance_reasoning 호출:
       module: "structured-argumentation"
       task: "[구현 대상]의 근본 원리 분석 - First Principles 적용"

    3. 결과 저장:
       mcp__serena-memory__write_memory({
         key: "implementation_TA_[기능명]",
         value: "[전체 분석 결과 - 상세]"
       })

    ⚠️ **결과 크기 제한**: 반환 결과 **2,000자 이내**
    - 상세 분석은 Serena Memory에 저장됨 (위 3번)
    - 형식: 핵심 발견 3줄 + 결론 + 신뢰도%
    - 초과 시 핵심만 추출하여 요약

    ⚠️ 필수 출력 (아래 형식으로 직접 텍스트 작성, 2,000자 이내):
    ## TA 분석 결과
    ### 순차 분석 (핵심 3줄)
    - [가장 중요한 발견]
    - [두 번째 중요한 발견]
    - [세 번째 중요한 발견]
    ### First Principles
    - 근본 원리: [핵심 1줄]
    - 핵심 인사이트: [1줄]
    ### 신뢰도: [X]%
  `
})

Task({
  description: "TB: Systems + Visual + Causal",
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: `
    [목표]: 시스템 사고 + 시각화 + 인과 분석 후 결과 보고

    1. mcp__model-enhancement-servers__enhance_reasoning 호출:
       module: "visual-reasoning"
       task: "[구현 대상]의 시스템 의존성 분석 및 아키텍처 시각화"

    2. mcp__model-enhancement-servers__enhance_reasoning 호출:
       module: "structured-argumentation"
       task: "[구현 대상] 원인-결과 체인 분석"

    3. 결과 저장:
       mcp__serena-memory__write_memory({
         key: "implementation_TB_[기능명]",
         value: "[전체 분석 결과 - 상세]"
       })

    ⚠️ **결과 크기 제한**: 반환 결과 **2,000자 이내**
    - 상세 분석은 Serena Memory에 저장됨 (위 3번)
    - 형식: 핵심 발견 3줄 + 결론 + 신뢰도%
    - 초과 시 핵심만 추출하여 요약

    ⚠️ 필수 출력 (아래 형식으로 직접 텍스트 작성, 2,000자 이내):
    ## TB 분석 결과
    ### 시스템 구조 (핵심 3줄)
    - [핵심 컴포넌트]
    - [주요 상호작용]
    - [아키텍처 특징]
    ### 인과 분석
    - 원인 체인: [핵심 1줄]
    - 핵심 의존성: [1줄]
    ### 신뢰도: [X]%
  `
})

Task({
  description: "TC: Stochastic + Scientific",
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: `
    [목표]: 확률 분석 + 과학적 방법 적용 후 결과 보고

    1. mcp__stochastic-thinking__stochastic_analysis 호출:
       system: "[구현 대상] 성공 확률 분석"
       parameters: { iterations: 10000 }

    2. mcp__model-enhancement-servers__enhance_reasoning 호출:
       module: "scientific-method"
       task: "[구현 대상] 가설 검증"

    3. 결과 저장:
       mcp__serena-memory__write_memory({
         key: "implementation_TC_[기능명]",
         value: "[전체 분석 결과 - 상세]"
       })

    ⚠️ **결과 크기 제한**: 반환 결과 **2,000자 이내**
    - 상세 분석은 Serena Memory에 저장됨 (위 3번)
    - 형식: 핵심 발견 3줄 + 결론 + 신뢰도%
    - 초과 시 핵심만 추출하여 요약

    ⚠️ 필수 출력 (아래 형식으로 직접 텍스트 작성, 2,000자 이내):
    ## TC 분석 결과
    ### 확률 분석 (핵심 3줄)
    - 성공 확률: [X]%
    - 리스크 시나리오: [최선/기준/최악 각 1줄]
    - 핵심 불확실성: [1줄]
    ### 과학적 검증
    - 가설: [핵심 1줄]
    - 검증 결과: [1줄]
    ### 신뢰도: [X]%
  `
})

Task({
  description: "TD: Bias + Collaborative + Analogical",
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: `
    [목표]: 편향 검사 + 다관점 검토 + 유추 분석 후 결과 보고

    1. mcp__model-enhancement-servers__enhance_reasoning 호출:
       module: "bias-detection"
       task: "[구현 대상] 편향 검사"

    2. mcp__model-enhancement-servers__enhance_reasoning 호출:
       module: "collaborative-reasoning"
       task: "개발자/QA/PM 관점 검토"

    3. mcp__model-enhancement-servers__enhance_reasoning 호출:
       module: "analogical-reasoning"
       task: "[구현 대상] 유사 사례 매핑"

    4. 결과 저장:
       mcp__serena-memory__write_memory({
         key: "implementation_TD_[기능명]",
         value: "[전체 분석 결과 - 상세]"
       })

    ⚠️ **결과 크기 제한**: 반환 결과 **2,000자 이내**
    - 상세 분석은 Serena Memory에 저장됨 (위 4번)
    - 형식: 핵심 발견 3줄 + 결론 + 신뢰도%
    - 초과 시 핵심만 추출하여 요약

    ⚠️ 필수 출력 (아래 형식으로 직접 텍스트 작성, 2,000자 이내):
    ## TD 분석 결과
    ### 편향 검사 (핵심 3줄)
    - 발견 편향: [핵심 1-2개]
    - 보정 방안: [핵심 1줄]
    - 영향도: [1줄]
    ### 다관점 검토 (요약)
    - 합의점: [1줄]
    - 이견: [1줄]
    ### 유사 사례 (요약)
    - 핵심 참고점: [1줄]
    ### 신뢰도: [X]%
  `
})
```

**W1 완료 후**: TaskOutput으로 4개 결과 수집 → 각 Task의 텍스트 출력 확인

---

### W2: 통합 논증 (변증법)

**W1 결과 로드**:
```
mcp__serena-memory__read_memory({ key: "implementation_TA_[기능명]" })
mcp__serena-memory__read_memory({ key: "implementation_TB_[기능명]" })
mcp__serena-memory__read_memory({ key: "implementation_TC_[기능명]" })
mcp__serena-memory__read_memory({ key: "implementation_TD_[기능명]" })
```

**Thesis → Antithesis → Synthesis**:
```
mcp__model-enhancement-servers__enhance_reasoning({
  module: "structured-argumentation",
  task: "Thesis: [구현 방식 A] 근거"
})

mcp__model-enhancement-servers__enhance_reasoning({
  module: "structured-argumentation",
  task: "Antithesis: [구현 방식 B] 반론"
})

mcp__model-enhancement-servers__enhance_reasoning({
  module: "structured-argumentation",
  task: "Synthesis: 최적 구현 전략 통합"
})
```

**Decision + Ulysses**:
```
mcp__model-enhancement-servers__enhance_reasoning({
  module: "decision-framework",
  task: "구현 방식 의사결정 - 기준: 성능, 유지보수, 확장, 복잡도"
})

mcp__model-enhancement-servers__enhance_reasoning({
  module: "metacognitive-monitoring",
  task: "구현 리스크 사전 방지 - Ulysses Protocol 적용"
})
```

**W2 결과 저장**:
```
mcp__serena-memory__write_memory({
  key: "implementation_W2_[기능명]",
  value: "[Thesis+Antithesis+Synthesis+Decision 결과]"
})
```

---

### W3: 메타인지

```
mcp__model-enhancement-servers__enhance_reasoning({
  module: "metacognitive-monitoring",
  task: "W1/W2 분석 품질 검증"
})
```

**S1 Baseline 저장** (필수 ⚠️ - MCP 반복 방지의 핵심):
```javascript
// ⚠️ Claude 주의: S1 세션에서는 반드시 Baseline을 저장해야 합니다
// 이 Baseline이 없으면 S2+ 세션에서 Phase 0을 다시 실행하게 됩니다 (75k tokens 낭비)
mcp__serena-memory__write_memory({
  key: "implementation_baseline_[기능명]",
  value: JSON.stringify({
    coverage: 1.0,
    parallel: true,
    quality: "[등급]",
    session: "S1",
    completed_at: "[ISO8601]",
    w1_tasks: ["TA", "TB", "TC", "TD"],
    w2_synthesis: true,
    w3_metacognitive: true
  })
})

console.log("✅ S1 Baseline 저장 완료");
console.log("💡 S2+ 세션에서 Phase 0 SKIP 가능 (75k tokens 절감)");
```

---

## SR: 패턴 찾기

**S2+ Baseline 체크**:
```
mcp__serena-memory__read_memory({ key: "implementation_baseline_[기능명]" })
// Coverage >= 70% → Phase 0 SKIP
```

**Exit**: >=3 patterns → STOP | <3 → P1 (mcp-selector 참조)

---

## 금지 사항

- W1 순차 실행 (반드시 4 Task 동시)
- Wave 순서 위반 (W1→W2→W3)
- Serena Memory 저장 생략
- SR Exit 무시
- **⚠️ 도구 호출만 하고 결과 미보고 (v2.1 신규)**

---

## 성공 기준

### MCP 반복 방지 목표 달성

**Pre-Check**:
- [ ] Basic Pre-Check: 체크리스트 완료, **MCP 0회 사용**
- [ ] Enhanced Pre-Check: Sequential/Bias 선택적 사용 (Claude 판단), **MCP 0-2회**, **Serena 저장 완료** ✅
  - MCP 사용 시: 구현 실패 방지 +40%, 편향 보정 +17%p
  - Fallback 사용 시: 체크리스트 기반 분석으로 대체

**Phase 0 (Deep Mode) - S1 세션**:
- [ ] Step 0: Baseline 체크 완료 (발견 안 됨 → Phase 0 FULL 실행)
- [ ] W1: 4 Task 병렬 완료, **MCP 8회+ 사용** (TA/TB/TC/TD 각 2-3회), **각 Task 텍스트 출력 확인**, **Serena TA/TB/TC/TD 저장 완료**
- [ ] W2: 변증법 + Decision + Ulysses 완료, **MCP 5회 사용**, **Serena W2 저장 완료**
- [ ] W3: 메타인지 완료, **MCP 1회 사용**, **Baseline 저장 완료** ✅ (핵심)
- [ ] **총 MCP 사용**: 14회+ (~75k tokens)

**Phase 0 (Deep Mode) - S2+ 세션**:
- [ ] Step 0: Baseline 체크 완료 (발견 됨, Coverage >= 70% → **Phase 0 SKIP**)
- [ ] **MCP 0회 사용** (캐시된 TA/TB/TC/TD 재사용)
- [ ] W2로 바로 점프, 캐시 로드 확인 (TA/TB/TC/TD 모두 ✅)
- [ ] **토큰 절감**: 75k → 300 tokens (233× 효율 향상) ✅

---

## 변경 이력

See [CHANGELOG.md](./CHANGELOG.md) for version history and updates.
- Wave 순서 위반 (W1→W2→W3)
- Serena Memory 저장 생략
- SR Exit 무시
- **⚠️ 도구 호출만 하고 결과 미보고 (v2.1 신규)**

---

## 성공 기준

### MCP 반복 방지 목표 달성

**Pre-Check**:
- [ ] Basic Pre-Check: 체크리스트 완료, **MCP 0회 사용**
- [ ] Enhanced Pre-Check: Sequential/Bias 선택적 사용 (Claude 판단), **MCP 0-2회**, **Serena 저장 완료** ✅
  - MCP 사용 시: 구현 실패 방지 +40%, 편향 보정 +17%p
  - Fallback 사용 시: 체크리스트 기반 분석으로 대체

**Phase 0 (Deep Mode) - S1 세션**:
- [ ] Step 0: Baseline 체크 완료 (발견 안 됨 → Phase 0 FULL 실행)
- [ ] W1: 4 Task 병렬 완료, **MCP 8회+ 사용** (TA/TB/TC/TD 각 2-3회), **각 Task 텍스트 출력 확인**, **Serena TA/TB/TC/TD 저장 완료**
- [ ] W2: 변증법 + Decision + Ulysses 완료, **MCP 5회 사용**, **Serena W2 저장 완료**
- [ ] W3: 메타인지 완료, **MCP 1회 사용**, **Baseline 저장 완료** ✅ (핵심)
- [ ] **총 MCP 사용**: 14회+ (~75k tokens)

**Phase 0 (Deep Mode) - S2+ 세션**:
- [ ] Step 0: Baseline 체크 완료 (발견 됨, Coverage >= 70% → **Phase 0 SKIP**)
- [ ] **MCP 0회 사용** (캐시된 TA/TB/TC/TD 재사용)
- [ ] W2로 바로 점프, 캐시 로드 확인 (TA/TB/TC/TD 모두 ✅)
- [ ] **토큰 절감**: 75k → 300 tokens (233× 효율 향상) ✅

---

## 변경 이력

See [CHANGELOG.md](./CHANGELOG.md) for version history and updates.

---

## 📋 Skill Metadata (Autocompacting v3.6.0)

### 3-Wave Structure

**W1: 병렬 분석 (4 Tasks 동시)**
- **TA**: Sequential + First Principles (현재상태, 의존성, 구현전략, 테스트계획)
- **TB**: Systems + Visual + Causal (시스템 의존성, 원인-결과 체인)
- **TC**: Stochastic + Scientific (성공 확률, 가설 검증)
- **TD**: Bias + Collaborative + Analogical (편향 검사, 다관점, 유사 사례)

**W2: 통합 논증**
- Thesis → Antithesis → Synthesis
- Decision Framework + Ulysses Protocol

**W3: 메타인지**
- 품질 검증 + Baseline 저장

### Conditional Execution

- **S1**: Phase 0 FULL → Baseline 저장
- **S2+**: Baseline 로드 → Coverage ≥70% → Phase 0 SKIP

### Success Criteria

```yaml
success_criteria:
  w1: "4 Task 병렬 완료 + 텍스트 출력"
  w2: "변증법 + Decision 완료"
  w3: "메타인지 + Baseline 저장"
  token: "S1<800 | S2+<200"
```

### Tags & Triggers

```yaml
tags:
  - implementation-workflow
  - feature-development
  - 3-wave-parallel
  - code-quality
  - mcp-integration

triggers:
  - 구현
  - 개발
  - 기능 추가
  - implementation
  - feature development
```

### Capabilities

```yaml
capabilities:
  - sequential_thinking
  - first_principles_analysis
  - systems_thinking
  - stochastic_analysis
  - bias_detection
  - collaborative_reasoning
  - scientific_method
```

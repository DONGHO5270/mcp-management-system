# decision-workflow Skill Execution Instructions

## MCP Verified Status

| Service | Operations | Status |
|---------|------------|--------|
| clear-thought | mentalmodel (first_principles, opportunity_cost, error_propagation), debuggingapproach | 100% (2/2 tests, 2025-12-28) |
| model-enhancement-servers | bias-detection | Phase 2 Complete (2025-12-29), 가치 4.0/5 |
| clear-thought-1.5 | decision_framework, systems_thinking, scientific_method, metacognitive_monitoring, collaborative_reasoning | 100% (5/5, 2025-12-28) |

**Phase 2 Result**: bias-detection 영구 통합, ethical-reasoning 제거 (가치 3.0/5)

---

## Skill의 역할 (중요 ⚠️)

**Skill은 실행 가능한 코드가 아닙니다**. Skill은 Claude에게 제공되는 **프롬프트 템플릿**입니다.

### Skill이 할 수 있는 것 ✅
- 의사결정 단계 구조화 (Q1 → Q2 → Q3)
- MCP 호출 시점 가이드 (언제 Sequential/Bias Detection 사용할지)
- 출력 형식 템플릿 제공

### Skill이 할 수 없는 것 ❌
- **MCP 자동 실행** (Claude가 직접 호출해야 함)
- 조건부 로직 자동 실행 (if/else는 가이드일 뿐)

**핵심**: Skill의 코드 블록은 "참고 예시"가 아닙니다. **Claude가 직접 실행**해야 합니다.

---

## ⚠️ 필수 실행 순서

**Claude는 의사결정 분석 전에 반드시 다음 MCP를 호출해야 합니다:**

### 1단계: Sequential Thinking 호출

```javascript
// ⚠️ Claude 주의: 이 코드는 "반드시" 실행해야 합니다 (참고 예시 아님)
mcp__sequential-thinking-tools__sequential_thinking({
  problem: "[사용자의 의사결정 주제]",
  steps: ["현재 상태 파악", "제약조건 식별", "옵션 도출", "리스크 식별"]
})
```

### 2단계: Bias Detection 호출

```javascript
// ⚠️ Claude 주의: 이 코드는 "반드시" 실행해야 합니다 (참고 예시 아님)
mcp__model-enhancement-servers__enhance_reasoning({
  module: "bias-detection",
  task: "[옵션들에 대한 편향 검사]"
})
```

---

**Version**: 2.9.0
**Purpose**: 성능 우선 Hybrid B+ 의사결정 워크플로우 - Phase 2 Complete (bias-detection 영구 통합)

**주요 변경** (v2.9.0):
- **bias-detection 영구 통합**: Phase 2 Option A 적용 (가치 4.0/5)
- **ethical-reasoning 제거**: Generic response, 가치 3.0/5 미달
- **decision-framework 유지**: clear-thought-1.5 operation으로 계속 사용
- **토큰 절감**: Deep Mode 550-800 → **500-750** (-50 tokens)
- **MCP 활용률**: 유지 (6/6, 100%)

**이전 변경** (v2.8.0):
- **model-enhancement-servers 재도입**: bias-detection, ethical-reasoning, decision-framework (Phase 1 Pilot)
- **MCP 활용률**: 85.7% → 100% (6/6 services)
- **검증 전략**: 점진적 재도입 (decision-workflow만) → 성공 시 Phase 2 확장
- **템플릿 오판 정정**: Framework Provider 패턴 확인 (8/8 modules re-evaluated)
- **토큰 영향**: +0-50 tokens (기존 코드에 이미 포함, 활성화만)

**이전 변경** (v2.7.0):
- **clear-thought-1.5 통합**: decision_framework (Quick Q3, Deep D1.5), systems_thinking (Deep D1.5), metacognitive_monitoring (Deep D3)
- **MCP operations**: ~20개 → ~50개 (+30개 clear-thought-1.5)
- **신뢰도 향상**: 97-98%+ → 98-99%+ (decision_framework 다기준 분석)
- **Quick Mode 토큰**: 300-450 → 350-500 (decision_framework 추가)
- **Deep Mode 토큰**: 500-700 → 550-800 (DE Task 추가)

**이전 변경** (v2.3.1):
- **MCP 호출 형식 개선**: javascript 코드 블록 → 명령형 지시문 전환
- **필수 실행 명시**: 각 MCP 호출 전 "⚠️ 필수 실행" 지시문 추가
- **실행 확인 강화**: "Claude는 위 도구를 반드시 실행하고..." 문구 추가
- **문제 해결**: Claude가 MCP 호출을 문서 예시로 오해하여 실제 실행 안 하는 문제 수정

**이전 변경** (v2.2.1):
- **Serena 저장 표기 개선**: "(Optional)" → "(권장 ⚠️ - MCP 사용 가능 시 저장)"
- **저장 피드백 추가**: console.log로 저장 성공/실패 명시
- **목적**: S2+ 세션에서 D0 검색으로 과거 의사결정 재사용 유도 (75k→300 tokens)

**이전 변경** (v2.2.0):
- Quick Mode MCP 통합: Sequential Thinking (Q1) + Bias Detection (Q3) 필수
- Q3-Advanced: Stochastic 조건부 추가 (복잡도 3-4 이상)
- 토큰 목표 조정: 200-300 → 300-450 (성능 우선)
- 의사결정 신뢰도 향상: 72% → 95%+

---

## Execution Flow (Claude MUST follow)

### Step 0: Mode Selection (Automatic)

**Analyze user input and calculate complexity score:**

```
Complexity Score Calculation:
1. Check for irreversibility keywords ("영구적", "되돌릴 수 없는", "불가역") → +3 points
2. Check for cost keywords ("> $10K", "대규모 비용", "큰 투자") → +2 points
3. Check for team consensus keywords ("팀 합의", "조직 전체", "이해관계자") → +2 points
4. Check for technical uncertainty ("불확실", "검증 필요", "리스크") → +2 points
5. Count options mentioned → If > 4 options → +1 point

Mode Decision:
- IF complexity score < 5 OR user says "빠른 결정"/"간단히" → Quick Mode
- IF complexity score >= 5 OR user says "심층 의사결정"/"중요한 결정" → Deep Mode
- IF user mentions "MSA"/"모노리스"/"마이크로서비스"/"아키텍처" → Quick Mode + Architecture Preset
```

**Output Example:**
```markdown
🎯 **Mode Selected**: Quick Mode (complexity score: 2/10)
```

---

## Quick Mode Execution (350-500 tokens target)

### Q1: 옵션 생성 + Sequential Thinking (MANDATORY - 60초)

**⚠️ 성능 우선 모드**: MCP 필수 통합으로 고품질 옵션 생성

**Step-by-step instructions:**

**STEP 1: Sequential Thinking 분석 (50-100 tokens)**

**⚠️ 필수 실행:**

```javascript
// ⚠️ Claude 주의: 이 코드는 "반드시" 실행해야 합니다 (참고 예시 아님)
mcp__sequential-thinking-tools__sequential_thinking({
  problem: "[사용자 의사결정 주제]",
  steps: ["현재 상태 파악", "핵심 병목 지점 식별", "전통적 옵션 도출", "비전통적 대안 탐색"]
})
```

**결과를 받은 후 다음 단계로 진행하세요.**

**STEP 2: Sequential 결과 기반 옵션 생성 (30-80 tokens)**

1. **Sequential 분석 결과 해석**:
   - Step 1-2: 문제 본질 파악
   - Step 3: 전통적 옵션 (2-3개)
   - Step 4: 비전통적/조합형 옵션 (1-2개)

2. **Generate 3-5 concrete options**:
   - 각 옵션은 Sequential 분석의 특정 병목 해결
   - 비전통적 대안 반드시 1개 이상 포함
   - 조합형 옵션 고려 (예: "A+C 하이브리드")

3. **Each option MUST have**:
   - Name (2-4 words)
   - One-line description (10-15 words)
   - Distinct from other options
   - Sequential 분석 근거 명시

**Architecture Preset Trigger**: If user mentions "MSA", "모노리스", "마이크로서비스", "시스템 설계":
- **Skip Sequential Thinking** (도메인 지식 충분)
- Use pre-defined options:

```markdown
Option A: Monolith (모노리스)
- 단순 배포, 낮은 초기 복잡도, 팀 < 10명 적합

Option B: Modular Monolith (모듈러 모노리스)
- 모노리스 단순성 + 모듈 경계, 점진적 MSA 전환 가능

Option C: Microservices (MSA)
- 독립 배포, 기술 다양성, 확장성, 팀 >= 30명 권장
```

**Output Format (MUST use this exact format):**
```markdown
## 의사결정: [주제]

### Sequential 분석 결과
- **현재 상태**: [요약]
- **핵심 병목**: [식별된 문제점]
- **옵션 도출 근거**: [Sequential 기반 논리]

### 옵션

1. **Option A**: [이름] - [한 줄 설명]
   - Sequential 근거: [Step X 결과 기반]
2. **Option B**: [이름] - [한 줄 설명]
   - Sequential 근거: [Step Y 결과 기반]
3. **Option C**: [이름] - [한 줄 설명]
   - Sequential 근거: [Step Z 결과 기반]
```

---

### Q2: 비교표 (MANDATORY - 30초)

**Step-by-step instructions:**

1. **Identify 3-4 key criteria** relevant to decision topic
2. **For Architecture decisions, use these criteria**:
   - 팀 규모 (team size fit)
   - 배포 복잡도 (deployment complexity)
   - 확장성 (scalability)
   - 초기 개발 속도 (initial dev speed)
   - 장기 유지보수 (long-term maintainability)
3. **Create comparison table** with ✅/⚠️/❌ indicators
4. **Add "적합 상황" row** showing when each option is best

**Architecture Preset Table**:
```markdown
| 기준 | Monolith | Modular | MSA |
|------|----------|---------|-----|
| 팀 규모 | <10명 ✅ | 10-30명 ✅ | 30+명 ✅ |
| 배포 복잡도 | 낮음 ✅ | 중간 ⚠️ | 높음 ❌ |
| 확장성 | 수직 ⚠️ | 수직+부분수평 ⚠️ | 수평 ✅ |
| 초기 개발 속도 | 빠름 ✅ | 중간 ⚠️ | 느림 ❌ |
| 장기 유지보수 | 어려움 ❌ | 중간 ⚠️ | 쉬움 ✅ |
| **적합 상황** | 작은 팀, MVP | 성장 중, 전환 준비 | 대규모, 복잡도 높음 |
```

**Output Format (MUST use this exact format):**
```markdown
### 비교

| 기준 | Option A | Option B | Option C |
|------|----------|----------|----------|
| [기준1] | [값] | [값] | [값] |
| [기준2] | [값] | [값] | [값] |
| [기준3] | [값] | [값] | [값] |
| **적합 상황** | [상황] | [상황] | [상황] |
```

---

### Q3: 추천 + Bias Detection (MANDATORY - 120초)

**⚠️ 성능 우선 모드**: MCP 필수 통합으로 편향 없는 추천

**Step-by-step instructions:**

**STEP 1: 초안 추천 작성 (60-100 tokens)**

1. **Select ONE option** based on:
   - User's context (team size, budget, timeline)
   - Risk-benefit tradeoff
   - Table comparison results
2. **Draft 3 reasons**:
   - Reason 1: Core advantage (핵심 장점)
   - Reason 2: Context fit (상황 적합성)
   - Reason 3: Risk-benefit ratio (리스크 대비 이점)

**STEP 2: Bias Detection 검사 (60-80 tokens)**

**⚠️ 필수 실행:**

```javascript
// ⚠️ Claude 주의: 이 코드는 "반드시" 실행해야 합니다 (참고 예시 아님)
mcp__model-enhancement-servers__enhance_reasoning({
  module: "bias-detection",
  task: "의사결정 추천 논리의 확증 편향, 앵커링 편향, 낙관 편향 검사 - 추천: Option [X], 이유: [초안 3가지 이유]"
})
```

**편향 검사 결과를 반영하여 최종 추천을 작성하세요.**

**STEP 3: 다기준 의사결정 분석 (40-60 tokens) - clear-thought-1.5**

**⚠️ 필수 실행:**

```javascript
// ⚠️ Claude 주의: 이 코드는 "반드시" 실행해야 합니다
mcp__clear-thought-1_5__clear_thought({
  operation: "decision_framework",
  prompt: "의사결정: [주제]. 옵션: A/B/C. Bias Detection 결과 기반 다기준 분석 - 기준: 비용/리스크/ROI/실행가능성. 각 옵션별 점수 산출",
  parameters: {
    decisionStatement: "[USER_DECISION_TOPIC]",
    options: [{name: "Option A", description: "..."}, {name: "Option B", description: "..."}, {name: "Option C", description: "..."}],
    analysisType: "multi_criteria"
  }
})
```

**decision_framework 결과를 받은 후 최종 추천을 작성하세요.**

**STEP 4: 편향 제거 + 다기준 분석 통합 최종 추천 (20-40 tokens)**

1. **Bias Detection + decision_framework 결과 반영**:
   - 확증 편향 검출 시: 선택하지 않은 옵션의 장점 추가
   - 앵커링 편향 검출 시: 첫 인상 재검토
   - 낙관 편향 검출 시: 최악 시나리오 언급 강화

2. **최종 추천 작성**:
   - 편향 제거된 3가지 이유
   - 트레이드오프 명시 (MANDATORY)
   - 조건부 결론 (when recommendation changes)

**Architecture Preset Logic**:
```
IF team_size < 10 → Recommend Monolith
ELSE IF team_size 10-30 → Recommend Modular Monolith
ELSE IF team_size >= 30 → Recommend MSA

Add condition: "팀이 [threshold]명 이상 되면 [next option] 전환 고려"
```

**Output Format (MUST use this exact format):**
```markdown
### 추천: Option [X]

**이유** (편향 검사 완료 ✅):
1. [핵심 장점 - 구체적으로]
2. [상황 적합성 - 사용자 컨텍스트 반영]
3. [리스크 대비 이점 - 트레이드오프 언급]

**편향 검사 결과**:
- 확증 편향: [검출됨/없음] - [대응 내용]
- 앵커링 편향: [검출됨/없음] - [대응 내용]
- 낙관 편향: [검출됨/없음] - [대응 내용]

**주의사항**:
- **트레이드오프**: [포기하는 것]
- **조건**: [언제 추천이 바뀌는지]
```

---

### Q3-Advanced: Stochastic 확률 분석 (CONDITIONAL - 복잡도 3-4 이상)

**Trigger Conditions** (하나라도 해당 시 실행):
- User mentions: "리스크", "확률", "불확실성", "성공률", "실패 가능성"
- Complexity score >= 3 (from Step 0)
- High-stakes decision (비용 > $5K, 비가역적, 팀 전체 영향)

**⚠️ 토큰 증가**: +100-150 tokens (총 450-600 tokens)

**Step-by-step instructions:**

**STEP 1: Stochastic 분석 (100-150 tokens)**

**⚠️ 필수 실행:**

```javascript
// ⚠️ Claude 주의: 이 코드는 "반드시" 실행해야 합니다 (참고 예시 아님)
mcp__stochastic-thinking__stochastic_analysis({
  system: "[주제] 의사결정 - Option A, B, C 각각의 성공/실패 확률 분석. 최선/기준/최악 시나리오별 확률 분포",
  parameters: { iterations: 5000 }
})
```

**확률 분석 결과를 반영하여 추천에 확률 근거를 추가하세요.**

**STEP 2: 확률 결과 통합 (20-40 tokens)**

1. **각 옵션별 성공 확률 요약**:
   - Option A: 최선 [X]%, 기준 [Y]%, 최악 [Z]%
   - Option B: 최선 [X]%, 기준 [Y]%, 최악 [Z]%
   - Option C: 최선 [X]%, 기준 [Y]%, 최악 [Z]%

2. **추천에 확률 근거 추가**:
   - "Option [X] 선택 시 기준 시나리오 성공 확률 [Y]%"
   - "최악의 경우에도 [Z]% 확률로 [최소 목표] 달성 가능"

**Output Format (Q3 추천에 추가):**
```markdown
### 확률 분석 (Stochastic) 🎲

| 옵션 | 최선 시나리오 | 기준 시나리오 | 최악 시나리오 |
|------|-------------|-------------|-------------|
| Option A | [확률]% - [결과] | [확률]% - [결과] | [확률]% - [결과] |
| Option B | [확률]% - [결과] | [확률]% - [결과] | [확률]% - [결과] |
| Option C | [확률]% - [결과] | [확률]% - [결과] | [확률]% - [결과] |

**추천 근거 업데이트**: Option [X] 선택 시 기준 시나리오 성공 확률 [Y]%, 최악의 경우에도 [Z]% 확률로 목표 달성 가능
```

---

### Q4: Token Check + Completion (10초)

**Step-by-step instructions:**

1. **Count total tokens used** (approximate):
   - Q1 (Sequential Thinking 포함): ~130-180 tokens
   - Q2: ~100 tokens
   - Q3 (Bias + decision_framework 포함): ~220-280 tokens
   - Q3-Advanced (Stochastic, 조건부): +100-150 tokens
   - **기본 Total: 350-500 tokens**
   - **Advanced Total (Stochastic 포함): 500-650 tokens**

2. **Budget Check**:
   - IF 350-500 tokens: ✅ Quick Mode 성공
   - IF 500-650 tokens (Stochastic 사용): ⚠️ Advanced Mode - 정상 범위
   - IF > 650 tokens: ❌ WARNING - Quick Mode budget exceeded

3. **Output completion message**:

```markdown
---

✅ **Quick Mode 완료** (350-500 tokens, v2.7.0)
- Sequential Thinking: ✅
- Bias Detection: ✅
- decision_framework (clear-thought-1.5): ✅
- Stochastic Analysis: [✅/⏭️ Skip]
```

4. **Serena Memory 저장 (권장 ⚠️ - MCP 사용 가능 시 저장)**:
   ```javascript
   // ⚠️ Claude 주의: Serena MCP 사용 가능하고 프로젝트 활성화 시 저장
   // 목적: S2+ 세션에서 D0 검색으로 이 의사결정을 재사용 (75k→300 tokens)
   // MCP 미설치 또는 프로젝트 미활성화 시 생략 (기능 정상 동작)

   try {
     // 1. Serena 프로젝트 활성화 상태 확인
     const config = mcp__serena-memory__get_current_config()
     const hasActiveProject = config && config.includes("Active project:")

     if (hasActiveProject) {
       mcp__serena-memory__write_memory({
         key: `decision_[topic_summary]_[YYYY-MM-DD]`,
         value: JSON.stringify({
           topic: "[USER_DECISION_TOPIC]",
           options: ["A", "B", "C"],
           recommendation: "[SELECTED_OPTION]",
           reasoning: ["이유1", "이유2", "이유3"],
           mode: "quick",
           timestamp: "[ISO8601]"
         })
       })
       console.log("✅ 의사결정 기록 저장 완료 - 다음 세션 D0 검색 시 재사용")
     } else {
       console.log("⚠️ Serena 프로젝트 미활성화 - 저장 생략 (기능 정상 동작)")
     }
   } catch (e) {
     // Serena MCP 미설치 또는 오류 발생 시 graceful fallback
     console.log("⚠️ Serena MCP 미사용 - 저장 생략 (기능 정상 동작)")
   }
   ```

---

## Deep Mode Execution (550-800 tokens target)

### D0: 유사 의사결정 검색 (Optional - 10초)

**Skip this step if**:
- serena-memory MCP not available or project not activated
- User requests "빠르게", "간단히"

**If executing**:
```javascript
// Search for similar past decisions (with graceful fallback)
try {
  const config = mcp__serena-memory__get_current_config()
  const hasActiveProject = config && config.includes("Active project:")

  if (hasActiveProject) {
    const results = mcp__serena-memory__search_memories({
      query: "[decision topic] 의사결정",
      limit: 3
    })
    // If found similar decision → Use as reference
    // If not found → Proceed to D1
  } else {
    console.log("⚠️ Serena 프로젝트 미활성화 - D0 생략, D1 진행")
  }
} catch (e) {
  console.log("⚠️ Serena MCP 미사용 - D0 생략, D1 진행")
}
```

---

### D1: W1 순차 분석 (4단계 Sequential - Phase0 패턴)

**⚠️ v2.3.0 변경**: 백그라운드 Task 악순환 방지 - 순차 실행 패턴 전환
- **기존 (v2.2)**: 4 Task 병렬 → TaskOutput → 세션 넘어가면 60k 토큰 재읽기 → 무한 루프
- **신규 (v2.3)**: 직접 MCP 호출 → 즉시 처리 → 세션 안전 ✅

#### D1.1: DA - Sequential + Options

**⚠️ 필수 실행 - Sequential Thinking MCP 즉시 호출:**

mcp__sequential-thinking-tools__sequential_thinking 호출:
- problem: "[USER_DECISION_TOPIC] 의사결정"
- steps: ["현재상태 파악", "제약조건 식별", "옵션 도출", "리스크 식별"]

**Claude는 위 도구를 실행하고 결과를 da_sequential 변수에 저장하세요.**

**즉시 처리**:
```javascript
// 결과 즉시 추출
const da_result = {
  current_state: da_sequential.steps[0],
  constraints: da_sequential.steps[1],
  option_derivation: da_sequential.steps[2],
  risks: da_sequential.steps[3],
  options: [
    { name: "Option A", description: "..." },
    { name: "Option B", description: "..." },
    { name: "Option C", description: "..." }
  ]
}

// Serena 저장
mcp__serena-memory__write_memory({
  key: "decision_DA_[USER_DECISION_TOPIC]",
  value: JSON.stringify(da_result)
})
```

**출력 형식**:
```markdown
## DA 분석 결과

### 순차 분석
- Step 1 (현재상태): [current state analysis]
- Step 2 (제약조건): [constraints identified]
- Step 3 (옵션도출): [how options were derived]
- Step 4 (리스크식별): [risks for each option]

### 생성된 옵션
- **Option A**: [name] - [description]
- **Option B**: [name] - [description]
- **Option C**: [name] - [description]
```

---

#### D1.2: DB - Stochastic + Risk

**⚠️ 필수 실행 - Stochastic Analysis MCP 즉시 호출:**

mcp__stochastic-thinking__stochastic_analysis 호출:
- system: "[USER_DECISION_TOPIC] 각 옵션별 성공/실패 확률 분석"
- parameters: { iterations: 5000 }

**Claude는 위 도구를 실행하고 결과를 db_stochastic 변수에 저장하세요.**

**즉시 처리**:
```javascript
// 결과 즉시 추출
const db_result = {
  probability_analysis: {
    option_a: { success: "X%", failure: "Y%", roi: "Z%" },
    option_b: { success: "X%", failure: "Y%", roi: "Z%" },
    option_c: { success: "X%", failure: "Y%", roi: "Z%" }
  },
  risk_matrix: {
    high: ["risk1", "risk2"],
    medium: ["risk3", "risk4"],
    low: ["risk5", "risk6"]
  }
}

// Serena 저장
mcp__serena-memory__write_memory({
  key: "decision_DB_[USER_DECISION_TOPIC]",
  value: JSON.stringify(db_result)
})
```

**출력 형식**:
```markdown
## DB 분석 결과

### 확률 분석 (Monte Carlo 5000회)
- **Option A**: 성공 [X]% | 실패 [Y]% | 평균 ROI [Z]%
- **Option B**: 성공 [X]% | 실패 [Y]% | 평균 ROI [Z]%
- **Option C**: 성공 [X]% | 실패 [Y]% | 평균 ROI [Z]%

### 리스크 매트릭스
- **고위험 (High)**: [risks with >30% probability, high impact]
- **중위험 (Medium)**: [risks with 10-30% probability or medium impact]
- **저위험 (Low)**: [risks with <10% probability or low impact]
```

---

#### D1.3: DC - Bias + Multi-perspective

**⚠️ 필수 실행 - Bias Detection MCP 즉시 호출:**

mcp__model-enhancement-servers__enhance_reasoning 호출:
- module: "bias-detection"
- task: "[USER_DECISION_TOPIC] 결정에서 확증편향/앵커링편향/낙관편향 검사"

**Claude는 위 도구를 실행하고 결과를 dc_bias 변수에 저장하세요.**

**⚠️ 필수 실행 - Collaborative Reasoning MCP 즉시 호출:**

mcp__model-enhancement-servers__enhance_reasoning 호출:
- module: "collaborative-reasoning"
- task: "기술/비용/사용자/리스크 관점에서 [USER_DECISION_TOPIC] 검토"

**Claude는 위 도구를 실행하고 결과를 dc_multi 변수에 저장하세요.**

**즉시 처리**:
```javascript
// 결과 즉시 추출
const dc_result = {
  bias_check: {
    confirmation: dc_bias.confirmation_bias,
    anchoring: dc_bias.anchoring_bias,
    optimism: dc_bias.optimism_bias
  },
  multi_perspective: {
    technical: dc_multi.technical_view,
    cost: dc_multi.cost_view,
    user: dc_multi.user_view,
    risk: dc_multi.risk_view
  }
}

// Serena 저장
mcp__serena-memory__write_memory({
  key: "decision_DC_[USER_DECISION_TOPIC]",
  value: JSON.stringify(dc_result)
})
```

**출력 형식**:
```markdown
## DC 분석 결과

### 편향 검사
- **확증 편향 (Confirmation Bias)**: [있음/없음] - [설명 및 증거]
- **앵커링 편향 (Anchoring Bias)**: [있음/없음] - [설명 및 증거]
- **낙관 편향 (Optimism Bias)**: [있음/없음] - [설명 및 증거]

### 다관점 검토
- **기술 관점**: [technical feasibility, scalability concerns]
- **비용 관점**: [initial cost, long-term cost, ROI]
- **사용자 관점**: [user experience, adoption rate]
- **리스크 관점**: [security, compliance, operational risks]
```

---

#### D1.4: DD - Analogical + Scientific

**⚠️ 필수 실행 - Analogical Reasoning MCP 즉시 호출:**

mcp__model-enhancement-servers__enhance_reasoning 호출:
- module: "analogical-reasoning"
- task: "[USER_DECISION_TOPIC]와 유사한 성공/실패 사례를 찾아 교훈 도출"

**Claude는 위 도구를 실행하고 결과를 dd_analogical 변수에 저장하세요.**

**⚠️ 필수 실행 - Scientific Method MCP 즉시 호출:**

mcp__model-enhancement-servers__enhance_reasoning 호출:
- module: "scientific-method"
- task: "[USER_DECISION_TOPIC] 가설 검증을 위한 실험 설계"

**Claude는 위 도구를 실행하고 결과를 dd_scientific 변수에 저장하세요.**

**즉시 처리**:
```javascript
// 결과 즉시 추출
const dd_result = {
  analogical: {
    success_cases: dd_analogical.success_cases,
    failure_cases: dd_analogical.failure_cases,
    patterns: dd_analogical.reusable_patterns
  },
  scientific: {
    hypothesis: dd_scientific.hypothesis,
    validation_method: dd_scientific.experiment_design,
    expected_results: dd_scientific.success_criteria
  }
}

// Serena 저장
mcp__serena-memory__write_memory({
  key: "decision_DD_[USER_DECISION_TOPIC]",
  value: JSON.stringify(dd_result)
})
```

**출력 형식**:
```markdown
## DD 분석 결과

### 유추 분석 (Analogical Reasoning)
- **유사 성공 사례**: [case name] - [key success factors and lessons]
- **유사 실패 사례**: [case name] - [failure reasons and avoidance strategies]
- **적용 가능 패턴**: [reusable patterns from analogies]

### 과학적 검증 (Scientific Method)
- **가설 (Hypothesis)**: [H0: null hypothesis to test]
- **검증 방법**: [experiment design, metrics to measure]
- **예상 결과**: [success criteria, failure criteria]
```

---

#### D1.5: DE - Systems Thinking + Decision Framework

**⚠️ 필수 실행 - Systems Thinking MCP 즉시 호출:**

mcp__clear-thought-1_5__clear_thought 호출:
- operation: "systems_thinking"
- prompt: "[USER_DECISION_TOPIC] 시스템 분석 - 주요 컴포넌트, 관계, 피드백 루프, 레버리지 포인트 식별"
- parameters: { system: "[USER_DECISION_TOPIC]" }

**Claude는 위 도구를 실행하고 결과를 de_systems 변수에 저장하세요.**

**⚠️ 필수 실행 - Decision Framework MCP 즉시 호출:**

mcp__clear-thought-1_5__clear_thought 호출:
- operation: "decision_framework"
- prompt: "[USER_DECISION_TOPIC] 다기준 의사결정 - DA/DB/DC/DD 결과 통합, 각 옵션별 종합 점수"
- parameters: { 
    decisionStatement: "[USER_DECISION_TOPIC]",
    options: [...],
    analysisType: "multi_criteria" 
  }

**Claude는 위 도구를 실행하고 결과를 de_decision 변수에 저장하세요.**

**즉시 처리**:
```javascript
// 결과 즉시 추출
const de_result = {
  systems_analysis: {
    components: de_systems.components,
    relationships: de_systems.relationships,
    feedback_loops: de_systems.feedbackLoops,
    leverage_points: de_systems.leveragePoints
  },
  multi_criteria_scores: {
    option_a: de_decision.scores.option_a,
    option_b: de_decision.scores.option_b,
    option_c: de_decision.scores.option_c
  },
  recommended_option: de_decision.recommendation
}

// Serena 저장
mcp__serena-memory__write_memory({
  key: "decision_DE_[USER_DECISION_TOPIC]",
  value: JSON.stringify(de_result)
})
```

**출력 형식**:
```markdown
## DE 분석 결과

### 시스템 사고 (Systems Thinking)
- **주요 컴포넌트**: [key components in the system]
- **관계**: [relationships and dependencies]
- **피드백 루프**: [positive and negative feedback loops]
- **레버리지 포인트**: [high-impact intervention points]

### 다기준 의사결정 (Decision Framework)
- **Option A 종합 점수**: [X]/100 (비용: [X], 리스크: [X], ROI: [X], 실행가능성: [X])
- **Option B 종합 점수**: [Y]/100 (비용: [Y], 리스크: [Y], ROI: [Y], 실행가능성: [Y])
- **Option C 종합 점수**: [Z]/100 (비용: [Z], 리스크: [Z], ROI: [Z], 실행가능성: [Z])
- **추천**: Option [X] (최고점)
```

---

### D2: W2 통합 논증 (3-step dialectic - 90초)

**Step 1: Thesis (최선 옵션 근거)**

**⚠️ 필수 실행 - Structured Argumentation MCP 즉시 호출:**

mcp__model-enhancement-servers__enhance_reasoning 호출:
- module: "structured-argumentation"
- task: "Based on W1 analysis results (DA, DB, DC, DD): Construct Thesis argument for Option [X] (highest probability option from DB) - 성공 확률, 리스크 대비, ROI 추정, 편향 제거, 성공 사례 포함. Provide structured argument with premises and conclusion."

**Claude는 위 도구를 실행하고 Thesis 논증 결과를 기록하세요.**

**Step 2: Antithesis (대안 옵션 근거)**

**⚠️ 필수 실행 - Structured Argumentation MCP 즉시 호출:**

mcp__model-enhancement-servers__enhance_reasoning 호출:
- module: "structured-argumentation"
- task: "Based on W1 analysis results (DA, DB, DC, DD): Construct Antithesis argument for Option [Y] (alternative option) - 다른 관점, 숨겨진 장점, 기회비용, 실패 회피 포함. Provide counter-argument to challenge Thesis."

**Claude는 위 도구를 실행하고 Antithesis 반론 결과를 기록하세요.**

**Step 3: Synthesis (최종 통합) - decision_framework 활용**

**⚠️ 필수 실행 - Decision Framework MCP (DE 결과 재활용):**

DE Task에서 이미 실행한 decision_framework 결과(de_decision)를 활용하여 Synthesis를 강화합니다:

1. **다기준 점수 기반 통합**:
   - Thesis 옵션 점수: [X]/100
   - Antithesis 옵션 점수: [Y]/100
   - 점수 차이가 10점 이내면 조건부 결론 필수

2. **⚠️ 필수 실행 - Structured Argumentation MCP 즉시 호출:**

mcp__model-enhancement-servers__enhance_reasoning 호출:
- module: "structured-argumentation"
- task: "Based on Thesis, Antithesis, AND DE decision_framework scores: Construct Synthesis - 최종 추천 (점수 기반 근거), 조건부 결론 (IF-THEN-ELSE), 불확실성 % 명시, 검증 계획 포함. DE 다기준 점수를 Synthesis 논리에 통합."

**Claude는 위 도구를 실행하고 Synthesis 통합 결론을 기록하세요.**

---

### D3: W3 메타인지 + 저장 (60초)

**Step 1: Metacognitive Monitoring (MANDATORY) - clear-thought-1.5**

**⚠️ 필수 실행 - Metacognitive Monitoring MCP (clear-thought-1.5) 즉시 호출:**

mcp__clear-thought-1_5__clear_thought 호출:
- operation: "metacognitive_monitoring"
- prompt: "의사결정 품질 검증: DA/DB/DC/DD/DE 결과 교차 검증, 편향 제거 확인, decision_framework 점수 신뢰도, 할루시네이션 체크, 대안 해석 가능성. 확신도 % 명시."
- parameters: {
    task: "[USER_DECISION_TOPIC] 의사결정 검증",
    stage: "final_verification"
  }

**Claude는 위 도구를 실행하고 품질 평가 결과(확신도 %, 개선 제안)를 기록하세요.**

**품질 평가 기준**:
- **A등급 (90-100%)**: 모든 분석 일치, 편향 없음, decision_framework 점수 차이 명확 (>15점)
- **B등급 (80-89%)**: 대부분 일치, 경미한 편향, 점수 차이 중간 (10-15점)
- **C등급 (70-79%)**: 일부 불일치, 편향 존재, 점수 차이 작음 (5-10점)
- **D등급 (60-69%)**: 다수 불일치, 심각한 편향, 점수 차이 매우 작음 (<5점)
- **F등급 (<60%)**: 분석 실패, 재실행 필요

**Step 2: Serena Memory 저장 (권장 ⚠️ - MCP 사용 가능 시 저장)**

```javascript
// ⚠️ Claude 주의: Serena MCP 사용 가능하고 프로젝트 활성화 시 저장
// 목적: S2+ 세션에서 D0 검색으로 이 심층 분석을 재사용 (75k→300 tokens)
// MCP 미설치 또는 프로젝트 미활성화 시 생략 (기능 정상 동작)

try {
  const config = mcp__serena-memory__get_current_config()
  const hasActiveProject = config && config.includes("Active project:")

  if (hasActiveProject) {
    mcp__serena-memory__write_memory({
      key: `decision_deep_[topic_summary]_[YYYY-MM-DD]`,
      value: JSON.stringify({
        topic: "[USER_DECISION_TOPIC]",
        options: ["A", "B", "C"],
        analysis: {
          sequential: "[DA results summary]",
          stochastic: { success_prob: [...], risk_matrix: [...] },
          bias_check: { confirmation: [...], anchoring: [...], optimism: [...] },
          multi_perspective: { technical: [...], cost: [...], user: [...], risk: [...] },
          analogical: { success_cases: [...], failure_cases: [...] }
        },
        thesis: "[Thesis summary]",
        antithesis: "[Antithesis summary]",
        synthesis: "[Synthesis summary]",
        recommendation: "[Final option]",
        confidence: "[X]%",
        conditions: "[IF-THEN conditions]",
        mode: "deep",
        timestamp: new Date().toISOString()
      })
    })
    console.log("✅ 심층 의사결정 분석 저장 완료 - 다음 세션 D0 검색 시 재사용")
  } else {
    console.log("⚠️ Serena 프로젝트 미활성화 - 저장 생략 (기능 정상 동작)")
  }
} catch (e) {
  console.log("⚠️ Serena MCP 미사용 - 저장 생략 (기능 정상 동작)")
}
```

**Final Output**:

```markdown
---

✅ **Deep Mode 완료** (550-800 tokens, v2.7.0)

**최종 추천**: Option [X]
**확신도**: [X]% (metacognitive_monitoring clear-thought-1.5 평가)
**다기준 점수**: [X]/100 (decision_framework 기반)
**조건**: [IF condition THEN recommendation]
**검증 계획**: [Next steps to validate decision]
```

---

## Circuit Breaker Rules (Auto Mode Switching)

### Quick → Deep Escalation

**Trigger conditions during Quick Mode execution:**

```
IF any of these conditions TRUE:
  1. User explicitly says "더 분석해줘" OR "심층 분석"
  2. Options score difference < 10% (too close to call)
  3. Recommendation confidence < 60% (low confidence)
  4. User challenges recommendation ("정말?", "확실해?", "다른 관점은?")

THEN:
  - Output: "Quick Mode 결과 불확실 → Deep Mode 전환합니다."
  - Execute D1-D2-D3 (Deep Mode flow)
```

### Deep → Quick Simplification

**Trigger conditions during Deep Mode:**

```
IF any of these conditions TRUE:
  1. D0 finds similar decision with high confidence (>90% match)
  2. DA sequential analysis reveals simple trade-off (only 2 viable options)
  3. User says "간단히 요약해줘"

THEN:
  - Output: "유사 사례 발견 / 단순 트레이드오프 → Quick Mode 요약으로 전환"
  - Summarize Deep Mode results in Q1-Q2-Q3 format
```

---

## Token Budget Enforcement

### Quick Mode Token Limits

```
Target: 350-500 tokens (v2.7.0 updated)

Q1 (옵션 생성 + Sequential): 80-120 tokens
Q2 (비교표): 80-120 tokens
Q3 (추천 + Bias + decision_framework): 120-180 tokens
Q3-Advanced (+ Stochastic): +100-150 tokens (조건부)
Q4 (완료): 10-20 tokens

WARNING if exceeds 500 tokens (기본) or 650 tokens (Advanced):
  "⚠️ Quick Mode 토큰 초과 (actual: [X] tokens) - 다음에는 Deep Mode 고려 필요"
```

### Deep Mode Token Limits

```
Target: 550-800 tokens (v2.7.0 updated)

D0 (검색): 0-50 tokens (optional)
D1 (W1 5 Tasks): 250-350 tokens (DA/DB/DC/DD/DE - DE 신규 추가)
D2 (W2 논증 + decision_framework): 180-250 tokens (Thesis + Antithesis + Synthesis)
D3 (W3 메타인지 clear-thought-1.5): 120-200 tokens (Quality check + Serena save)

WARNING if exceeds 800 tokens:
  "⚠️ Deep Mode 토큰 초과 (actual: [X] tokens) - 분석 범위 축소 필요"
```

---

## Success Criteria Validation

### Quick Mode Success Checklist

**Before outputting completion message, verify:**

- [ ] **3개+ 구체적 옵션**: NOT generic placeholders like "Option 1", "Option 2"
- [ ] **비교표 포함**: Markdown table with 3-4 criteria + "적합 상황" row
- [ ] **명확한 추천 + 3가지 이유**: ONE option selected with EXACTLY 3 reasons
- [ ] **Token <= 300**: Actual token count within budget
- [ ] **트레이드오프 명시**: "주의사항" section with trade-offs and conditions
- [ ] **Serena 저장 시도** (MCP 사용 가능 시): "✅ 의사결정 기록 저장 완료" 또는 "⚠️ Serena MCP 미설치" 메시지 출력 확인

**If ANY checkbox fails**:
```markdown
❌ **Quick Mode 실패** - 다음 항목 미충족:
- [ ] [failed item 1]
- [ ] [failed item 2]

→ 재실행 중...
```

### Deep Mode Success Checklist

**Before outputting completion message, verify:**

- [ ] **W1: 5 Task 순차 완료**: DA, DB, DC, DD, DE all executed and results collected (DE 신규 추가 - systems_thinking + decision_framework)
- [ ] **W2: Thesis-Antithesis-Synthesis 완료**: All 3 dialectic steps completed
- [ ] **W3: 메타인지 완료**: Quality verification done
- [ ] **Token <= 700**: Actual token count within budget
- [ ] **확신도 % 명시**: Confidence level (e.g., "87% 확신") explicitly stated
- [ ] **Serena 저장 시도** (MCP 사용 가능 시): "✅ 심층 의사결정 분석 저장 완료" 또는 "⚠️ Serena MCP 미설치" 메시지 출력 확인

**If ANY checkbox fails**:
```markdown
❌ **Deep Mode 실패** - 다음 항목 미충족:
- [ ] [failed item 1]
- [ ] [failed item 2]

→ 재실행 중...
```

---

## Error Handling

### MCP Dependency Unavailable

```
IF mcp__sequential-thinking-tools__sequential_thinking NOT available:
  - SKIP DA Task in Deep Mode
  - Use generic sequential analysis instead
  - Add warning: "⚠️ Sequential Thinking MCP 미사용 - 기본 분석으로 대체"

IF mcp__stochastic-thinking__stochastic_analysis NOT available:
  - SKIP DB Task in Deep Mode
  - Use qualitative risk assessment instead
  - Add warning: "⚠️ Stochastic Thinking MCP 미사용 - 정성적 리스크 평가로 대체"

IF mcp__model-enhancement-servers__enhance_reasoning NOT available:
  - SKIP DC, DD Tasks in Deep Mode
  - Use basic multi-perspective analysis instead
  - Add warning: "⚠️ Model Enhancement MCP 미사용 - 기본 다관점 분석으로 대체"

IF mcp__serena-memory__* NOT available:
  - SKIP D0 (search) and Serena save steps
  - Continue with decision-making workflow
  - NO warning needed (Serena is optional)
```

### Task Execution Failure

```
IF Task() invocation fails or times out:
  - Retry once with same parameters
  - IF retry fails:
    - Continue with available Tasks (e.g., if DA fails, use DB/DC/DD)
    - Add note: "⚠️ [Task name] 실패 - 나머지 분석으로 진행"
    - Lower confidence level by 10-15%
```

### Token Budget Exceeded

```
IF Quick Mode > 300 tokens:
  - Complete current execution
  - Add warning: "⚠️ Token 초과 ([X] tokens) - 다음에는 간결한 표현 필요"
  - Suggest: "복잡도 높으면 Deep Mode 사용 고려"

IF Deep Mode > 700 tokens:
  - Complete current execution
  - Add warning: "⚠️ Token 초과 ([X] tokens) - 분석 범위 축소 필요"
  - Suggest: "다음에는 핵심 분석만 선택 (예: DA+DB만)"
```

---

## Architecture Preset Special Logic

### Team Size-Based Recommendation

```
Extract team size from user input:
  - "팀 12명" → team_size = 12
  - "15명의 개발자" → team_size = 15
  - "우리 조직은 30명" → team_size = 30

IF team_size < 10:
  → Recommend: Monolith
  → Reason: "작은 팀은 단순한 아키텍처가 생산성 최대화"
  → Condition: "팀이 10명 넘으면 Modular Monolith 전환 고려"

ELSE IF team_size >= 10 AND team_size < 30:
  → Recommend: Modular Monolith
  → Reason: "중간 규모 팀은 모듈 경계로 확장성 확보하되 복잡도 제어"
  → Condition: "팀이 30명 넘으면 MSA 전환 고려"

ELSE IF team_size >= 30:
  → Recommend: MSA
  → Reason: "대규모 팀은 독립 배포로 병렬 개발 효율 극대화"
  → Condition: "팀이 줄어들면 Modular Monolith로 단순화 고려"
```

### B2B SaaS Special Considerations

```
IF user mentions "B2B SaaS" OR "enterprise" OR "multi-tenant":
  → Add criteria to comparison table:
    - Multi-tenancy support
    - Customization flexibility
    - SLA guarantee capability

  → Adjust recommendation:
    - Monolith: "⚠️ Multi-tenancy 복잡도 증가 우려"
    - Modular Monolith: "✅ Tenant별 모듈 격리 가능"
    - MSA: "✅ Tenant별 독립 배포 가능"
```

---

## Final Checklist (Internal Quality Control)

**Before completing ANY decision workflow, Claude MUST verify:**

1. **Mode Selected Correctly**: Complexity score calculated and logged
2. **Options Generated**: 3-5 concrete options with distinct names and descriptions (Sequential Thinking 사용)
3. **Comparison Table Created**: Markdown table with criteria and "적합 상황"
4. **Recommendation Made**: ONE option selected with EXACTLY 3 reasons (Bias Detection 통과)
5. **Trade-offs Mentioned**: "주의사항" section with trade-offs and conditions
6. **Token Budget Met**: Quick <= 450 (Basic) OR <= 600 (Advanced with Stochastic) OR Deep <= 700
7. **MCP Execution Verified**: Sequential Thinking (Q1) + Bias Detection (Q3) + decision_framework (Q3) 실행 확인 (Quick) | DA/DB/DC/DD/DE 실행 확인 (Deep)
8. **Success Criteria Passed**: All checkboxes verified
9. **Errors Handled**: MCP unavailability gracefully handled with warnings

**If all 9 items pass**: Output completion message
**If any item fails**: Fix and re-execute failed step

---

**End of Execution Instructions**

**Version**: 2.8.0
**Last Updated**: 2025-12-29

---

## 변경 이력

See [CHANGELOG.md](./CHANGELOG.md) for version history and updates.

**Required MCPs**: sequential-thinking-tools, clear-thought-1.5, model-enhancement-servers (RE-ADDED), stochastic-thinking (조건부), clear-thought, serena-memory (optional)
**Compatibility**: decision-workflow skill.md v2.8.0

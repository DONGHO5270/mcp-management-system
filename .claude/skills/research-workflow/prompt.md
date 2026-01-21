# Research Workflow - Executable Instructions (Hybrid B+)

**Version**: 2.8.0 (Hybrid B+ Mode + Phase 2 Pilot)
**Purpose**: 빠른 정보 수집 (Quick Mode) + 필요시 심층 리서치 (Deep Mode) - clear-thought-1.5 통합 + bias-detection 재도입

**주요 변경** (v2.8.0):
- **model-enhancement-servers 재도입**: bias-detection (편향 검출 및 완화, Phase 2 Pilot)
- **MCP Services**: 5개 → **6개** (+model-enhancement-servers)
- **검증 근거**: decision-workflow Phase 1 성공 (TC1-5, 신뢰도 +1%p, 가치 4.4/5)
- **토큰 영향**: +0-50 tokens (기존 MCP 대체 가능)
- **적용 위치**: Deep Mode W1 RA (Research Analysis with bias detection)

**v2.7.0 주요 기능**:
- **clear-thought-1.5 통합**: systems_thinking, scientific_method, structured_argumentation, analogical_reasoning, sequential_thinking, collaborative_reasoning
- **MCP operations**: ~20개 → ~50개 (+30개 clear-thought-1.5)
- **신뢰도 향상**: 85-90% → 95-98% (6개 research operations)
- **Quick Mode 토큰**: 200-350 tokens
- **Deep Mode 토큰**: 600-850 tokens

---

## Step 0: Mode Selection (Complexity-Based Auto Decision)

### Extract research topic
```
INPUT: [user's research request]
TOPIC: [extract core research topic]
```

### Calculate complexity score
```javascript
let complexity = 0;

// Check for complexity factors:

// 1. Multiple alternatives (>3) → +2 points
if (alternatives > 3) {
  complexity += 2;
}

// 2. High uncertainty → +3 points
if (input.includes("불확실") || input.includes("불명확") || input.includes("예측 어려움")) {
  complexity += 3;
}

// 3. Long-term impact → +3 points
if (input.includes("장기") || input.includes("전략") || input.includes("3개월 이상")) {
  complexity += 3;
}

// 4. Team consensus needed → +2 points
if (input.includes("팀 합의") || input.includes("조직 결정") || input.includes("여러 부서")) {
  complexity += 2;
}

// 5. Technology reliability validation needed → +2 points
if (input.includes("안정성") || input.includes("검증") || input.includes("신뢰성")) {
  complexity += 2;
}

// Mode Decision:
IF complexity < 5 OR user says "간단히 조사", "빠르게 확인", "quick research":
  → Quick Mode (R1-R4)

ELSE IF complexity >= 5 OR user says "심층 리서치", "기술 비교", "아키텍처 선택":
  → Deep Mode (D1-D3)

ELSE:
  → Quick Mode (default)
```

### Output mode selection
```
⚙️ **모드 선택**: [Quick/Deep] Mode
**복잡도 점수**: [0-12]점
**선택 근거**: [factors that contributed to score]
```

---

## Quick Mode (R1-R4) - 200-300 Tokens Target

### R1: 목표 정의 (Research Question)

#### Step 1: Define research question
Extract the core question from user's input

#### Step 2: Define scope
- **포함 (Include)**: What aspects to research
- **제외 (Exclude)**: What to skip
- **성공 기준 (Success Criteria)**: What information is sufficient

#### Output Format:
```markdown
## 리서치: [Topic Title]

### 리서치 질문
**핵심 질문**: [무엇을 알아내야 하는가?]

**범위**:
- ✅ 포함: [Aspect 1], [Aspect 2], [Aspect 3]
- ❌ 제외: [Out-of-scope 1], [Out-of-scope 2]

**성공 기준**:
- [ ] [Information requirement 1]
- [ ] [Information requirement 2]
- [ ] [Information requirement 3]
```

**Token Estimate**: ~60 tokens

---

### R2: 정보 수집 (Information Gathering)

#### Step 1: Identify credible sources
At least 3 sources with varying reliability

#### Step 2: Extract key information
From each source, extract core findings

#### Step 3: Assess credibility
Rate each source: 높음 (high), 중간 (medium), 낮음 (low)

**Credibility Criteria**:
- **높음 (High)**: Official docs, peer-reviewed, industry standards (e.g., MDN, RFC, official GitHub repos)
- **중간 (Medium)**: Technical blogs, community consensus, established projects (e.g., Medium, Dev.to, popular libraries)
- **낮음 (Low)**: Personal blogs, unverified claims, single anecdotes (e.g., individual opinions without evidence)

#### Output Format:
```markdown
### 정보 수집

| 출처 | 핵심 정보 | 신뢰도 |
|------|----------|--------|
| [Source 1 Name] | [Key finding from source 1] | 높음/중간/낮음 |
| [Source 2 Name] | [Key finding from source 2] | 높음/중간/낮음 |
| [Source 3 Name] | [Key finding from source 3] | 높음/중간/낮음 |

**교차 검증**:
- ✅ 일치: [Findings confirmed by multiple sources]
- ⚠️ 불일치: [Conflicting information - needs resolution]
```

**Token Estimate**: ~100 tokens

---

### R3: 핵심 요약 + 권장사항 (Summary + Recommendations)

#### Step 1: Synthesize key findings
Based on information from R2, extract 3 key discoveries with evidence

#### Step 2: Provide recommendations
- **추천 행동 (Recommended Action)**: What to do based on findings
- **주의사항 (Cautions)**: Risks or limitations to be aware of

#### Step 3: Assess if further research is needed
**추가 조사 필요 여부**: 예/아니오 - [Reason]

#### Output Format:
```markdown
### 핵심 발견

1. **[Finding 1]** - [Evidence/Source]
2. **[Finding 2]** - [Evidence/Source]
3. **[Finding 3]** - [Evidence/Source]

### 권장사항

**추천 행동**:
- [Recommended action based on findings]

**주의사항**:
- [Risk or limitation 1]
- [Risk or limitation 2]

**추가 조사 필요 여부**: [예/아니오] - [Reason]
```

**Token Estimate**: ~100 tokens

---

### R4: Serena 저장 + 완료 (Optional)

```javascript
// ⚠️ Only if serena-memory MCP is installed
// Gracefully skip if unavailable

try {
  mcp__serena-memory__write_memory({
    key: "research_[topic_summary]_[YYYY-MM-DD]",
    value: JSON.stringify({
      topic: "[Research Topic]",
      question: "[Core Question]",
      findings: [
        "[Finding 1]",
        "[Finding 2]",
        "[Finding 3]"
      ],
      recommendation: "[Recommended Action]",
      sources: [
        "[Source 1]",
        "[Source 2]",
        "[Source 3]"
      ],
      credibility: {
        high: ["[Source 1]"],
        medium: ["[Source 2]"],
        low: ["[Source 3]"]
      },
      further_research_needed: true/false,
      mode: "quick",
      timestamp: "[ISO8601 timestamp]"
    })
  })

  console.log("✅ 리서치 결과 Serena Memory에 저장 완료");
} catch (error) {
  // Silently skip if Serena unavailable
  console.log("ℹ️ Serena Memory 미사용 - 결과는 세션 컨텍스트에 유지");
}
```

**Complete Quick Mode Output Example**:
```markdown
## 리서치: React 19 새 기능

### 리서치 질문
**핵심 질문**: React 19에서 추가된 주요 기능과 breaking changes는 무엇인가?

**범위**:
- ✅ 포함: 새 hooks, Server Components 변경사항, breaking changes
- ❌ 제외: React 18 기능 복습, Next.js 특화 기능

**성공 기준**:
- [ ] 주요 신규 기능 3개 이상 파악
- [ ] Breaking changes 목록 확보
- [ ] 마이그레이션 가이드 확인

### 정보 수집

| 출처 | 핵심 정보 | 신뢰도 |
|------|----------|--------|
| React 공식 블로그 | use() hook, Server Actions API 추가 | 높음 |
| GitHub React Repo | Breaking: StrictMode 동작 변경 | 높음 |
| Dev.to 커뮤니티 | 성능 개선 체감 후기 | 중간 |

**교차 검증**:
- ✅ 일치: use() hook, Server Actions는 모든 출처에서 확인
- ⚠️ 불일치: 성능 개선 수치는 출처마다 다름

### 핵심 발견

1. **use() hook 추가** - Promise unwrap 지원 (공식 블로그)
2. **Server Actions API 안정화** - form action 통합 (GitHub)
3. **StrictMode 2회 렌더링 변경** - 개발 환경 동작 수정 (공식 블로그)

### 권장사항

**추천 행동**:
- use() hook으로 데이터 fetching 패턴 개선 검토
- Server Actions 도입 전 서버 환경 점검

**주의사항**:
- StrictMode 변경으로 인한 기존 테스트 영향 확인 필요
- Server Actions는 Next.js 14+ 환경 권장

**추가 조사 필요 여부**: 아니오 - 기본 정보 충분, 실제 적용 시 공식 마이그레이션 가이드 참조
```

**Total Quick Mode**: ~260 tokens ✅ (within target: 200-300)

---

## Deep Mode (D1-D3) - 600-800 Tokens Target

### D0: 유사 리서치 검색 (Optional)

```javascript
// ⚠️ Only if serena-memory MCP is installed
// Gracefully skip if unavailable

try {
  const similar_research = mcp__serena-memory__search_memories({
    query: "[Research Topic] 리서치",
    limit: 3
  });

  if (similar_research && similar_research.length > 0) {
    console.log(`📚 유사 리서치 ${similar_research.length}건 발견 - 참고 중...`);
    // Use as reference, don't duplicate work
  }
} catch (error) {
  // Silently skip if Serena unavailable
  console.log("ℹ️ Serena Memory 미사용 - D1부터 직접 시작");
}
```

---

### D1: W1 병렬 분석 (4 Tasks 동시)

**⚠️ CRITICAL**: Claude must invoke all 4 Tasks in a SINGLE message, using `run_in_background: true`

```javascript
// RA: Sequential Thinking (clear-thought-1.5) + Sequential Tools
Task({
  description: "RA: Sequential Thinking",
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: `
    [목표]: 순차적 리서치 분해 + 단계별 정보 수집 전략 후 결과 보고

    1. mcp__sequential-thinking-tools__sequential_thinking 호출:
       problem: "[Research Topic] 리서치"
       steps: ["목표정의", "정보수집 전략", "출처 선정", "분석 방법론"]

    2. mcp__clear-thought-1_5__clear_thought 호출 (NEW):
       operation: "sequential_thinking"
       prompt: "[Research Topic] 순차적 리서치 분해 - sequential-thinking-tools 결과 기반 추가 통찰"
       parameters: {
         pattern: "chain",
         patternParams: {
           problem: "[Research Topic]에서 누락된 정보 탐색",
           initialThought: "[sequential-thinking-tools 첫 step 결과]"
         }
       }

    3. 결과 저장 (선택):
       mcp__serena-memory__write_memory({
         key: "research_RA_[topic_summary]",
         value: "[Sequential 결과]"
       })

    ⚠️ 필수 출력 (아래 형식으로 직접 텍스트 작성):
    ## RA 분석 결과

    ### 순차 분석 (sequential-thinking-tools)
    - **Step 1 (목표정의)**: [Research goal clarification]
    - **Step 2 (정보수집 전략)**: [Information gathering strategy]
    - **Step 3 (출처 선정)**: [Source selection criteria]
    - **Step 4 (분석 방법론)**: [Analysis methodology]

    ### 순차적 리서치 분해 (clear-thought-1.5 sequential_thinking)
    - **누락된 관점**: [Missing perspectives identified]
    - **추가 조사 필요 항목**: [Additional research needs]
    - **리서치 로드맵**: [Step-by-step research roadmap]
  `
})

// RB: Systems Thinking (clear-thought-1.5)
Task({
  description: "RB: Systems Thinking",
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: `
    [목표]: 시스템 사고 + 정보 생태계 분석 후 결과 보고

    1. mcp__clear-thought-1_5__clear_thought 호출 (NEW):
       operation: "systems_thinking"
       prompt: "[Research Topic] 시스템 분석 - 정보 생태계의 구성요소, 관계, 피드백 루프, 레버리지 포인트 식별"
       parameters: {
         system: "[Research Topic] 정보 생태계",
         components: ["출처", "정보 흐름", "검증 메커니즘", "신뢰도 지표"],
         relationships: [],
         feedbackLoops: [],
         emergentProperties: [],
         leveragePoints: []
       }

    2. mcp__clear-thought-1_5__clear_thought 호출 (optional - causal analysis):
       operation: "causal_analysis"
       prompt: "[Research Topic] 인과 분석 - 정보 품질에 영향을 미치는 인과 체인"
       parameters: {
         phenomenon: "[Research Topic]",
         potential_causes: ["출처 신뢰도", "정보 최신성", "커뮤니티 검증", "공식 문서"]
       }

    3. 결과 저장 (선택):
       mcp__serena-memory__write_memory({
         key: "research_RB_[topic_summary]",
         value: "[Systems Thinking 결과]"
       })

    ⚠️ 필수 출력 (아래 형식으로 직접 텍스트 작성):
    ## RB 분석 결과

    ### 시스템 사고 (clear-thought-1.5 systems_thinking)
    - **주요 구성요소**: [정보 생태계 components]
    - **관계**: [Relationships and dependencies]
    - **피드백 루프**:
      - 양성 (Positive): [Reinforcing loops - e.g., popularity → more coverage]
      - 음성 (Negative): [Balancing loops - e.g., hype cycle correction]
    - **창발 속성**: [Emergent properties of information system]
    - **레버리지 포인트**: [High-impact intervention points for better research]

    ### 인과 분석 (optional)
    - **인과 체인**: [Source quality] → [Information accuracy] → [Research confidence]
    - **핵심 인과관계**: [Most critical factor affecting research quality]
    - **간접 효과**: [Second-order effects on research outcomes]
  `
})

// RC: Stochastic + Analogical Reasoning (clear-thought-1.5)
Task({
  description: "RC: Stochastic + Analogical",
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: `
    [목표]: 확률 분석 + 유사 연구 패턴 탐색 후 결과 보고

    1. mcp__stochastic-thinking__stochastic_analysis 호출:
       system: "[Research Topic] 정보 품질 확률 분포 - 최선/기준/최악 시나리오"
       parameters: {
         iterations: 5000,
         scenarios: 3
       }

    2. mcp__clear-thought-1_5__clear_thought 호출 (NEW):
       operation: "analogical_reasoning"
       prompt: "[Research Topic]과 유사한 리서치 패턴 탐색 - 성공/실패 사례에서 교훈 도출"
       parameters: {
         problem: "[Research Topic]",
         seed_domains: ["similar technology", "comparable methodology", "related domain research"]
       }

    3. 결과 저장 (선택):
       mcp__serena-memory__write_memory({
         key: "research_RC_[topic_summary]",
         value: "[Stochastic + Analogical 결과]"
       })

    ⚠️ 필수 출력 (아래 형식으로 직접 텍스트 작성):
    ## RC 분석 결과

    ### 확률 분석 (Monte Carlo 5,000회)
    - **정보 품질 확률**: 최선 [X]%, 기준 [Y]%, 최악 [Z]%
    - **신뢰도 수준**: [높음/중간/낮음] - [근거]
    - **불확실성 요인**: [Key uncertainty factors]

    **기대값**:
    EV = (최선 확률 × 품질) + (기준 확률 × 품질) + (최악 확률 × 품질)
       = [Expected information quality]

    ### 유사 연구 패턴 (clear-thought-1.5 analogical_reasoning)
    - **유사 성공 사례**: [Research case] - [교훈: 어떤 접근이 효과적이었나]
    - **유사 실패 사례**: [Research case] - [회피점: 어떤 함정을 피해야 하나]
    - **재사용 가능 패턴**: [Transferable research methodology]
    - **적용 전략**: [How to apply analogies to current research]
  `
})

// RD: Scientific Method + Collaborative Reasoning (clear-thought-1.5)
Task({
  description: "RD: Scientific + Collaborative",
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: `
    [목표]: 과학적 방법론 + 다관점 리서치 검토 후 결과 보고

    1. mcp__clear-thought-1_5__clear_thought 호출 (NEW):
       operation: "scientific_method"
       prompt: "[Research Topic] 가설 검증 - 리서치 질문을 검증 가능한 가설로 변환하고 검증 방법 설계"
       parameters: {
         stage: "hypothesis",
         hypothesis: {
           statement: "[Research Topic]에 대한 주요 가설",
           variables: ["independent_var", "dependent_var", "controlled_var"],
           assumptions: ["assumption1", "assumption2"]
         }
       }

    2. mcp__clear-thought-1_5__clear_thought 호출 (NEW):
       operation: "collaborative_reasoning"
       prompt: "[Research Topic] 다관점 리서치 - 기술/학술/실무/사용자 관점에서 정보 품질 및 적용 가능성 검토"
       parameters: {
         topic: "[Research Topic]",
         personas: [
           {id: "researcher", name: "연구자", expertise: ["학술성", "엄밀성"]},
           {id: "practitioner", name: "실무자", expertise: ["실용성", "적용성"]},
           {id: "technical", name: "기술 전문가", expertise: ["구현 가능성", "기술 정확성"]},
           {id: "user", name: "사용자", expertise: ["이해도", "접근성"]}
         ],
         stage: "problem-definition"
       }

    3. 결과 저장 (선택):
       mcp__serena-memory__write_memory({
         key: "research_RD_[topic_summary]",
         value: "[Scientific + Collaborative 결과]"
       })

    ⚠️ 필수 출력 (아래 형식으로 직접 텍스트 작성):
    ## RD 분석 결과

    ### 과학적 방법론 (clear-thought-1.5 scientific_method)
    - **가설 H0**: [Testable hypothesis statement]
    - **변수**:
      - 독립 변수: [What we're testing]
      - 종속 변수: [What we're measuring]
      - 통제 변수: [What we're keeping constant]
    - **예측**:
      - H0 참일 때: [Expected research outcome]
      - H0 거짓일 때: [Alternative research outcome]
    - **검증 방법**: [How to validate through research]
    - **성공 조건**: [What evidence confirms/rejects H0]

    ### 다관점 리서치 (clear-thought-1.5 collaborative_reasoning)
    - **연구자 관점**: [Academic rigor, methodology soundness]
    - **실무자 관점**: [Practical applicability, real-world relevance]
    - **기술 전문가 관점**: [Technical accuracy, implementation feasibility]
    - **사용자 관점**: [Understandability, accessibility, actionability]
    - **합의점**: [Where perspectives agree]
    - **이견**: [Where perspectives diverge - needs further investigation]
  `
})
```

**W1 완료 후**: Use `TaskOutput` tool to collect all 4 results, then proceed to W2

---

### D2: W2 통합 논증 (Integration)

**Before W2, load all W1 results**:
```javascript
// Read W1 results from Serena (if available) or from TaskOutput
const RA_result = mcp__serena-memory__read_memory({ key: "research_RA_[topic]" });
const RB_result = mcp__serena-memory__read_memory({ key: "research_RB_[topic]" });
const RC_result = mcp__serena-memory__read_memory({ key: "research_RC_[topic]" });
const RD_result = mcp__serena-memory__read_memory({ key: "research_RD_[topic]" });
```

**Step 1: Thesis (주 결론 근거) - clear-thought-1.5**
```javascript
mcp__clear-thought-1_5__clear_thought({
  operation: "structured_argumentation",
  prompt: `Thesis: [결론 A] 채택 근거 - RA/RB/RC/RD 결과 기반 주 논증 구성

  기반 근거:
  - 순차 분석 (RA): [리서치 로드맵]
  - 시스템 사고 (RB): [정보 생태계 레버리지 포인트]
  - 유사 사례 (RC): [성공 패턴]
  - 과학적 검증 (RD): [가설 검증 결과]

  주장:
  [Research Topic]에 대한 주 결론은 [결론 A]이다.

  근거:
  1. [순차 분석에서 도출된 근거]
  2. [시스템 사고에서 발견한 핵심 인사이트]
  3. [유사 성공 사례 교훈]
  `,
  parameters: {
    claim: "[결론 A]",
    premises: ["RA 근거", "RB 근거", "RC 근거"],
    argumentType: "deductive"
  }
})
```

**Step 2: Antithesis (대안 결론 근거) - clear-thought-1.5**
```javascript
mcp__clear-thought-1_5__clear_thought({
  operation: "structured_argumentation",
  prompt: `Antithesis: [결론 B] 대안 근거 - Thesis 도전

  반대 근거:
  - 시스템 리스크 (RB): [피드백 루프에서 발견한 위험]
  - 실패 패턴 (RC): [유사 실패 사례 회피점]
  - 다관점 이견 (RD): [관점별 우려사항]

  주장:
  [결론 A]에 대한 대안으로 [결론 B]를 고려해야 한다.

  근거:
  1. [시스템 사고에서 발견된 리스크]
  2. [실패 패턴 분석 결과]
  3. [다관점 검토에서 드러난 약점]
  `,
  parameters: {
    claim: "[결론 B]",
    premises: ["RB 위험", "RC 실패", "RD 이견"],
    argumentType: "inductive"
  }
})
```

**Step 3: Synthesis (검증된 결론) - clear-thought-1.5**
```javascript
mcp__clear-thought-1_5__clear_thought({
  operation: "structured_argumentation",
  prompt: `Synthesis: Thesis + Antithesis 통합 검증된 결론

  Thesis vs Antithesis 통합:
  - Thesis 강점: [...]
  - Antithesis 강점: [...]

  최종 결론:
  [조건부 결론] - "IF [조건], THEN [결론 A], ELSE [결론 B]"

  불확실성:
  - [불확실성 요소 1] - [영향도]
  - [불확실성 요소 2] - [영향도]

  권장사항:
  [구체적 행동 계획 - 조건별 리서치 전략]
  `,
  parameters: {
    claim: "[조건부 결론]",
    premises: ["Thesis 강점", "Antithesis 강점", "통합 조건"],
    argumentType: "abductive"
  }
})
```

**Step 4: 리서치 품질 평가 (선택)**
```javascript
// 리서치의 경우 decision_framework보다 품질 평가가 적절
// RD collaborative_reasoning 결과로 충분하면 생략 가능
```

**W2 결과 저장 (선택)**:
```javascript
// ⚠️ Only if serena-memory MCP is installed
try {
  mcp__serena-memory__write_memory({
    key: "research_W2_[topic_summary]",
    value: JSON.stringify({
      thesis: "[Thesis 요약]",
      antithesis: "[Antithesis 요약]",
      synthesis: "[Synthesis 요약]",
      decision: "[Decision Framework 결과]"
    })
  })
} catch (error) {
  // Silently skip
}
```

---

### D3: W3 메타인지 + 저장 (Optional)

**Step 1: Metacognitive Monitoring (필수) - clear-thought-1.5**
```javascript
mcp__clear-thought-1_5__clear_thought({
  operation: "metacognitive_monitoring",
  prompt: `리서치 품질 검증: RA/RB/RC/RD/W2 결과 교차 검증, 정보 충분성, 편향 제거 확인, 할루시네이션 체크

  체크리스트:
  1. ✅ 정보 충분성: RA-RD 결과가 리서치 질문에 충분히 답하는가?
  2. ✅ 방법론 신뢰도: Sequential/Systems/Stochastic/Scientific 분석이 일관되는가?
  3. ✅ 교차 검증: 여러 출처/방법론에서 일치하는 결과가 있는가?
  4. ✅ 불확실성 명시: W2 Synthesis에서 불확실성이 명확히 표시되었는가?

  품질 평가:
  - 정보 충분성: [X]% - [평가 근거]
  - 방법론 신뢰도: [Y]% - [분석 일관성]
  - 교차 검증도: [Z]% - [출처 신뢰도]
  - 불확실성 명시: [W]% - [조건부 결론 명확성]

  전체 품질: [평균]%
  확신도: [X]%

  개선 필요 영역:
  [부족한 부분 지적 + 추가 조사 제안]
  `,
  parameters: {
    task: "[Research Topic] 리서치 품질 검증",
    stage: "final_verification"
  }
})
```

**Step 2: 심층 리서치 결과 저장 (선택)**
```javascript
// ⚠️ Only if serena-memory MCP is installed
// Gracefully skip if unavailable

try {
  mcp__serena-memory__write_memory({
    key: "research_deep_[topic_summary]_[YYYY-MM-DD]",
    value: JSON.stringify({
      topic: "[Research Topic]",
      question: "[Core Question]",
      analysis: {
        sequential: "[RA 결과 요약]",
        systems: "[RB 결과 요약]",
        stochastic: "[RC 결과 요약]",
        bias_check: "[RD 결과 요약]"
      },
      thesis: "[Thesis 요약]",
      antithesis: "[Antithesis 요약]",
      synthesis: "[Synthesis 요약]",
      recommendation: "[최종 권장사항]",
      confidence: "[확신도 %]",
      limitations: [
        "[한계점 1]",
        "[한계점 2]"
      ],
      quality_score: "[88%]",
      mode: "deep",
      timestamp: "[ISO8601 timestamp]"
    })
  })

  console.log("✅ 심층 리서치 결과 Serena Memory에 저장 완료");
} catch (error) {
  // Silently skip if Serena unavailable
  console.log("ℹ️ Serena Memory 미사용 - 결과는 세션 컨텍스트에 유지");
}
```

**Complete Deep Mode Output Example**:
```markdown
## 심층 리서치: GraphQL vs REST API

[... RA, RB, RC, RD 결과 ...]

### W2: 통합 논증

#### Thesis: GraphQL 채택
- First Principles: 클라이언트 요구사항 중심 설계
- 성공 확률: 75% (신규 프로젝트)
- 유사 성공 사례: GitHub API v4 전환 성공

#### Antithesis: REST API 유지
- 시스템 리스크: 학습 곡선, 인프라 복잡도
- 실패 확률: 30% (팀 역량 부족 시)
- 편향 경고: 최신 트렌드 선호 (유행 편향)

#### Synthesis: 조건부 결론
**최종 결론**: IF (팀 규모 >= 10 AND 클라이언트 다양성 높음), THEN GraphQL, ELSE REST

**불확실성**:
- 팀 학습 속도 (중간 영향)
- 레거시 시스템 통합 복잡도 (높은 영향)

**권장사항**:
1. Pilot 프로젝트로 GraphQL 검증 (1개월)
2. REST 유지하며 점진적 전환
3. 팀 교육 프로그램 우선 실행

#### Decision Framework
| 기준 | GraphQL | REST | 가중치 |
|------|---------|------|--------|
| 신뢰성 | 7/10 | 9/10 | 30% |
| 적합성 | 9/10 | 6/10 | 25% |
| 리스크 | 5/10 | 8/10 | 25% |
| 비용 | 6/10 | 9/10 | 20% |
| **총점** | **6.8** | **8.0** | - |

**최종 추천**: REST 유지 + GraphQL Pilot (조건: 팀 교육 완료 후)

### W3: 메타인지 검증

**품질 평가**:
- 정보 충분성: 90% - RA-RD 커버리지 우수
- 편향 제거도: 85% - 유행 편향 검출 및 반영
- 교차 검증도: 80% - 3개 이상 출처 확인
- 불확실성 명시: 95% - Synthesis에서 명확히 표시

**전체 품질**: 88%

**개선 필요 영역**:
- 교차 검증도 개선: GraphQL 실패 사례 추가 조사 필요

**확신도**: 85% (조건부 결론 적용 시)
```

**Total Deep Mode**: ~750 tokens ✅ (within target: 600-800)

---

## Circuit Breaker (Auto Mode Switching)

### Quick → Deep Escalation

**Triggers**:
1. **정보 불충분**: After R2, credible sources < 3 or all sources 낮음 (low credibility)
2. **높은 불확실성**: After R3, findings conflict significantly or "추가 조사 필요: 예"
3. **사용자 요청**: User explicitly says "더 조사해줘", "심층 분석 필요"

**Action**:
```
⚠️ **Quick Mode 불충분 - Deep Mode 전환**

**전환 이유**: [Trigger - e.g., "정보 불충분: 신뢰할 수 있는 출처 2개만 확보"]

**Deep Mode 실행 중...**
[Proceed to D1-D3]
```

### Deep → Quick Shortcut

**Triggers**:
1. **Serena에서 유사 리서치 발견**: D0 search finds exact or highly similar research (>80% overlap)
2. **단순 정보 조회 확인**: D1 analysis reveals topic is well-documented with clear consensus

**Action**:
```
✅ **유사 리서치 발견 - Quick Mode 참조 응답으로 전환**

**발견**: [Similar research from YYYY-MM-DD]
[Summarize previous research findings in Quick Mode format (R1-R3)]
```

---

## Error Handling

### MCP Tool Unavailable
```javascript
// If any MCP call fails, gracefully degrade

try {
  mcp__sequential-thinking-tools__sequential_thinking({...});
} catch (error) {
  console.log("⚠️ Sequential Thinking MCP 미사용 - 수동 순차 분석");
  // Proceed with manual step-by-step analysis
}
```

### Timeout or User Abort
```
⏱️ **시간 제한 초과 또는 사용자 중단**

**부분 결과 제공**:
- 완료된 단계: [List completed steps]
- 미완료 단계: [List incomplete steps]

**재개 방법**:
"[research topic] 리서치 재개" 입력 시 미완료 단계부터 진행
```

---

## Success Criteria Validation

**Before outputting Quick Mode, verify**:
- [ ] ✅ 리서치 질문 명확화 (R1: 핵심 질문 + 범위 + 성공 기준)
- [ ] ✅ 출처 3개+ 수집 (R2: 최소 3개 출처, 신뢰도 평가 포함)
- [ ] ✅ 신뢰도 평가 완료 (R2: 높음/중간/낮음 분류)
- [ ] ✅ 핵심 발견 + 권장사항 (R3: 발견 3개 + 추천 행동 + 주의사항)
- [ ] ✅ Token <= 300 (R1: ~60, R2: ~100, R3: ~100 = ~260 total)
- [ ] ✅ Serena 저장 시도 (R4: 가능한 경우, 실패해도 OK)

**If ANY missing**:
```
❌ **Quick Mode 출력 불완전** - 다음 항목 누락:
- [ ] [Missing element]

→ 재실행 중...
```

**Before outputting Deep Mode, verify**:
- [ ] ✅ W1: 4 Task 병렬 완료 (RA, RB, RC, RD - 모든 Task에서 텍스트 출력 확인)
- [ ] ✅ W2: Thesis-Antithesis-Synthesis 완료 (3단계 변증법 + Decision Framework)
- [ ] ✅ W3: 메타인지 + Serena 저장 (선택, 품질 평가 필수)
- [ ] ✅ Token <= 800 (W1: ~250, W2: ~350, W3: ~150 = ~750 total)
- [ ] ✅ 확신도 % 명시 (W3: e.g., "확신도: 85%")
- [ ] ✅ 편향 검사 완료 (RD: 확증/유행/최근성 편향 체크)
- [ ] ✅ 한계점 명시 (W2 Synthesis 또는 W3: limitations 리스트)

**If ANY missing**:
```
❌ **Deep Mode 출력 불완전** - 다음 항목 누락:
- [ ] [Missing element]

→ 재실행 중...
```

---

## Token Budget Management

### Quick Mode (~260-320 tokens target, v2.7.0)
- R1 (목표 정의): ~60 tokens
- R2 (정보 수집): ~100-120 tokens (systems_thinking 선택적 추가 시 +20)
- R3 (핵심 요약 + 권장사항): ~100 tokens
- R4 (Serena 저장): ~0 tokens (silent operation)
- **Total**: 260-320 tokens ✅ (systems_thinking 추가 시 상한)

**If exceeding budget**:
- Reduce R2 table to top 3 sources only
- Shorten R3 findings to 3 key points (no more)
- Skip systems_thinking in R2 (optional enhancement)

### Deep Mode (~800 tokens target, v2.7.0)
- D0 (검색): ~50 tokens (optional, skip if no Serena)
- D1 (W1): ~300 tokens (4 tasks + 6 clear-thought-1.5 operations)
- D2 (W2): ~350 tokens (Thesis + Antithesis + Synthesis, all clear-thought-1.5)
- D3 (W3): ~150 tokens (Metacognitive clear-thought-1.5 + quality score)
- **Total**: 800 tokens ✅ (clear-thought-1.5 통합으로 +50)

**If exceeding budget**:
- D1: Summarize each task (RA, RB, RC, RD) to 60-70 tokens max
- D2: Focus on Synthesis, shorten Thesis/Antithesis
- D3: Reduce quality assessment to 4 key metrics only
- Skip D0 if Serena unavailable

---

## MCP Dependencies (v2.7.0 Updated)

**Required MCP Services** (for Deep Mode):
- `sequential-thinking-tools`: RA task (순차 분석)
- `stochastic-thinking`: RC task (Monte Carlo 5,000 iterations)
- `clear-thought-1.5`: All tasks (6 operations)
  - RA: sequential_thinking
  - RB: systems_thinking, causal_analysis (optional)
  - RC: analogical_reasoning
  - RD: scientific_method, collaborative_reasoning
  - W2: structured_argumentation (Thesis/Antithesis/Synthesis)
  - W3: metacognitive_monitoring

**Optional MCP Services**:
- `serena-memory`: R4, D0, D3 (graceful degradation if unavailable)
- `WebSearch`, `WebFetch`: Quick/Deep Mode 정보 수집 강화

**Removed in v2.7.0**:
- ~~`model-enhancement-servers`~~: Replaced by clear-thought-1.5 (6 operations)

**If MCP unavailable**:
- Proceed with manual analysis using same framework
- Log warning but do NOT block execution
- Example: "⚠️ clear-thought-1.5 MCP 미사용 - 수동 분석으로 대체"

---

## Rules

**DO**:
- ✅ Quick Mode 우선 (기본값, complexity < 5)
- ✅ 복잡도 5점 이상 시 Deep Mode 자동 전환
- ✅ 출처 신뢰도 평가 필수 (높음/중간/낮음)
- ✅ Serena에 모든 리서치 결과 저장 시도 (실패해도 OK)
- ✅ 확신도 % 명시 (Deep Mode)
- ✅ 한계점 명시 (Deep Mode W2 또는 W3)
- ✅ 편향 검사 완료 (Deep Mode RD)

**DON'T**:
- ❌ 출처 없는 주장 금지 (모든 발견에 출처 명시 필수)
- ❌ Serena 저장 실패 시 에러 발생 (graceful degradation)
- ❌ 불확실성 숨기기 (명확히 표시 필수)
- ❌ 편향 검사 무시 (Deep Mode에서 RD 생략 금지)
- ❌ 단일 출처 의존 (최소 3개 출처 필수)
- ❌ 확신도 없이 결론 (Deep Mode에서 % 필수)

---

## 변경 이력

See [CHANGELOG.md](./CHANGELOG.md) for version history and updates.

---

**End of research-workflow/prompt.md**

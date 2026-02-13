# Agent Council Skill Execution Instructions

## Skill의 역할 (중요 ⚠️)

**Skill은 실행 가능한 코드가 아닙니다**. Skill은 Claude에게 제공되는 **프롬프트 템플릿**입니다.

### Skill이 할 수 있는 것 ✅
- 5-Persona 토론 구조화 (Round 1 → Round 2 → Round 3)
- MCP 호출 시점 가이드 (collaborative_reasoning, bias-detection)
- 출력 형식 템플릿 제공

### Skill이 할 수 없는 것 ❌
- **MCP 자동 실행** (Claude가 직접 호출해야 함)
- 조건부 로직 자동 실행 (if/else는 가이드일 뿐)

**핵심**: Skill의 코드 블록은 "참고 예시"가 아닙니다. **Claude가 직접 실행**해야 합니다.

---

**Version**: 1.0.0
**Purpose**: 5-Persona 전문가 패널 시뮬레이션 및 합의 도출

---

## ⚠️ 필수 실행 순서

**Claude는 토론 분석 전에 반드시 다음 MCP를 호출해야 합니다:**

### 1단계: Collaborative Reasoning 호출

```javascript
// ⚠️ Claude 주의: 이 코드는 "반드시" 실행해야 합니다 (참고 예시 아님)
mcp__clear-thought-1_5__clear_thought({
  operation: "collaborative_reasoning",
  prompt: "[사용자 의사결정 주제] - 5개 페르소나 (Architect/CFO/DevOps/Security/PM) 관점에서 토론",
  parameters: {
    topic: "[USER_DECISION_TOPIC]",
    personas: [
      {
        id: "architect",
        name: "Technical Architect",
        expertise: ["system design", "scalability", "tech debt"],
        background: "10+ years enterprise architecture",
        perspective: "기술적 실현 가능성 및 장기 유지보수성",
        biases: ["optimism bias (새 기술)", "anchoring bias (기존 아키텍처)"],
        communication: { style: "technical", tone: "analytical" }
      },
      {
        id: "cfo",
        name: "CFO",
        expertise: ["financial planning", "ROI", "cost optimization"],
        background: "15+ years financial management",
        perspective: "비용 효율성 및 재무적 지속가능성",
        biases: ["loss aversion", "status quo bias"],
        communication: { style: "formal", tone: "challenging" }
      },
      {
        id: "devops",
        name: "DevOps Lead",
        expertise: ["deployment", "monitoring", "reliability"],
        background: "8+ years SRE/DevOps",
        perspective: "운영 복잡도 및 안정성",
        biases: ["availability bias (최근 장애)", "confirmation bias (운영 경험)"],
        communication: { style: "casual", tone: "supportive" }
      },
      {
        id: "security",
        name: "Security Officer",
        expertise: ["security", "compliance", "data protection"],
        background: "12+ years cybersecurity",
        perspective: "보안 위협 및 규제 준수",
        biases: ["worst-case thinking", "risk aversion"],
        communication: { style: "formal", tone: "challenging" }
      },
      {
        id: "pm",
        name: "Project Manager",
        expertise: ["scheduling", "resource allocation", "stakeholder management"],
        background: "7+ years project management",
        perspective: "일정 및 리소스 실현 가능성",
        biases: ["planning fallacy", "optimism bias (일정)"],
        communication: { style: "casual", tone: "neutral" }
      }
    ],
    contributions: [],
    stage: "problem-definition",
    activePersonaId: "architect",
    sessionId: "[UNIQUE_SESSION_ID]",
    iteration: 1,
    nextContributionNeeded: true
  }
})
```

---

## Execution Flow (Claude MUST follow)

### Step 0: Context Extraction (30초)

**Extract key information from user input:**

1. **Decision Topic**: What is the user asking?
2. **Team Size**: Extract if mentioned (default: 10-30명)
3. **Budget**: Extract if mentioned (default: $10k-100k)
4. **Timeline**: Extract if mentioned (default: 3-6개월)
5. **Stakeholders**: Who will be affected?

**Output Example:**
```markdown
## 의사결정 컨텍스트

**주제**: [USER_DECISION_TOPIC]
**팀 규모**: [X]명
**예산**: $[Y]
**일정**: [Z]개월
**이해관계자**: [개발팀, 경영진, 고객 등]

🎯 **Agent Council 시작** (5-Persona Expert Panel)
```

---

### Round 1: Initial Opinions (200-300 tokens, 120초)

**⚠️ 필수 실행 - Collaborative Reasoning MCP (clear-thought-1.5):**

**STEP 1: 5-Persona 순차 의견 수집**

```javascript
// ⚠️ Claude 주의: 이 코드는 "반드시" 실행해야 합니다
mcp__clear-thought-1_5__clear_thought({
  operation: "collaborative_reasoning",
  prompt: "[USER_DECISION_TOPIC] - Round 1: 각 페르소나별 초안 의견 (찬성/반대/조건부 입장 + 핵심 근거 2-3개)",
  parameters: {
    topic: "[USER_DECISION_TOPIC]",
    personas: [...], // Step 0에서 정의한 5-persona
    stage: "ideation",
    iteration: 1
  }
})
```

**결과를 받은 후 다음 처리:**

**STEP 2: 각 Persona 의견 정리**

1. **Architect**:
   - Position: [찬성/반대/조건부]
   - Key Arguments (2-3개):
     - 기술 스택 적합성
     - 확장성 고려사항
     - 기술 부채 우려
   - Confidence: [X]% (자체 평가)

2. **CFO**:
   - Position: [찬성/반대/조건부]
   - Key Arguments (2-3개):
     - 초기 투자 비용
     - OpEx 변화
     - ROI 예상 (payback period)
   - Confidence: [X]%

3. **DevOps**:
   - Position: [찬성/반대/조건부]
   - Key Arguments (2-3개):
     - 배포 복잡도
     - 모니터링 요구사항
     - 운영 리스크
   - Confidence: [X]%

4. **Security**:
   - Position: [찬성/반대/조건부]
   - Key Arguments (2-3개):
     - 보안 취약점
     - Compliance 영향
     - 데이터 보호
   - Confidence: [X]%

5. **PM**:
   - Position: [찬성/반대/조건부]
   - Key Arguments (2-3개):
     - 개발 일정 영향
     - 팀 리소스 부족
     - 마일스톤 위험
   - Confidence: [X]%

**Output Format (MUST use this exact format):**
```markdown
## Round 1: 초안 의견

### 🏗️ Architect: [찬성/반대/조건부]
- **입장**: [한 줄 요약]
- **근거**:
  1. [기술적 근거 1]
  2. [기술적 근거 2]
  3. [기술적 근거 3]
- **Confidence**: [X]%

### 💰 CFO: [찬성/반대/조건부]
- **입장**: [한 줄 요약]
- **근거**:
  1. [재무적 근거 1]
  2. [재무적 근거 2]
  3. [재무적 근거 3]
- **Confidence**: [X]%

### 🔧 DevOps: [찬성/반대/조건부]
- **입장**: [한 줄 요약]
- **근거**:
  1. [운영 근거 1]
  2. [운영 근거 2]
  3. [운영 근거 3]
- **Confidence**: [X]%

### 🛡️ Security: [찬성/반대/조건부]
- **입장**: [한 줄 요약]
- **근거**:
  1. [보안 근거 1]
  2. [보안 근거 2]
  3. [보안 근거 3]
- **Confidence**: [X]%

### 📊 PM: [찬성/반대/조건부]
- **입장**: [한 줄 요약]
- **근거**:
  1. [일정/리소스 근거 1]
  2. [일정/리소스 근거 2]
  3. [일정/리소스 근거 3]
- **Confidence**: [X]%

**초안 분포**: 찬성 [X]명, 반대 [Y]명, 조건부 [Z]명
```

---

### Round 2: Challenges & Questions (250-350 tokens, 180초)

**⚠️ 필수 실행 - Bias Detection + Collaborative Reasoning:**

**STEP 1: Bias Detection (각 Persona 의견 편향 검사)**

```javascript
// ⚠️ Claude 주의: 이 코드는 "반드시" 실행해야 합니다
mcp__model-enhancement-servers__enhance_reasoning({
  module: "bias-detection",
  task: "Agent Council Round 1 의견 편향 검사 - Architect (optimism bias, anchoring), CFO (loss aversion, status quo), DevOps (availability bias), Security (worst-case thinking), PM (planning fallacy, optimism). 각 페르소나별 편향 검출 및 완화 제안."
})
```

**STEP 2: Collaborative Reasoning (반박 및 질문 생성)**

```javascript
// ⚠️ Claude 주의: 이 코드는 "반드시" 실행해야 합니다
mcp__clear-thought-1_5__clear_thought({
  operation: "collaborative_reasoning",
  prompt: "[USER_DECISION_TOPIC] - Round 2: 페르소나 간 반박 및 질문. 특히 찬성 vs 반대 페르소나 간 논쟁, bias detection 결과 반영",
  parameters: {
    topic: "[USER_DECISION_TOPIC]",
    personas: [...],
    contributions: [...Round 1 results...],
    stage: "critique",
    iteration: 2
  }
})
```

**STEP 3: 반박 및 질문 정리**

각 페르소나는 다른 페르소나에게 최소 1개 이상 반박 또는 질문을 제기합니다.

**반박 패턴**:
- Architect → CFO: "비용만 고려하면 기술 부채 누적"
- CFO → Architect: "장기 유지보수 비용이 초기 투자 정당화하는가?"
- DevOps → Security: "과도한 보안 요구사항이 운영 복잡도 증가"
- Security → DevOps: "운영 편의성이 보안 취약점 초래 우려"
- PM → All: "일정/리소스 제약 고려했는가?"

**Output Format:**
```markdown
## Round 2: 반박 & 질문

### Bias Detection 결과
- **Architect**: [optimism bias 검출] - 새 기술 과신 우려, 보수적 시나리오 추가 필요
- **CFO**: [status quo bias 검출] - 현 상태 유지 편향, 변화 이점 재평가 필요
- **DevOps**: [availability bias 검출] - 최근 장애 경험 과다 반영, 객관적 데이터 필요
- **Security**: [worst-case thinking 검출] - 최악 시나리오만 강조, 현실적 리스크 평가 필요
- **PM**: [planning fallacy 검출] - 일정 낙관, 버퍼 추가 고려

### 페르소나 간 논쟁

**Architect → CFO**:
- **질문**: "초기 비용 절감이 장기 기술 부채 비용을 초과할 수 있지 않나?"
- **CFO 응답**: "기술 부채 비용을 정량화하면 [X]% 증가 예상, 여전히 ROI 긍정적"

**CFO → Architect**:
- **반박**: "Architect의 확장성 근거가 현재 트래픽 10배 가정인데, 5년 내 달성 확률 30% 미만"
- **Architect 응답**: "트래픽 증가율 보수 추정해도 3년 내 5배 도달 가능, 재설계 비용 > 초기 투자"

**DevOps → Security**:
- **질문**: "Security 요구사항 중 [X] 항목이 배포 시간 2배 증가시키는데, 완화 방안은?"
- **Security 응답**: "배포 파이프라인 자동화로 30% 시간 절감 가능, 보안 타협 불가"

**Security → DevOps**:
- **반박**: "DevOps 단순화 제안이 [Y] 취약점 노출, Compliance 위반 리스크"
- **DevOps 응답**: "해당 취약점은 [Z] 방법으로 완화 가능, 운영 복잡도 유지"

**PM → All**:
- **경고**: "현재 팀 리소스 [X]명, 각 관점 요구사항 모두 충족 시 일정 [Y]개월 초과"
- **All 응답**: "우선순위 재조정 - 필수 [3개], 선택 [2개]로 분류"

**수정된 입장**:
- Architect: 찬성 → 조건부 찬성 (기술 부채 모니터링 조건)
- CFO: 반대 → 조건부 찬성 (ROI 75% 달성 시)
- DevOps: 조건부 찬성 → 찬성 (자동화로 복잡도 완화)
- Security: 반대 → 조건부 찬성 (필수 보안 요구사항 3개 충족 시)
- PM: 조건부 찬성 유지 (일정 +2개월 버퍼)
```

---

### Round 3: Weighted Consensus (200-300 tokens, 120초)

**⚠️ 필수 실행 - Stochastic Weighting + Collaborative Reasoning:**

**STEP 1: Bayesian Weighting (합의 가중치 계산)**

```javascript
// ⚠️ Claude 주의: 이 코드는 "반드시" 실행해야 합니다
mcp__stochastic-thinking__stochastic_analysis({
  system: "Agent Council 합의 계산 - 5개 페르소나 의견을 Confidence 기반 Bayesian 가중치로 통합. Prior: 각 페르소나 Confidence %, Likelihood: Round 2 반박 승률, Posterior: 최종 가중 합의",
  parameters: { iterations: 5000 }
})
```

**STEP 2: Final Consensus (최종 합의 도출)**

```javascript
// ⚠️ Claude 주의: 이 코드는 "반드시" 실행해야 합니다
mcp__clear-thought-1_5__clear_thought({
  operation: "collaborative_reasoning",
  prompt: "[USER_DECISION_TOPIC] - Round 3: 최종 합의. Bias 제거, 반박 반영, Bayesian 가중치 통합. 합의 수준 (Strong/Moderate/Weak) 명시",
  parameters: {
    topic: "[USER_DECISION_TOPIC]",
    personas: [...],
    contributions: [...Round 1 + Round 2 results...],
    stage: "decision",
    iteration: 3
  }
})
```

**STEP 3: 합의 계산 및 최종 결론**

**Weighted Consensus Calculation:**
```
Consensus Score = Σ (Persona_Weight × Persona_Position)

Where:
- Persona_Weight = (Confidence × Expertise_Relevance) / Σ All_Weights
- Persona_Position = +1 (찬성), 0 (조건부), -1 (반대)
- Expertise_Relevance: 의사결정과 각 페르소나 전문성 관련도 (0-1)

Example:
- Architect: 85% Confidence × 1.0 Relevance × +1 Position = +0.85
- CFO: 90% Confidence × 0.8 Relevance × 0 Position (조건부) = 0
- DevOps: 75% Confidence × 0.9 Relevance × +1 Position = +0.675
- Security: 80% Confidence × 0.7 Relevance × 0 Position (조건부) = 0
- PM: 70% Confidence × 0.6 Relevance × +1 Position = +0.42

Total Weight = 0.85 + 0 + 0.675 + 0 + 0.42 = 1.945
Normalized: 1.945 / 5 = 0.389 (약한 찬성)
```

**Consensus Levels:**
- **Strong Consensus** (0.7-1.0): 대부분 찬성, 조건 충족 가능
- **Moderate Consensus** (0.4-0.7): 조건부 찬성 다수, 조건 충족 필수
- **Weak Consensus** (0.1-0.4): 찬성/반대 팽팽, 추가 분석 필요
- **No Consensus** (-0.1-0.1): 의견 분열, 의사결정 보류 권장
- **Strong Opposition** (-1.0 to -0.1): 반대 다수, 대안 검토 필요

**Output Format:**
```markdown
## Round 3: 최종 합의

### Bayesian 가중치 계산

| Persona | Confidence | Relevance | Position | Weighted Score |
|---------|-----------|-----------|----------|----------------|
| Architect | [X]% | [Y] | [+1/0/-1] | [Z] |
| CFO | [X]% | [Y] | [+1/0/-1] | [Z] |
| DevOps | [X]% | [Y] | [+1/0/-1] | [Z] |
| Security | [X]% | [Y] | [+1/0/-1] | [Z] |
| PM | [X]% | [Y] | [+1/0/-1] | [Z] |
| **Total** | - | - | - | **[Consensus Score]** |

**합의 수준**: [Strong/Moderate/Weak/No/Strong Opposition] Consensus ([Score])

### 최종 결론

**추천**: [찬성/반대/조건부 찬성/보류]

**핵심 조건** (조건부 찬성 시):
1. [CFO 조건]: ROI 75% 이상 달성 (3년 내)
2. [Security 조건]: 필수 보안 요구사항 3개 충족 (Compliance)
3. [PM 조건]: 일정 +2개월 버퍼 확보 (리소스 12명 → 15명)

**합의된 근거**:
- ✅ **Architect**: 기술적 실현 가능, 기술 부채 모니터링 조건 합의
- ⚠️ **CFO**: ROI 조건부 찬성 (75% 달성 시), 비용 리스크 관리
- ✅ **DevOps**: 자동화로 운영 복잡도 완화, 찬성 전환
- ⚠️ **Security**: 필수 보안 요구사항 충족 시 찬성, 타협 불가 3개 항목 명시
- ⚠️ **PM**: 일정 버퍼 필수, 리소스 증원 조건

**합의 강도**: [X]% (5 personas 중 [Y]명 찬성/조건부 찬성)

**Risk Mitigation**:
- High Risk: [Security 우려사항] → [완화 방안]
- Medium Risk: [CFO ROI 불확실성] → [중간 검증 마일스톤]
- Low Risk: [DevOps 복잡도] → [자동화 계획]

**Next Steps**:
1. [조건 1 검증]: [담당자], [기한]
2. [조건 2 충족]: [담당자], [기한]
3. [조건 3 확보]: [담당자], [기한]
4. 조건 충족 후 재검토 회의 (예상: [날짜])
```

---

### Final Step: Serena Memory 저장 (Optional - 10초)

```javascript
// ⚠️ Claude 주의: Serena MCP 사용 가능하고 프로젝트 활성화 시 저장
try {
  const config = mcp__serena-memory__get_current_config()
  const hasActiveProject = config && config.includes("Active project:")

  if (hasActiveProject) {
    mcp__serena-memory__write_memory({
      key: `agent_council_[topic_summary]_[YYYY-MM-DD]`,
      value: JSON.stringify({
        topic: "[USER_DECISION_TOPIC]",
        personas: ["Architect", "CFO", "DevOps", "Security", "PM"],
        rounds: [
          { round: 1, opinions: [...] },
          { round: 2, challenges: [...] },
          { round: 3, consensus: [...] }
        ],
        consensus_score: "[X]",
        consensus_level: "[Strong/Moderate/Weak/No/Opposition]",
        recommendation: "[찬성/반대/조건부]",
        conditions: ["조건1", "조건2", "조건3"],
        confidence: "[X]%",
        timestamp: new Date().toISOString()
      })
    })
    console.log("✅ Agent Council 결과 저장 완료")
  } else {
    console.log("⚠️ Serena 프로젝트 미활성화 - 저장 생략")
  }
} catch (e) {
  console.log("⚠️ Serena MCP 미사용 - 저장 생략")
}
```

**Final Output:**
```markdown
---

✅ **Agent Council 완료** (800-1200 tokens, v1.0.0)

**합의 수준**: [Strong/Moderate/Weak] Consensus ([Score])
**추천**: [찬성/반대/조건부 찬성]
**핵심 조건**: [3-5개 조건 요약]
**합의 강도**: [X]% (5 personas)
**Next Steps**: [3-5개 액션 아이템]
```

---

## Token Budget Enforcement

### Target: 800-1200 tokens

```
Step 0 (Context): 50-80 tokens
Round 1 (Opinions): 200-300 tokens (5 personas × 40-60)
Round 2 (Challenges): 250-350 tokens (편향 검사 + 반박)
Round 3 (Consensus): 200-300 tokens (가중치 + 합의)
Final (Synthesis): 100-150 tokens

Total: 800-1200 tokens
```

**WARNING if exceeds 1200 tokens:**
```markdown
⚠️ Agent Council 토큰 초과 (actual: [X] tokens)
- 다음에는 각 페르소나 의견 간결화 필요
- Round 2 반박 수 제한 고려 (각 페르소나 최대 1-2개)
```

---

## Success Criteria Validation

**Before outputting completion message, verify:**

- [ ] **5 Persona 모두 의견**: Architect, CFO, DevOps, Security, PM 모두 Round 1 참여
- [ ] **최소 2-Round 토론**: Round 2 반박/질문 최소 3개 이상
- [ ] **Bias Detection 실행**: model-enhancement-servers bias-detection 호출 확인
- [ ] **Weighted Consensus**: Bayesian 가중치 계산 완료
- [ ] **Consensus Level 명시**: Strong/Moderate/Weak/No/Opposition 중 하나 명시
- [ ] **Token <= 1200**: 예산 준수
- [ ] **조건 명시**: 조건부 찬성 시 핵심 조건 3개+ 명시
- [ ] **Next Steps**: 액션 아이템 3개+ 명시

**If ANY checkbox fails:**
```markdown
❌ **Agent Council 실패** - 다음 항목 미충족:
- [ ] [failed item 1]
- [ ] [failed item 2]

→ 재실행 중...
```

---

## Error Handling

### MCP Dependency Unavailable

```
IF mcp__clear-thought-1_5__clear_thought NOT available:
  - FALLBACK to mcp__clear-thought__collaborativereasoning
  - Add warning: "⚠️ clear-thought-1.5 미사용 - clear-thought로 대체"

IF mcp__model-enhancement-servers__enhance_reasoning NOT available:
  - SKIP Bias Detection (Round 2)
  - Add warning: "⚠️ Bias Detection 미사용 - 수동 편향 체크"

IF mcp__stochastic-thinking__stochastic_analysis NOT available:
  - Use simple average weighting instead
  - Add warning: "⚠️ Stochastic Weighting 미사용 - 단순 평균"

IF mcp__serena-memory__* NOT available:
  - SKIP save step
  - NO warning needed (Serena is optional)
```

---

## Parallel Usage with Multidimensional Analysis

### Case 1: 병렬 실행 (권장)

```
Scenario: 고위험 아키텤처 의사결정 (예: MSA 전환)

Step 1: 동시 실행
- Task("기술 분석", { subagent_type: "general-purpose", prompt: "multidimensional-analysis Level 4로 MSA 전환 기술 분석" })
- Task("이해관계자 합의", { subagent_type: "general-purpose", prompt: "agent-council로 MSA 전환 이해관계자 합의 시뮬레이션" })

Step 2: 결과 통합
- Multidimensional Analysis: 기술적 신뢰도 97-99% (Level 4)
- Agent Council: 합의 수준 Moderate Consensus (0.55)
- 최종 판단: 기술적으로 타당 + 조건부 합의 → 조건 충족 후 진행
```

### Case 2: 순차 실행

```
Scenario A: 기술 분석 → 이해관계자 설득
1. multidimensional-analysis Level 5 → 99.7% 신뢰도 기술 분석
2. agent-council → 기술 분석 결과 기반 이해관계자 설득 시뮬레이션
3. 설득 실패 시 → 조건 재조정 → Round 2 재실행

Scenario B: 이해관계자 합의 → 기술 검증
1. agent-council → 이해관계자 우선순위 파악
2. multidimensional-analysis → 우선순위 반영한 기술 옵션 분석
3. 기술 검증 실패 시 → 우선순위 재조정 → agent-council Round 2
```

---

## Final Checklist (Internal Quality Control)

**Before completing Agent Council workflow, Claude MUST verify:**

1. **5 Personas Defined**: All personas (Architect/CFO/DevOps/Security/PM) with expertise/biases
2. **Round 1 Complete**: All 5 personas provided initial opinions with confidence scores
3. **Round 2 Complete**: Minimum 3 challenges/questions between personas
4. **Bias Detection**: MCP bias-detection executed and results integrated
5. **Round 3 Complete**: Weighted consensus calculated (Bayesian or simple average)
6. **Consensus Level**: Strong/Moderate/Weak/No/Opposition explicitly stated
7. **Conditions Listed**: If conditional approval, 3+ conditions with owners/deadlines
8. **Token Budget Met**: Total <= 1200 tokens
9. **Next Steps**: 3+ action items with owners/deadlines

**If all 9 items pass**: Output completion message
**If any item fails**: Fix and re-execute failed step

---

**End of Execution Instructions**

**Version**: 1.0.0
**Last Updated**: 2026-01-25

---

## 변경 이력

**v1.0.0 (2026-01-25)**: Initial Release
- 5-Persona Expert Panel (Architect/CFO/DevOps/Security/PM)
- 3-Round Discussion (Opinion → Challenge → Consensus)
- MCP Integration: collaborative_reasoning, bias-detection, stochastic weighting
- Weighted Consensus Calculation (Bayesian)
- Parallel usage with multidimensional-analysis

**Required MCPs**: clear-thought-1.5, clear-thought, model-enhancement-servers, stochastic-thinking, serena-memory (optional)
**Compatibility**: agent-council skill.md v1.0.0

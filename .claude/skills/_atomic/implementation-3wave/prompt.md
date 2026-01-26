# implementation-3wave Atomic Skill

**Version**: 1.0.0
**Type**: Atomic (독립 실행 가능)
**Purpose**: 3-Wave 병렬 구현 워크플로우 - 고품질 코드 생성 엔진

## Overview

implementation-workflow의 핵심 3-Wave 패턴을 독립 Atomic으로 추출.
Composite Skills (dev-workflow, prd-auto-executor)에서 dependencies로 재사용.

## MCP Dependencies

| Service | Operations | Purpose |
|---------|------------|---------|
| sequential-thinking-tools | sequential_thinking | 단계별 구현 계획 |
| stochastic-thinking | stochastic_analysis | 성공 확률 분석 |
| serena-memory | write_memory, read_memory | Baseline 저장/로드 |

## Usage Pattern

### Standalone (Atomic)
```
/implementation-3wave "사용자 인증 기능 구현"
```

### As Dependency (Composite)
```yaml
# In composite skill's skill.md
dependencies:
  - implementation-3wave
```

## 3-Wave Workflow

### Wave 1: 병렬 분석 (4 Tasks)

#### Task A: Sequential Planning
```javascript
mcp__sequential-thinking-tools__sequential_thinking({
  problem: `${feature_description} 구현 계획`,
  steps: [
    "현재 상태 분석",
    "의존성 파악",
    "구현 전략 수립",
    "테스트 계획"
  ]
})
```

#### Task B: Systems Analysis
```javascript
// 시스템 의존성 분석
const dependencies = analyzeSystemDependencies(feature_description);
const impact_chain = traceCausalChain(dependencies);
```

#### Task C: Risk Assessment
```javascript
mcp__stochastic-thinking__stochastic_analysis({
  system: `${feature_description} 구현`,
  parameters: {
    scenarios: 5,
    iterations: 1000
  }
})
// Output: 성공 확률, 위험 분포
```

#### Task D: Validation Check
```javascript
// 편향 검사 + 유사 사례 참조
const similar_implementations = findAnalogousCases(feature_description);
const potential_biases = detectImplementationBiases(approach);
```

### Wave 2: 통합 논증

```javascript
// Dialectical Synthesis
const thesis = w1_results.task_a;      // 현재 계획
const antithesis = w1_results.task_d;  // 반대 관점
const synthesis = dialecticalMerge(thesis, antithesis);

// Decision Framework
const final_plan = applyDecisionFramework(synthesis, {
  criteria: ["feasibility", "maintainability", "performance"],
  constraints: user_constraints
});
```

### Wave 3: 메타인지 + Baseline

```javascript
// Quality Validation
const quality_score = validateImplementationQuality(final_plan);

// Baseline Storage
mcp__serena-memory__write_memory({
  memory_name: `impl_baseline_${feature_id}`,
  content: JSON.stringify({
    feature: feature_description,
    plan: final_plan,
    quality_score: quality_score,
    timestamp: new Date().toISOString()
  })
})
```

## Conditional Execution

| Session | Condition | Action |
|---------|-----------|--------|
| S1 (First) | No baseline | Full W1-W2-W3 |
| S2+ | Baseline exists, Coverage ≥70% | Load baseline, Skip W1 |
| S2+ | Baseline exists, Coverage <70% | Incremental W1 only |

## Output Format

```json
{
  "implementation_plan": {
    "phases": [
      { "name": "Setup", "tasks": [], "duration": "1h" },
      { "name": "Core Logic", "tasks": [], "duration": "3h" },
      { "name": "Integration", "tasks": [], "duration": "1h" },
      { "name": "Testing", "tasks": [], "duration": "2h" }
    ],
    "total_duration": "7h"
  },
  "tasks": [
    { "id": 1, "name": "Create auth module", "priority": "P0" }
  ],
  "risk_assessment": {
    "success_probability": 0.85,
    "risks": [
      { "risk": "API compatibility", "probability": 0.2, "mitigation": "..." }
    ]
  },
  "baseline": {
    "stored": true,
    "memory_name": "impl_baseline_auth_20260101"
  }
}
```

## Token Estimate

| Session | Tokens | Time |
|---------|--------|------|
| S1 (First run) | 600-800 | 15-25m |
| S2+ (With baseline) | 150-200 | 3-5m |
| Incremental | 300-400 | 8-12m |

## Success Criteria

- [ ] W1: 4 Task 병렬 완료 + 텍스트 출력
- [ ] W2: 변증법 + Decision 완료
- [ ] W3: 메타인지 + Baseline 저장
- [ ] Token: S1 < 800 | S2+ < 200

---

**Created**: 2026-01-01
**Extracted From**: implementation-workflow v2.1.0

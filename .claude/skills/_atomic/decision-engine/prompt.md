# decision-engine Atomic Skill

**Version**: 1.0.0
**Type**: Atomic (독립 실행 가능)
**Purpose**: 4-Step 빠른 의사결정 + bias-detection - Quick Mode 핵심 추출

## Overview

decision-workflow Quick Mode의 핵심 로직을 독립 Atomic으로 추출.
Composite Skills (decision-workflow, multidimensional)에서 dependencies로 재사용.

## MCP Dependencies

| Service | Operations | Purpose |
|---------|------------|---------|
| stochastic-thinking | stochastic_analysis | MDP/Bayesian/Bandit 확률 분석 |
| model-enhancement-servers | enhance_reasoning | bias-detection 인지 편향 감지 |
| clear-thought-1.5 | decision_framework | 다기준 의사결정 프레임워크 |

## Usage Pattern

### Standalone (Atomic)
```
/decision-engine "A vs B 선택" --options="[A, B]"
```

### As Dependency (Composite)
```yaml
# In composite skill's skill.md
dependencies:
  - decision-engine
```

## 4-Step Workflow

### Step 1: Problem Framing
```javascript
// 의사결정 문제 구조화
const framing = {
  query: user_query,
  options: extractOptions(user_query),
  constraints: extractConstraints(user_query),
  criteria: inferCriteria(context)
};
```

### Step 2: Bias Detection
```javascript
mcp__model-enhancement-servers__enhance_reasoning({
  task: query,
  module: "bias-detection"
})
// Output: 4 biases (Confirmation, Availability, Dunning-Kruger, Sunk Cost)
// Confidence 교정: 85% → 70% (불확실성 인정)
```

### Step 3: Probabilistic Analysis
```javascript
mcp__stochastic-thinking__stochastic_analysis({
  system: query,
  parameters: {
    scenarios: options.length,
    iterations: 1000  // Quick mode
  }
})
// Output: Expected utility per option, risk distribution
```

### Step 4: Decision Framework
```javascript
mcp__clear-thought-1_5__clear_thought({
  operation: "decision_framework",
  prompt: query,
  parameters: {
    options: options,
    criteria: criteria,
    weights: inferred_weights
  }
})
// Output: Ranked options with rationale
```

## Output Format

```json
{
  "decision": {
    "recommended": "Option A",
    "confidence": 0.72,
    "rationale": "Based on multi-criteria analysis..."
  },
  "alternatives": [
    { "option": "B", "score": 0.68, "tradeoffs": [] }
  ],
  "risks": [
    { "risk": "Implementation complexity", "probability": 0.3, "impact": "Medium" }
  ],
  "biases": [
    { "type": "Confirmation Bias", "detected": true, "mitigation": "..." }
  ],
  "meta": {
    "original_confidence": 0.85,
    "adjusted_confidence": 0.72,
    "adjustment_reason": "Bias detection correction"
  }
}
```

## Token Estimate

| Mode | Tokens | Time |
|------|--------|------|
| Quick (Step 1-3) | 150-250 | 3-5m |
| Standard (Step 1-4) | 250-350 | 5-10m |
| Full (+ Deep validation) | 350-450 | 10-15m |

## Key Features

### Bias Detection (Phase 2 영구 통합)
- 4가지 인지 편향 감지: Confirmation, Availability, Dunning-Kruger, Sunk Cost
- Confidence 자동 교정 (과신 방지)
- 검증: Phase 2 TC1-6 all passed (가치 4.0/5)

### Stochastic Analysis
- MDP: 순차적 의사결정 최적화
- Bayesian: 사전 확률 → 사후 확률 업데이트
- Bandit: 탐색-활용 균형

### Decision Framework
- 다기준 의사결정 (MCDM)
- 가중치 자동 추론
- 민감도 분석

---

**Created**: 2026-01-01
**Extracted From**: decision-workflow v2.9.0 Quick Mode
**Phase 2 Status**: bias-detection 영구 통합 (2025-12-29)

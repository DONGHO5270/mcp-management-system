# core-analysis Atomic Skill

**Version**: 1.0.0
**Type**: Atomic (독립 실행 가능)
**Purpose**: 5-Task 병렬 분석 패턴 - multidimensional W1 핵심 추출

## Overview

multidimensional-analysis의 W1 (5-Dimensional Parallel) 핵심 로직을 독립 Atomic으로 추출.
Composite Skills (multidimensional, research-workflow)에서 dependencies로 재사용.

## MCP Dependencies

| Service | Operations | Purpose |
|---------|------------|---------|
| clear-thought-1.5 | clear_thought | 통합 reasoning 엔진 |
| clear-thought | mentalmodel, sequentialthinking | Mental models + Sequential thinking |
| sequential-thinking-tools | sequential_thinking | Step-by-step problem solving |

## Usage Pattern

### Standalone (Atomic)
```
/core-analysis "프로젝트 아키텍처 분석"
```

### As Dependency (Composite)
```yaml
# In composite skill's skill.md
dependencies:
  - core-analysis
```

## Workflow

### Task A: Sequential + First Principles
```javascript
mcp__sequential-thinking-tools__sequential_thinking({
  problem: query,
  steps: ["decompose", "analyze", "synthesize"]
})

mcp__clear-thought__mentalmodel({
  modelName: "first_principles",
  problem: query,
  steps: ["identify assumptions", "break down", "rebuild"]
})
```

### Task B: Systems Thinking
```javascript
mcp__clear-thought-1_5__clear_thought({
  operation: "systems_thinking",
  prompt: query,
  parameters: { depth: "comprehensive" }
})
```

### Task C: Pattern Analysis
```javascript
mcp__clear-thought__mentalmodel({
  modelName: "opportunity_cost",
  problem: query
})

mcp__clear-thought__mentalmodel({
  modelName: "error_propagation",
  problem: query
})
```

### Task D: Cross-Validation
```javascript
mcp__clear-thought-1_5__clear_thought({
  operation: "metacognitive_monitoring",
  prompt: `Validate analysis: ${query}`
})
```

### Task E: Synthesis
```javascript
mcp__clear-thought-1_5__clear_thought({
  operation: "decision_framework",
  prompt: `Synthesize findings for: ${query}`
})
```

## Output Format

```json
{
  "analysis": {
    "task_a": { "insights": [], "confidence": 0.0 },
    "task_b": { "insights": [], "confidence": 0.0 },
    "task_c": { "insights": [], "confidence": 0.0 },
    "task_d": { "insights": [], "confidence": 0.0 },
    "task_e": { "insights": [], "confidence": 0.0 }
  },
  "synthesis": {
    "key_findings": [],
    "recommendations": [],
    "confidence": 0.0
  }
}
```

## Token Estimate

| Mode | Tokens | Time |
|------|--------|------|
| Quick (TA+TB only) | 400-600 | 5-10m |
| Standard (TA-TD) | 800-1200 | 15-20m |
| Full (TA-TE) | 1200-1800 | 25-35m |

---

**Created**: 2026-01-01
**Extracted From**: multidimensional-analysis v3.4.0 W1

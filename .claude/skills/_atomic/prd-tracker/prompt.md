# prd-tracker Atomic Skill

**Version**: 1.0.0
**Type**: Atomic (독립 실행 가능)
**Purpose**: PRD 파싱 + TodoWrite 통합 - 계층적 작업 추출 및 상태 관리

## Overview

prd-implementation-tracker에서 추출한 핵심 기능:
- 3-Document Integration (PRD + UI/UX + Functional Spec)
- 3-Level Hierarchical Tasks (Feature → Specification → Component)
- TodoWrite 통합 및 Serena Memory 저장

## MCP Dependencies

| Service | Operations | Purpose |
|---------|------------|---------|
| serena-memory | write_memory, read_memory, list_memories | 작업 상태 저장/조회 |

## Usage Pattern

### Standalone (Atomic)
```
/prd-tracker "PRD.md 파일에서 작업 목록 추출"
```

### As Dependency (Composite)
```yaml
# In composite skill's skill.md
dependencies:
  - _atomic/prd-tracker
```

## Core Operations

### 1. PRD Parsing
```javascript
function parsePRD(prdContent) {
  return {
    features: extractFeatures(prdContent),
    specifications: extractSpecs(prdContent),
    components: extractComponents(prdContent)
  };
}
```

### 2. Hierarchical Task Extraction
```javascript
function extractTasks(prd, uiux, spec) {
  return {
    level1: prd.features,           // Feature level
    level2: uiux?.specifications,   // Specification level
    level3: spec?.components        // Component level
  };
}
```

### 3. State Persistence
```javascript
async function saveState(tasks, sessionId) {
  return await mcp__serena-memory__write_memory({
    memory_name: `prd_state_${sessionId}`,
    content: JSON.stringify({
      tasks: tasks,
      timestamp: new Date().toISOString(),
      progress: calculateProgress(tasks)
    })
  });
}
```

## Output Format

```json
{
  "tasks": [
    {
      "id": "F1",
      "level": 1,
      "name": "User Authentication",
      "status": "pending",
      "children": ["S1.1", "S1.2"]
    }
  ],
  "hierarchy": {
    "total": 15,
    "level1": 3,
    "level2": 6,
    "level3": 6
  },
  "metadata": {
    "source": "PRD.md",
    "extracted_at": "2026-01-01T10:00:00Z"
  },
  "state": {
    "completed": 5,
    "in_progress": 2,
    "pending": 8,
    "progress_percent": 33
  }
}
```

## Token Estimate

| Operation | Tokens | Time |
|-----------|--------|------|
| PRD Parse | 100-200 | 5-10s |
| Task Extract | 150-300 | 10-15s |
| State Save | 50-100 | <5s |
| **Total** | **300-600** | **20-30s** |

## Dependent Skills

This Atomic is used by:
- prd-implementation-tracker (primary)
- prd-auto-executor (via prd-implementation-tracker)

---

**Created**: 2026-01-01
**Extracted From**: prd-implementation-tracker v2.0.0

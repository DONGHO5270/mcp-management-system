---
name: session-memory
version: 1.0.0
description: Serena Memory 래퍼 - 세션 상태 및 프로젝트 기억 관리
type: atomic
mcp_dependencies:
  serena-memory: "^1.0.0"
operations:
  - write_memory (state persistence)
  - read_memory (state retrieval)
  - list_memories (discovery)
  - delete_memory (cleanup)
outputs:
  schema: json
  format: "{ success, memory_name, content }"
inputs:
  required: ["operation"]
  optional: ["memory_name", "content", "filter"]
fallback:
  enabled: true
  primary: serena-memory
  secondary: file-system (.claude/cache/)
  tertiary: context (in-memory)
---

# session-memory Atomic Skill

**Version**: 1.0.0
**Type**: Atomic (독립 실행 가능)
**Purpose**: Serena Memory 래퍼 - 세션 상태 및 프로젝트 기억 관리 + SPOF Fallback

## Overview

serena-memory MCP의 래퍼로, 세션 상태 관리와 SPOF 대응 Fallback을 제공.
7/11 Skills가 serena-memory에 의존하므로, 이 Atomic Skill로 중앙화.

## MCP Dependencies

| Service | Operations | Purpose |
|---------|------------|---------|
| serena-memory | write_memory, read_memory, list_memories, delete_memory | 프로젝트 기억 저장/조회 |

## SPOF Mitigation

serena-memory 장애 시 자동 Fallback:

```
┌─────────────────┐
│ session-memory  │
└────────┬────────┘
         │
    ┌────▼────┐
    │ Primary │ serena-memory (Docker)
    └────┬────┘
         │ (fail)
    ┌────▼────┐
    │Secondary│ .claude/cache/ (file-system)
    └────┬────┘
         │ (fail)
    ┌────▼────┐
    │Tertiary │ In-memory (session-only)
    └─────────┘
```

## Usage Pattern

### Standalone (Atomic)
```
/session-memory write "baseline_auth" "{...}"
/session-memory read "baseline_auth"
/session-memory list
```

### As Dependency (Composite)
```yaml
# In composite skill's skill.md
dependencies:
  - session-memory
```

## Operations

### Write Memory
```javascript
async function writeMemory(name, content) {
  try {
    // Primary: serena-memory
    return await mcp__serena-memory__write_memory({
      memory_name: name,
      content: content
    });
  } catch (error) {
    // Fallback: file-system
    return await writeToFileSystem(name, content);
  }
}
```

### Read Memory
```javascript
async function readMemory(name) {
  try {
    // Primary: serena-memory
    return await mcp__serena-memory__read_memory({
      memory_file_name: name
    });
  } catch (error) {
    // Fallback: file-system
    return await readFromFileSystem(name);
  }
}
```

### List Memories
```javascript
async function listMemories(filter) {
  try {
    const memories = await mcp__serena-memory__list_memories();
    return filter ? memories.filter(m => m.includes(filter)) : memories;
  } catch (error) {
    return await listFromFileSystem(filter);
  }
}
```

### Delete Memory
```javascript
async function deleteMemory(name) {
  try {
    return await mcp__serena-memory__delete_memory({
      memory_file_name: name
    });
  } catch (error) {
    return await deleteFromFileSystem(name);
  }
}
```

## Fallback Paths

| Level | Storage | Location | Persistence |
|-------|---------|----------|-------------|
| Primary | serena-memory | `.serena/memories/` | Cross-session |
| Secondary | file-system | `.claude/cache/` | Cross-session |
| Tertiary | in-memory | Context | Session-only |

## Output Format

```json
{
  "success": true,
  "operation": "write",
  "memory_name": "baseline_auth_20260101",
  "storage": "primary",  // or "secondary", "tertiary"
  "content": "...",
  "fallback_used": false,
  "timestamp": "2026-01-01T10:00:00.000Z"
}
```

## Token Estimate

| Operation | Tokens | Time |
|-----------|--------|------|
| Write | 50-100 | <1s |
| Read | 50-150 | <1s |
| List | 30-50 | <1s |
| Delete | 20-30 | <1s |

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Baseline | `baseline_{feature}_{date}` | `baseline_auth_20260101` |
| Session | `session_{id}_{timestamp}` | `session_abc123_1704067200` |
| Analysis | `analysis_{topic}_{date}` | `analysis_architecture_20260101` |
| Report | `report_{type}_{date}` | `report_prd_execution_20260101` |

## Dependent Skills (7/11)

This Atomic is used by:
- multidimensional-analysis
- decision-workflow
- implementation-workflow
- prd-auto-executor
- prd-implementation-tracker
- session-continuity
- deployment-checklist

---

**Created**: 2026-01-01
**SPOF Status**: Fallback 구현으로 85% → 15% 연쇄 실패 확률 감소

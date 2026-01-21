---
name: prd-implementation-tracker
version: 3.0.0
type: composite
description: Automatically tracks PRD implementation progress by extracting hierarchical tasks from PRD, UI/UX guides, and functional specifications, creating enhanced TodoWrite checklists with metadata, and monitoring completion status across sessions using Serena Memory. Use when starting development from a PRD, UI/UX guide, or spec document.
dependencies:
  - _atomic/prd-tracker
  - _atomic/session-memory
auto_load: true
subagent_compatible: true
permission_mode: "interactive"
tags:
  - prd
  - tracking
  - todowrite
  - serena-memory
  - sdd
  - hierarchical-tasks
mcp_dependencies: {}
compatible_templates:
  - v5.5.8
triggers:
  - prd implementation
  - track prd
capabilities:
  - hierarchical_task_extraction
  - todowrite_integration
  - serena_memory_persistence
  - json_checklist_generation
  - task_priority_classification
  - implement prd
  - feature tracking
  - requirements implementation
  - specification tracking
---

# PRD Implementation Tracker (3-Document Integration)

Systematically implement features from PRDs by generating hierarchical task checklists and tracking progress across sessions.

## Overview

**v2.0 Features**:
- 3-Document Integration: PRD + UI/UX Guide + Functional Spec
- 3-Level Hierarchical Tasks: Feature → Specification → Component
- Enhanced Metadata: File paths, API endpoints, UI components
- SDD Integration: Verification criteria and feedback loops

## Quick Start

| Method | Documents | Task Level | Time | Recommended |
|--------|-----------|------------|------|-------------|
| **1** | PRD only | 1-Level | 5min | ⭐ Most cases |
| 2 | PRD + UI/UX | 2-Level | 10min | Design-focused |
| 3 | PRD + UI/UX + Spec | 3-Level | 15-20min | Large projects |

### Method 1: PRD Only (Recommended)
```
"PRD.md 파일을 읽어서 구현 작업 목록을 만들어줘"
```

### Method 2: PRD + UI/UX
```
"PRD.md와 UIUX_GUIDE.md를 읽고 구현 작업 목록을 만들어줘"
```

### Method 3: Full Stack
```
"PRD.md, UIUX_GUIDE.md, FUNCTIONAL_SPEC.md를 읽고 구현 작업 목록을 만들어줘"
```

## Decision Tree

```
PRD exists? → No: Create with 13_REQUIREMENTS_TO_PRD_LEAN.md
           → Yes: UI/UX exists? → No: Method 1 ⭐
                               → Yes: Spec exists? → No: Method 2
                                                   → Yes: Method 3
```

## Key Steps

1. **Read Documents**: Load PRD (required) + UI/UX + Spec (optional)
2. **Extract Tasks**: 3-Level hierarchical extraction with metadata
3. **Create TodoWrite**: Enhanced checklist with verification criteria
4. **Save to Memory**: Serena Memory for session continuity
5. **Track Progress**: Real-time updates with verification flow

---

**Detailed execution guide**: See `prompt.md`

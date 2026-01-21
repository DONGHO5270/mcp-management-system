# PRD Implementation Tracker

**Version**: 2.1.0 (Optimized)
**Purpose**: Convert PRD + UI/UX Guide + Functional Spec into hierarchical TodoWrite checklist with verification metadata

---

## Overview

**Input**: PRD.md (required) + UI/UX Guide (optional) + Functional Spec (optional)
**Output**: TodoWrite checklist + Serena Memory + prd_checklist.json + Document map

**Capabilities**:
- 3-Level Hierarchy: Feature → Specification → Component
- Enhanced Metadata: File paths, API endpoints, UI components, acceptance criteria
- Verification System: E2E/Unit/Integration test criteria (SDD Integration)
- Session Continuity: Serena Memory persistence
- prd-auto-executor Compatible: JSON export

---

## 7-Step Workflow

### Step 0: Document Discovery

**Logic**: Locate PRD, UI/UX Guide, Functional Spec

**Document Loading**:
1. **PRD** (required):
   - If user provides path → Read directly
   - Else: Glob patterns (`*.md`) → Filter (PRD, REQUIREMENTS, SPEC, product)
   - If no candidates → Ask user (provide path or generate)
   - If multiple → Ask user to select

2. **UI/UX Guide** (optional):
   - Glob patterns: `*{UIUX,UI_UX,DESIGN}*.md`
   - If found → Read
   - If not found → Inform user (optional: generate using /11_PRD_TO_UIUX_LEAN)

3. **Functional Spec** (optional):
   - Glob patterns: `*{SPEC,명세서,명세}*.md`
   - If found → Read all spec files (may be multiple: frontend, backend)
   - If not found → Inform user (optional: generate using /12_PRD_UIUX_TO_SPEC_LEAN)

**Mode Determination**:
| Documents Available | Task Levels | Metadata | Mode |
|---------------------|------------|----------|------|
| PRD only | 1 (Features) | Basic | A |
| PRD + UI/UX | 2 (Features → Components) | Medium | B |
| PRD + Spec | 2 (Features → FE/BE) | Medium | C |
| PRD + UI/UX + Spec | 3 (Features → Spec → Components) | Enhanced | D |

**Output**: prd_content, uiux_content, spec_contents[], mode

---

### Step 1: PRD Structure Validation (SSOT Check)

**SSOT Requirements** (Heroines SDD):
- Context section: Dependencies, constraints, affected systems
- 3-Level structure per feature:
  - Task (문제 정의): "What problem are we solving?"
  - Development (실행 논리): "How do we implement it?"
  - Verification (검증 기준): "How do we verify success?"
- Issues section: For feedback loop (auto-populated on verification failures)

**Validation Logic**:
- Check for: "전체 맥락" or "Context" section
- Check for: "Task", "Development", "Verification" keywords
- Check for: "이슈" or "Issues" section
- If all present → SSOT-compliant → E2E verification enabled
- If missing → Basic structure → Limited verification

**User Choice** (if Basic):
- Option 1: Restructure to SDD (use Sequential Thinking MCP)
- Option 2: Keep existing structure (basic checklist only)

**Output**: prd_structure_type ("SSOT" or "Basic")

---

### Step 2: Extract Hierarchical Tasks (3-Level)

#### Level 1: PRD Features (Parent Tasks)

**Task Indicators**:
- Section headers: `## Features`, `### Requirements`, `## 핵심 기능`
- Bullet points: `-`, `*`, `•`
- Numbered lists: `1.`, `2.`, `3.`
- Action verbs: "implement", "create", "add", "build", "configure", "구현", "생성", "추가"
- Must/should/shall statements
- User stories: "As a user, I want...", "사용자는 ... 할 수 있다"

**Extraction Logic**:
- Split PRD by `## ` sections
- Skip meta sections: Context, Issues, Table of Contents
- For each section:
  - Match task patterns (bullets + action verbs)
  - Create Level 1 task with metadata:
    - content: `${task} 구현`
    - activeForm: `${task} 구현 중`
    - status: "pending"
    - metadata: prd_section, priority, dependencies

**Priority Inference**:
- 핵심 (Core): auth, payment, security, core keywords
- 필수 (Required): required, must, shall
- 중요 (Important): important, should
- 선택 (Optional): optional, nice to have, may
- Default: 중간

---

#### Level 2: Specification Steps (Mode C/D only)

**Only execute if**: spec_contents.length > 0

**Extraction Logic**:
- For each spec file (FE/BE):
  - Split by `### ` sections
  - Match feature names from Level 1
  - Extract steps from section (bullets)
  - Create Level 2 task:
    - content: `└─ [FE/BE] ${step}`
    - parent_index: Reference to Level 1 parent
    - metadata: spec_file, file_path, api_endpoint (BE only)

**Helpers**:
- extractFilePath: Look for patterns (`파일 경로: `, `File: `, backtick code paths)
- extractAPIEndpoint: Match `(GET|POST|PUT|DELETE|PATCH) /api/...`

---

#### Level 3: UI/UX Components (Mode B/D only)

**Only execute if**: uiux_content exists

**Extraction Logic**:
- Find "UI 컴포넌트 가이드" section
- Extract components (bold text in bullets: `**ComponentName**`)
- Check if ShadCN (guide mentions "shadcn" + component matches Button/Input/Card/Dialog/Select/Checkbox)
- Match to parent tasks (Level 1 with UI/page/form keywords)
- Create Level 3 task:
  - content: `    └─ ${comp_name} 컴포넌트${is_shadcn ? ' (ShadCN ✅)' : ''}`
  - metadata: uiux_ref, component path, is_shadcn

---

#### Task Merging and Ordering

**Logic**: For each Level 1 → Add Level 2 children → Add Level 3 children

**Output**: all_tasks[] (hierarchical order preserved)

---

### Step 3: Create TodoWrite Checklist with Metadata

**Metadata Enhancement** (for each task):
- task_id: `task-${index + 1}`
- estimated_time: estimateTime(task)
- dependencies: extractDependencies(task, all_tasks)
- acceptance_criteria: extractAcceptanceCriteria(task, uiux_content, spec_contents)
- task_type: inferTaskType(task) → for prd-auto-executor
- node_type: inferNodeType(task) → Core vs Leaf
- ai_automatable: node_type === 'leaf'

**Helper Logic**:

1. **estimateTime**:
   - Complex (4-8h): auth, payment, migration, architecture
   - Medium (2-4h): api, page, dashboard, integration
   - Simple (1-2h): component, ui, button, input, config
   - Default: 2-4h

2. **extractDependencies**:
   - Search for keywords: "requires", "depends on", "after", "전제", "필요", "이후"
   - Level 2/3 tasks auto-depend on their Level 1 parent

3. **extractAcceptanceCriteria**:
   - From UI/UX: Color palette, ShadCN requirement, responsive design, animation
   - From Spec: Error handling (400, 401, 500), ORM requirement (DrizzleORM/Prisma), JWT
   - Default: "PRD 요구사항 충족" (L1), "기능 정상 동작" (L2), "UI/UX 가이드 준수" (L3)

4. **inferTaskType**:
   - api_design: Contains "api", "엔드포인트", or has api_endpoint metadata
   - ui_ux: Contains "ui", "컴포넌트", "페이지", or is Level 3
   - testing: Contains "테스트", "test"
   - documentation: Contains "문서", "readme"
   - security: Contains "보안", "인증", "권한"
   - Default: general

5. **inferNodeType**:
   - core (AI can't automate): auth, payment, security, algorithm, business logic
   - leaf (AI can automate): UI, component, test, documentation, CRUD, API
   - Default: leaf

**Output**: TodoWrite(all_tasks) with complete metadata

**Example Task Structure**:
```
{
  content: "사용자 인증 기능 구현",
  activeForm: "사용자 인증 기능 구현 중",
  status: "pending",
  metadata: {
    task_id: "task-1",
    prd_section: "## 핵심 기능 > 사용자 인증",
    priority: "핵심",
    estimated_time: "4-8 hours",
    dependencies: [],
    acceptance_criteria: ["PRD 요구사항 충족"],
    task_type: "security",
    node_type: "core",
    ai_automatable: false
  }
}
```

---

### Step 4: Add Verification Metadata (SDD Integration)

**Only execute if**: prd_structure_type === "SSOT"

**Verification Type Selection** (for each task):

1. **E2E Test** (End-to-End):
   - When: task_type=ui_ux, contains "페이지/page/flow", file_path contains "/page.tsx"
   - Test command: `npx playwright test e2e/${task-name}.spec.ts`
   - Success criteria: "사용자 플로우 100% 통과"
   - Acceptance: UI 렌더링, 인터랙션 테스트

2. **Integration Test** (API):
   - When: task_type=api_design, contains "api/엔드포인트", file_path contains "/api/"
   - Test command: `npm test -- api/${task-name}.test.ts`
   - Success criteria: "API 엔드포인트 모든 케이스 통과"
   - Acceptance: 200 (성공), 400 (잘못된 요청), 401 (인증 실패), 500 (서버 오류)

3. **Unit Test** (Functions/Utils):
   - When: task_type=algorithm_optimization, contains "함수/function/util/helper/algorithm"
   - Test command: `npm test -- utils/${task-name}.test.ts`
   - Success criteria: "모든 유닛 테스트 통과"
   - Acceptance: 함수 정상 동작, 엣지 케이스, 에러 핸들링

4. **Manual** (Design/Documentation):
   - When: task_type=documentation, contains "문서/readme/가이드/design/디자인"
   - Test command: null
   - Success criteria: "사용자 확인 필요"
   - Acceptance: 요구사항 충족, 품질 기준 만족

**Feedback Loop Config**:
- on_success: "Update PRD checklist" (mark as ✅ in PRD file)
- on_failure: "Add to PRD issues section" (auto-add to Issues)

**Output**: Tasks with verification metadata

---

### Step 5: Save to Serena Memory

**Three Outputs**:

1. **Serena Memory** (prd_tracker_${project}_sdd):
   - PRD paths and structure type
   - Mode (A/B/C/D)
   - Task counts: total, completed, in_progress, pending, verified, failed
   - SDD metrics: core_tasks, leaf_tasks, e2e_coverage
   - Verification types breakdown
   - Full task list
   - Timestamps

2. **Document Cross-Reference Map** (prd_tracker_${project}_document_map.md):
   - Only if Mode B/C/D
   - Groups tasks by Level 1 features
   - Shows: PRD section, Spec file, file paths, API endpoints, UI components

3. **prd-auto-executor JSON Checklist** (prd_checklist.json):
   - Compatible format for prd-auto-executor skill
   - Includes: task metadata, test commands, build/lint commands, acceptance criteria, file paths, API endpoints
   - Priority mapping: 핵심→core, 필수→hard, 중요→medium, 선택→easy

**Error Handling**: If Serena Memory unavailable → Warn user → Continue (JSON file backup)

---

### Step 6: Progress Tracking Loop (During Implementation)

**On Task Start**:
- Mark status: "in_progress"
- Update Serena state: in_progress+1, pending-1
- Display verification criteria (if SDD)

**On Task Complete** (SDD Verification Flow):

1. **If verification.type === 'manual'**:
   - Ask user: "모든 acceptance criteria 만족?"
   - If yes → verificationPassed()
   - If no → verificationFailed()

2. **If verification.type === 'e2e/integration/unit'**:
   - Execute: Bash({ command: test_command, timeout: 300000 })
   - If exitCode === 0 → verificationPassed()
   - If exitCode !== 0 → verificationFailed()

**verificationPassed Logic**:
- Mark status: "completed", verified: true
- Update Serena: completed+1, in_progress-1, verified+1
- Feedback: Edit PRD file → Mark task as `[x] ✅ (검증 완료: YYYY-MM-DD)`

**verificationFailed Logic**:
- Keep status: "pending" (or mark as failed)
- Update Serena: in_progress-1, failed+1
- Increment failure_count
- Feedback: Edit PRD file → Add to "## 이슈 및 블로커" section with error details
- Escalate: If failure_count ≥ 3 → Ask user (재시도/건너뛰기/중단)

**If Basic PRD** (no SSOT):
- Just mark as "completed" (no verification)

---

### Step 7: Session Continuity

**On Session End**: No action required (TodoWrite + Serena Memory auto-persist)

**On Session Restart** (User says: "PRD 작업 계속"):
1. Read Serena Memory: prd_tracker_${project}_sdd
2. Display progress summary: total, completed, in_progress, pending, verified, failed
3. Recreate TodoWrite(tracking_state.tasks)
4. Find next task: in_progress OR first pending
5. Display next task details

**Error Handling**: If Serena read fails → Ask user for PRD path → Restart from Step 0

---

## Error Handling

1. **Missing PRD File**:
   - Ask user: Provide path OR Generate using /13_REQUIREMENTS_TO_PRD_LEAN

2. **Serena Memory Unavailable**:
   - Warn: "세션 종료 시 상태 손실 가능"
   - Fallback: prd_checklist.json로 복원 가능

3. **Verification Test Timeout**:
   - If timeout (>5 minutes) → Warn user → Switch to manual verification

---

## Success Criteria

Before completing skill execution, verify:

- [ ] PRD 파일 로드 완료 (최소 1개)
- [ ] 작업 추출 완료 (최소 1개 이상)
- [ ] TodoWrite 생성 완료
- [ ] Serena Memory 저장 시도 (실패 OK)
- [ ] prd_checklist.json 생성 완료
- [ ] 문서 Cross-Reference Map 생성 (Mode B/C/D인 경우)
- [ ] 검증 메타데이터 추가 (SSOT PRD인 경우)

**If any missing**: Report incomplete execution → Retry

---

## Token Budget

**Expected usage**:
- Initial run: 650-800 tokens
- Session resume: 150-200 tokens

**Optimization**:
- If PRD > 50 tasks → Use Sequential Thinking MCP for extraction (offload to subagent)
- If UI/UX Guide > 20 components → Extract only mentioned components
- If Functional Spec > 100 pages → Focus on API definitions and file paths only

---

## Summary

**Workflow**: PRD (+ optional UI/UX + Spec) → 3-level TodoWrite + Verification + Serena persistence

**Features**:
- ✅ Flexible Document Integration (1-3 documents)
- ✅ 3-Level Hierarchical Tasks (Feature → Spec → Component)
- ✅ Enhanced Metadata (file paths, API endpoints, acceptance criteria)
- ✅ SDD Verification System (E2E/Unit/Integration tests)
- ✅ Session Continuity (Serena Memory persistence)
- ✅ prd-auto-executor Compatibility (JSON export)
- ✅ Feedback Loop (PRD auto-update on success/failure)

**Best for**:
- Starting implementation from PRD
- Ensuring no requirements are missed
- Tracking multi-session development
- Verification-first development (SDD)
- Team collaboration (shared checklist)

---

**Version**: 2.1.0
**Last Updated**: 2025-12-26
**Skill Type**: Linear Workflow (not Hybrid B+)
**Applies to**: MCP Management System v2.1+

---

## Change History

See [CHANGELOG.md](./CHANGELOG.md) for version history and updates.

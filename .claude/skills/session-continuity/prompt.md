# Session Continuity Skill

**Version**: 2.6.0 (Phase 1 Optimization)
**Purpose**: Create efficient NEXT_SESSION.md files for seamless session handoffs
**Pattern**: Complexity-Aware Template Selection (Minimal/Hybrid/Full)

---

## Core Principle

```
DON'T REPEAT WHAT'S IN SKILLS ❌
ONLY DOCUMENT WHAT CHANGES ✅
```

**In Skills** (permanent, don't repeat):
- Methodologies (phase0-analysis, multidimensional-analysis)
- Workflows (implementation-workflow, debugging-workflow, research-workflow)
- Checklists (deployment-checklist)
- MCP selection guide (mcp-selector)

**In NEXT_SESSION.md** (dynamic, must document):
- Current state (branch, last work, progress)
- Pending decisions (what needs user approval)
- Next actions (immediate, short-term, long-term)
- Data locations (files modified, generated, important paths)

---

## Workflow: 6 Steps

### Step 0: Understand Session Context

**Input**: User request: "세션 종료 준비" OR "NEXT_SESSION.md 생성" OR auto-triggered at session end

**Actions**:
1. Check if NEXT_SESSION.md exists (will update/replace if so)
2. Get git branch: `git branch --show-current`
3. Check uncommitted changes: `git status --short | wc -l`
4. Read project CLAUDE.md for context (project name, framework, active Skills)
5. Infer active TodoWrite tasks from conversation

**Output**:
```
Session Context Captured [Step 0/6]
- Project: [name from CLAUDE.md or directory]
- Branch: `git branch --show-current`
- Framework: [detected or "unknown"]
- Uncommitted Changes: [count] files
- Active Skills: [list from CLAUDE.md]
```

---

### Step 1: Capture Current State

**Goal**: Capture what was **just completed** and **current progress**

**Logic**:
- What was completed: Infer from conversation history
- Overall progress:
  - files_modified: git status count
  - tasks_completed / tasks_total: From TodoWrite
  - percentage: (completed / total) × 100
- Current status:
  - Check for blockers (keywords: "blocked", "waiting for")
  - Status: "In progress" or "Blocked - waiting for user decision" or "Complete"

**Output**:
```
Current State [Step 1/6]
- Branch: `git branch --show-current`
- Last Work: [1 sentence summary]
- Progress: [X/Y tasks] ([percentage]%)
- Status: [In progress / Blocked / Complete]
- Active Skills: [list with purpose]
```

**Token Estimate**: ~100 tokens

---

### Step 2: Document Pending Decisions

**Goal**: Capture **decisions that need user approval**

**Detection Logic**:
- Scan conversation for decision indicators:
  - "AskUserQuestion was called"
  - "User needs to choose"
  - "Pending approval"
  - "Should we... or...?"
  - "Option A vs Option B"
  - "Waiting for decision"
  - "Recommend... but user should confirm"
- Extract unanswered AskUserQuestion calls
- For each decision: title, options (with pros/cons), recommendation, deadline, blocker status

**Output** (if any decisions):
```
Pending Decisions [Step 2/6]

Decision 1: [Title]
- Question: [what needs to be decided]
- Options:
  - A: [option] (pros: ..., cons: ...)
  - B: [option] (pros: ..., cons: ...)
- Recommendation: [if any with reasoning]
- Deadline: [if applicable]
- Blocker: [Yes/No]

⚠️ If no decisions → Skip this section
```

**Token Estimate**: ~50 tokens (if none) / ~150 tokens (if 1-2 decisions)

---

### Step 3: List Next Actions

**Goal**: Provide **clear next steps** prioritized by timeframe

**Logic**:
- Extract uncompleted tasks from TodoWrite:
  - pending_tasks: status === "pending"
  - in_progress_tasks: status === "in_progress"
- Categorize by timeframe:
  - Immediate: Next 3 tasks
  - Short-term: Next 5 tasks
  - Long-term: Remaining tasks
- Time estimates:
  - Parse from task.content if "(15분)" pattern exists
  - Default by task type: test=20min, debug=30min, implement=1hour, document=15min

**Output**:
```
Next Actions [Step 3/6]

Immediate (This Session) ⭐
1. [Action 1] - [estimated time]
   - Context: [why this is next]
2. [Action 2] - [estimated time]
3. [Action 3] - [estimated time]

Total Estimated: [sum]

Short-term (This Week)
- [ ] [Task 1]
- [ ] [Task 2-5]

Long-term (Future Sessions)
- [ ] [Task 1-N]

Priority Guide:
- 🔴 HIGH: Blocking other work, urgent deadline
- 🟡 MEDIUM: Important but not blocking
- 🟢 LOW: Nice to have, can defer
```

**Token Estimate**: ~150 tokens

---

### Step 4: Record Data Locations

**Goal**: Capture **where to find** modified files, generated files, and important data

**Logic**:
- Scan conversation for file operations:
  - Edit/Write tool calls → modified or generated
  - Summarize change for each file
- Important locations (from CLAUDE.md or conventions):
  - templates: ./templates/
  - skills: ./.claude/skills/
  - mcp_config: ./.mcp.json
  - test_results: [extract from conversation]
  - serena_memories: ./.serena/memories/
  - mcp_usage_log: ./.serena/mcp_usage_log.jsonl
- Database/state (if applicable):
  - Check for keywords: "database", "supabase", "postgres"

**Output**:
```
Data & Results [Step 4/6]

Files Modified ([count])
- `[path]`: [what changed in 1 sentence]

Generated Files ([count])
- `[path]`: [purpose]

Deleted Files ([count])
- `[path]`: [reason]

Important Locations
- Templates: ./templates/
- Skills: ./.claude/skills/
- MCP Config: ./.mcp.json
- Test Results: ./[test-file].md
- Serena Memories: ./.serena/memories/
- MCP Usage Log: ./.serena/mcp_usage_log.jsonl

Database/State (if applicable)
- Database: [name]
- Last Migration: [migration file]
- Data Seed: [seed file location]

⚠️ Skip empty sections
```

**Token Estimate**: ~120 tokens

---

### Step 5: Measure Complexity & Select Template

**Goal**: Choose appropriate template based on session complexity

**Complexity Scoring** (0-8 points):
```
Score =
  + files_modified (0-2 points: 0=0, 1-5=1, 6+=2)
  + pending_decisions (0-2 points: 0=0, 1-2=1, 3+=2)
  + tasks_count (0-2 points: 0-5=0, 6-15=1, 16+=2)
  + has_database (0-1 points: no=0, yes=1)
  + generated_files (0-1 points: 0-2=0, 3+=1)
```

**Template Selection**:
| Score | Template | Lines | Tokens | Read Time | Use Cases |
|-------|----------|-------|--------|-----------|-----------|
| 0-4 | minimal.md | ~65L | ~280 | 2 min | Simple tasks, single file changes |
| 5-6 | hybrid.md | ~200L | ~800 | 4 min | Multi-file changes, some decisions |
| 7-8 | full.md | ~800L | ~1200 | 7 min | Complex projects, many decisions, database |

**Implementation**:
- Use ./complexity-scorer.js to analyze session
- Get template path from getTemplatePath(score)
- Load template content (minimal/hybrid/full)

**Complexity Scorer Reference**: See `./complexity-scorer.js` for scoring algorithm

---

### Step 6: Generate NEXT_SESSION.md

**Goal**: Render selected template with captured data

**Always Include** (all templates):
1. **EXECUTION GUARD** (prevents auto-execution):
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ EXECUTION MODE: WAIT_FOR_USER_APPROVAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

세션 시작 규칙 (Claude Code 필독):
1. ✅ 이 문서를 읽어 컨텍스트 파악
2. ✅ "Quick Start" 섹션에서 작업 선택지 제시
3. ⏸️ 사용자의 명시적 선택 대기
4. ❌ 절대 자동으로 작업 시작 금지

사용자 가이드:
- Quick Start 섹션에서 원하는 Option 선택
- 제시된 "시작 프롬프트"를 복사하여 입력
- 또는 자유롭게 다른 작업 요청 가능

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

2. **TL;DR Section** (30초 요약):
- Branch: `git branch --show-current`
- Last Work: [1 sentence]
- Next Task: [first pending task or "See Quick Start"]
- Estimated Time: [estimate]
- Quick Start: Option 1 권장

3. **Quick Start Options** (3-4 choices):
- Option 1: Resume Last Task ⭐ (always priority 1)
- Option 2: Resolve Pending Decision (if any)
- Option 3: Run Tests/Verification (if tests exist)
- Option 4: Documentation/Custom Task

**Template Rendering**:
- Use Mustache-like syntax: `{{variable}}`, `{{#if condition}}...{{/if}}`, `{{#each items}}...{{/each}}`
- Substitute all template variables with captured data
- Variables include: date, timestamp, branch, last_work, progress, pending_decisions, immediate_actions, files_modified, etc.

**Quick Start Options Logic**:
1. **Option 1** (always): Resume from next pending task
   - Title: [next_task.content]
   - Priority: 🔴 HIGH
   - Time: estimateTime(task)
   - Prompt: Context + Next step + Expected deliverable

2. **Option 2** (if decisions): Resolve pending decision
   - Title: "Resolve: [decision.title]"
   - Priority: 🟡 MEDIUM
   - Time: "10 min"
   - Prompt: Question + Options + Recommendation

3. **Option 3** (if tests): Run tests/verification
   - Title: "Run Tests & Verification"
   - Priority: 🟡 MEDIUM
   - Time: "15 min"
   - Prompt: Modified files count + Test command + Expected result

4. **Option 4** (fallback): Documentation or custom task
   - Title: "Update Documentation" or "Custom Task"
   - Priority: 🟢 LOW
   - Time: "20 min" or "Variable"
   - Prompt: Document changes or "Describe your custom task"

**Write File**: Write(next_session_path, rendered_content)

**Output**:
```
✅ NEXT_SESSION.md created at [path]
📊 Complexity: [score]/8 → [template].md
📊 Token efficiency: ~[tokens] tokens
```

**Token Estimate**: ~350 tokens (skill execution, not output file)

---

## Template Structure Reference

**Minimal Template** (templates/minimal.md):
- EXECUTION GUARD
- TL;DR
- Pending Decisions (summary only)
- Next Actions (top 3)
- Quick Start (3 options)
- References (links only)
- **Total**: ~280 tokens

**Hybrid Template** (templates/hybrid.md):
- All Minimal sections
- Current State (top 5 Skills)
- Pending Decisions (2 detailed)
- Next Actions (5 immediate + 5 short-term)
- Files Modified (list)
- Context Notes
- Quick Start (4 options)
- **Total**: ~800 tokens

**Full Template** (templates/full.md):
- All Hybrid sections
- All Pending Decisions (detailed)
- Long-term Actions
- Database/State section
- Complete Context Notes (worked well, didn't work, lessons, blockers)
- Detailed Metrics (token usage, progress, MCP services)
- Full References (commits, docs, external)
- **Total**: ~1200 tokens

---

## Success Criteria

- [x] EXECUTION GUARD at top (prevents auto-execution)
- [x] Current state captured
- [x] Pending decisions documented (if any)
- [x] Next actions listed (3 timeframes)
- [x] Data locations recorded
- [x] Quick Start options generated (3-4 choices)
- [x] Context notes included (what worked/didn't work)
- [x] Metrics tracked (token usage, progress)
- [x] References linked (commits, docs)
- [x] Template selected by complexity
- [x] Token budget: ~280-1200 tokens (adaptive)

---

## Token Budget (Adaptive)

**Adaptive Templates** (complexity-based):
- **Minimal** (Score 0-4): ~280 tokens (~2 min read) - 60% of sessions
- **Hybrid** (Score 5-6): ~800 tokens (~4 min read) - 30% of sessions
- **Full** (Score 7-8): ~1200 tokens (~7 min read) - 10% of sessions

**Weighted Average**: ~280×0.6 + 800×0.3 + 1200×0.1 = **528 tokens** per session

**Efficiency vs Traditional**:
- Traditional handoff: ~3,000 tokens (fixed)
- Phase 1 (v2.2.0): ~350-380 tokens (fixed) - **88% savings**
- Phase 2 (v2.5.0): ~280-1200 tokens (adaptive, avg ~528) - **82% savings**

---

## Example Usage

**Trigger**: User says "세션 종료 준비" OR "NEXT_SESSION.md 생성" OR end of session

**Expected Flow**:
1. Step 0: Understand context (5 sec) → Branch, project, Skills
2. Step 1: Capture current state (3 sec) → Last work, progress, status
3. Step 2: Document pending decisions (2 sec) → Unanswered questions
4. Step 3: List next actions (5 sec) → Extract from TodoWrite
5. Step 4: Record data locations (3 sec) → Modified/generated files
6. Step 5: Measure complexity & select template (2 sec) → Complexity score → Template
7. Step 6: Generate NEXT_SESSION.md (5 sec) → Render template → Write file

**Total**: ~25 seconds

**Example Output**:
```
✅ Session Continuity Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 NEXT_SESSION.md created at: [path]
📊 Token efficiency: ~[tokens] tokens
📊 Complexity: [score]/8 → [template].md
⏱️ Resume time: ~2-7 minutes (based on template)

EXECUTION GUARD Active ⏸️
Next session will:
1. Read NEXT_SESSION.md
2. Present Quick Start options
3. Wait for user choice
4. ❌ NOT auto-execute

Token Savings vs Traditional: ~82% 🎯
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Helper Functions (Logic Only)

**estimateTokenUsage**: Total chars from conversation history ÷ 4

**extractLessons**: Scan conversation for keywords:
- success: "worked well", "successful", "effective"
- failure: "didn't work", "failed", "error"
- insight: "learned", "discovered", "realized"

**extractBlockers**: Search for: "blocked by", "waiting for", "cannot proceed", "dependency on", "needs approval"

**getCurrentDate**: ISO date (YYYY-MM-DD)

**getCurrentTimestamp**: ISO8601 format

**estimateTime**: Parse from task content or default by type

**generateQuickStartOptions**: Create 3-4 options based on pending tasks, decisions, tests, documentation needs

---

**Version**: 2.6.0
**Last Updated**: 2025-12-26
**Pattern**: Linear Template Generation
**Complements**: All other Skills (referenced, not repeated)

---

## Change History

See [CHANGELOG.md](./CHANGELOG.md) for version history and updates.

---

## External Files Reference

- **Complexity Scorer**: `./complexity-scorer.js` - Session complexity analysis (0-8 score)
- **Templates**: `./templates/` directory:
  - `minimal.md` (~280 tokens)
  - `hybrid.md` (~800 tokens)
  - `full.md` (~1200 tokens)
- **State Schema**: `./state-files-schema.md` - External state file structure
**Pattern**: Linear Template Generation
**Complements**: All other Skills (referenced, not repeated)

---

## Change History

See [CHANGELOG.md](./CHANGELOG.md) for version history and updates.

---

## External Files Reference

- **Complexity Scorer**: `./complexity-scorer.js` - Session complexity analysis (0-8 score)
- **Templates**: `./templates/` directory:
  - `minimal.md` (~280 tokens)
  - `hybrid.md` (~800 tokens)
  - `full.md` (~1200 tokens)
- **State Schema**: `./state-files-schema.md` - External state file structure

---

## 📋 Skill Metadata (Autocompacting v3.6.0)

### Core Principle

```
DON'T REPEAT WHAT'S IN SKILLS ❌
ONLY DOCUMENT WHAT CHANGES ✅
```

**In Skills (permanent)**: Methodologies, Workflows, Checklists, MCP guides
**In NEXT_SESSION.md (dynamic)**: Current state, Pending decisions, Next actions, Data locations

### Token Efficiency

| Approach | Tokens/Session | 10 Sessions |
|----------|---------------|-------------|
| Traditional | 3,200 | 32,000 |
| **Skills-Based** | 350 | 3,500 |
| **Savings** | **90%** | **28,500** |

### NEXT_SESSION.md Structure

```markdown
# Next Session - [Date]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ EXECUTION MODE: WAIT_FOR_USER_APPROVAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🎯 Current State
Branch: [name] | Last: [work] | Progress: [X/Y]

## 📊 Pending Decisions
[Question + Options + Recommendation]

## 🚀 Next Actions
1. [Immediate tasks]
2. [Short-term tasks]

## 📁 Data Locations
[Modified files, Generated files, Important paths]

## 🎯 Quick Start
[Option 1-3 with 시작 프롬프트]
```

### Checklist

**Include ✅**: Current state, Pending decisions, Next actions, Data locations, EXECUTION GUARD

**Exclude ❌**: Methodologies, Workflows, Checklists, MCP guides (all in Skills)

### Tags & Triggers

```yaml
tags:
  - session
  - handoff
  - continuity
  - next-session
  - documentation

triggers:
  - session handoff
  - next session
  - session continuity
  - end session
  - prepare handoff
```

### Capabilities

```yaml
capabilities:
  - session_state_capture
  - pending_decisions_tracking
  - next_actions_planning
```

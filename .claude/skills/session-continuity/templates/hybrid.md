# Next Session - {{date}}

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

## 🎯 TL;DR (30초 요약)

- **Branch**: {{branch}}
- **Last Work**: {{last_work}}
- **Progress**: {{tasks_completed}}/{{tasks_total}} tasks ({{progress_percentage}}%)
- **Status**: {{status}}
- **Next Task**: {{next_task}}
- **Estimated Time**: {{estimated_time}}
- **Quick Start**: Option 1 권장

---

## 📍 Current State

**Framework**: {{framework}}
**Project**: {{project_name}}

**Active Skills** (Top 5):
{{#if active_skills}}
{{#each active_skills}}
- **{{name}}** ({{version}}): {{purpose}}
{{/each}}
{{else}}
None
{{/if}}

**Files Modified**: {{files_modified_count}} files
**Uncommitted Changes**: {{uncommitted_changes_count}} files

---

## 📊 Pending Decisions (상세)

{{#if pending_decisions}}
{{#each pending_decisions limit=2}}
### Decision {{add @index 1}}: {{title}}

**Context**: {{context}}

**Options**:
{{#each options}}
#### Option {{@key}}: {{label}}
- **Description**: {{description}}
{{#if pros}}
- **Pros**: {{pros}}
{{/if}}
{{#if cons}}
- **Cons**: {{cons}}
{{/if}}
{{/each}}

**Recommendation**: {{recommendation}}
{{#if deadline}}
**Deadline**: {{deadline}}
{{/if}}
{{#if blocker}}
⚠️ **Blocker**: This decision blocks other work
{{/if}}

---
{{/each}}

{{#if has_more_decisions}}
📌 **Note**: {{remaining_decisions_count}} more decision(s) pending. See full list in NEXT_SESSION (full template).
{{/if}}

{{else}}
✅ No pending decisions - ready to proceed
{{/if}}

---

## 🚀 Next Actions

### Immediate (Top 5)
{{#if immediate_actions}}
{{#each immediate_actions limit=5}}
{{add @index 1}}. **{{content}}**
   - Priority: {{priority}}
   - Time: {{estimated_time}}
   {{#if dependencies}}
   - Depends on: {{dependencies}}
   {{/if}}
{{/each}}
{{else}}
See Quick Start options below
{{/if}}

### Short-term (Next 5)
{{#if short_term_actions}}
{{#each short_term_actions limit=5}}
{{add @index 1}}. {{content}}
{{/each}}
{{else}}
None defined
{{/if}}

---

## 📁 Data & Results

### Files Modified ({{files_modified_count}})
{{#if files_modified}}
{{#each files_modified limit=10}}
- `{{path}}`: {{change_summary}}
{{/each}}
{{#if has_more_files}}
... and {{remaining_files_count}} more files (see `git status`)
{{/if}}
{{else}}
None
{{/if}}

### Generated Files ({{generated_files_count}})
{{#if generated_files}}
{{#each generated_files}}
- `{{path}}`: {{purpose}}
{{/each}}
{{else}}
None
{{/if}}

### Important Locations
- **Templates**: {{templates_path}}
- **Skills**: `.claude/skills/`
- **MCP Config**: `.mcp.json`
{{#if test_results_path}}
- **Test Results**: {{test_results_path}}
{{/if}}
- **Serena Memories**: `.serena/memories/`
- **MCP Usage Log**: `.serena/mcp_usage_log.jsonl`

---

## 💭 Context Notes

### What Worked Well
{{#if worked_well}}
{{#each worked_well}}
- {{note}}
{{/each}}
{{else}}
No notes
{{/if}}

### What Didn't Work
{{#if didnt_work}}
{{#each didnt_work}}
- {{note}}
{{/each}}
{{else}}
No notes
{{/if}}

### Lessons Learned
{{#if lessons}}
{{#each lessons}}
- {{lesson}}
{{/each}}
{{else}}
No notes
{{/if}}

### Current Blockers
{{#if blockers}}
{{#each blockers}}
- ⚠️ {{blocker}}
{{/each}}
{{else}}
None
{{/if}}

---

## 🎯 Quick Start

### Option 1: Resume Last Task ⭐ (Recommended)
- **Task**: {{next_task}}
- **Priority**: 🔴 HIGH
- **Time**: {{task_estimated_time}}
- **Context**: {{task_context}}
- **프롬프트**:
  ```
  {{resume_prompt}}
  ```

### Option 2: {{alternative_title_1}}
- **Task**: {{alternative_task_1}}
- **Priority**: 🟡 MEDIUM
- **Time**: {{alternative_time_1}}
- **프롬프트**:
  ```
  {{alternative_prompt_1}}
  ```

### Option 3: {{alternative_title_2}}
- **Task**: {{alternative_task_2}}
- **Priority**: 🟡 MEDIUM
- **Time**: {{alternative_time_2}}
- **프롬프트**:
  ```
  {{alternative_prompt_2}}
  ```

### Option 4: Custom Task
- **Task**: Describe your custom task
- **Priority**: 🟢 LOW
- **Time**: Variable
- **프롬프트**: "Tell me what you want to work on"

---

## 📚 References

### Git
- **Branch**: `{{branch}}`
- **Recent Commits**: `git log --oneline -5`
- **Diff**: `git diff {{base_branch}}...HEAD`

### Documentation
{{#if docs_links}}
{{#each docs_links}}
- [{{title}}]({{url}})
{{/each}}
{{else}}
See project README.md
{{/if}}

---

📝 **Session Handoff**: Hybrid template (medium complexity)
🕐 **Created**: {{timestamp}}
📊 **Complexity Score**: {{complexity_score}}/8

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

## 📍 Current State (상세)

**Project Information**:
- **Name**: {{project_name}}
- **Framework**: {{framework}}
- **MCP Services**: {{mcp_services_count}} active
- **Claude Code Version**: {{claude_code_version}}

**Active Skills** (All):
{{#if active_skills}}
{{#each active_skills}}
{{add @index 1}}. **{{name}}** ({{version}})
   - Purpose: {{purpose}}
   - Type: {{type}}
   - Last Used: {{last_used}}
   {{#if mcp_dependencies}}
   - MCP Dependencies: {{mcp_dependencies}}
   {{/if}}
{{/each}}
{{else}}
None
{{/if}}

**Session Metrics**:
- **Session Number**: {{session_number}}
- **Duration**: {{session_duration}}
- **Tools Used**: {{tools_used_count}}
- **Files Modified**: {{files_modified_count}}
- **Token Usage**: {{token_usage}} / 200k

**Git Status**:
- **Branch**: `{{branch}}`
- **Ahead/Behind**: {{git_ahead}}/{{git_behind}}
- **Uncommitted**: {{uncommitted_changes_count}} files
- **Last Commit**: {{last_commit_hash}} - {{last_commit_message}}

---

## 📊 Pending Decisions (전체 상세)

{{#if pending_decisions}}
{{#each pending_decisions}}
### Decision {{add @index 1}}: {{title}}

**ID**: `{{id}}`
**Created**: {{created_at}}
**Context**: {{context}}

**Problem Statement**:
{{problem}}

**Options**:
{{#each options}}
#### Option {{@key}}: {{label}}

**Description**: {{description}}

**Pros**:
{{#each pros}}
- ✅ {{this}}
{{/each}}

**Cons**:
{{#each cons}}
- ❌ {{this}}
{{/each}}

**Cost**: {{cost}}
**Risk**: {{risk}}
**Time**: {{time_estimate}}

{{/each}}

**Analysis**:
{{analysis}}

**Recommendation**: {{recommendation}}
**Confidence**: {{confidence}}%

{{#if deadline}}
⏰ **Deadline**: {{deadline}}
{{/if}}

{{#if blocker}}
⚠️ **BLOCKER**: This decision blocks the following work:
{{#each blocked_tasks}}
- {{task}}
{{/each}}
{{/if}}

{{#if related_decisions}}
**Related Decisions**: {{related_decisions}}
{{/if}}

---
{{/each}}
{{else}}
✅ No pending decisions - ready to proceed
{{/if}}

---

## 🚀 Next Actions (전체)

### Immediate Actions (Do First)
{{#if immediate_actions}}
{{#each immediate_actions}}
{{add @index 1}}. **{{content}}**
   - **Priority**: {{priority}}
   - **Time**: {{estimated_time}}
   - **Assignee**: {{assignee}}
   {{#if dependencies}}
   - **Depends on**: {{dependencies}}
   {{/if}}
   {{#if acceptance_criteria}}
   - **Acceptance Criteria**:
     {{#each acceptance_criteria}}
     - [ ] {{criterion}}
     {{/each}}
   {{/if}}
{{/each}}
{{else}}
See Quick Start options
{{/if}}

### Short-term Actions (This Week)
{{#if short_term_actions}}
{{#each short_term_actions}}
{{add @index 1}}. {{content}}
   - Priority: {{priority}}
   - Time: {{estimated_time}}
{{/each}}
{{else}}
None defined
{{/if}}

### Long-term Actions (This Month)
{{#if long_term_actions}}
{{#each long_term_actions}}
{{add @index 1}}. {{content}}
   - Priority: {{priority}}
   - Time: {{estimated_time}}
   - Target: {{target_date}}
{{/each}}
{{else}}
None defined
{{/if}}

---

## 📁 Data & Results (상세)

### Files Modified (All {{files_modified_count}})
{{#if files_modified}}
{{#each files_modified}}
- `{{path}}`
  - Change: {{change_type}} ({{lines_added}}+/{{lines_removed}}-)
  - Summary: {{change_summary}}
  {{#if why}}
  - Why: {{why}}
  {{/if}}
{{/each}}
{{else}}
None
{{/if}}

### Generated Files (All {{generated_files_count}})
{{#if generated_files}}
{{#each generated_files}}
- `{{path}}`
  - Purpose: {{purpose}}
  - Size: {{size}}
  - Format: {{format}}
{{/each}}
{{else}}
None
{{/if}}

### Deleted Files ({{deleted_files_count}})
{{#if deleted_files}}
{{#each deleted_files}}
- `{{path}}`: {{reason}}
{{/each}}
{{else}}
None
{{/if}}

### Important Locations
- **Project Root**: `{{project_root}}`
- **Templates**: `{{templates_path}}`
- **Skills**: `.claude/skills/`
- **MCP Config**: `.mcp.json`
- **MCP Local**: `.mcp.local.json`
{{#if test_results_path}}
- **Test Results**: `{{test_results_path}}`
{{/if}}
- **Serena Memories**: `.serena/memories/`
- **MCP Usage Log**: `.serena/mcp_usage_log.jsonl`
{{#if database_path}}
- **Database**: `{{database_path}}`
{{/if}}

---

## 💾 Database & State

{{#if has_database}}
**Database**: {{database_type}}
**Connection**: {{database_connection}}

**Last Migration**:
- File: `{{last_migration_file}}`
- Applied: {{last_migration_date}}
- Status: {{migration_status}}

**Schema Changes**:
{{#if schema_changes}}
{{#each schema_changes}}
- {{table}}: {{change_type}} - {{description}}
{{/each}}
{{else}}
None in this session
{{/if}}

**Data Seed**:
{{#if data_seed}}
- Location: `{{data_seed_path}}`
- Last Updated: {{data_seed_updated}}
{{else}}
None
{{/if}}

**Pending Migrations**:
{{#if pending_migrations}}
{{#each pending_migrations}}
- `{{file}}`: {{description}}
{{/each}}
{{else}}
None
{{/if}}
{{else}}
No database in this project
{{/if}}

---

## 💭 Context Notes (완전판)

### What Worked Well ✅
{{#if worked_well}}
{{#each worked_well}}
{{add @index 1}}. **{{title}}**
   - What: {{what}}
   - Why it worked: {{why}}
   - Lessons: {{lessons}}
   - Reusable: {{reusable}}
{{/each}}
{{else}}
No notes
{{/if}}

### What Didn't Work ❌
{{#if didnt_work}}
{{#each didnt_work}}
{{add @index 1}}. **{{title}}**
   - What: {{what}}
   - Why it failed: {{why}}
   - Lessons: {{lessons}}
   - Alternative approach: {{alternative}}
{{/each}}
{{else}}
No notes
{{/if}}

### Lessons Learned 📚
{{#if lessons}}
{{#each lessons}}
{{add @index 1}}. **{{category}}**: {{lesson}}
   - Application: {{application}}
   - Documentation: {{documentation_link}}
{{/each}}
{{else}}
No notes
{{/if}}

### Current Blockers ⚠️
{{#if blockers}}
{{#each blockers}}
{{add @index 1}}. **{{title}}**
   - Issue: {{issue}}
   - Impact: {{impact}}
   - Workaround: {{workaround}}
   - Owner: {{owner}}
   - ETA Resolution: {{eta}}
{{/each}}
{{else}}
None
{{/if}}

### Technical Debt 🔧
{{#if technical_debt}}
{{#each technical_debt}}
- {{item}} (Priority: {{priority}}, Effort: {{effort}})
{{/each}}
{{else}}
None tracked
{{/if}}

---

## 📊 Detailed Metrics

### Token Usage
- **This Session**: {{session_tokens}} tokens
- **Average per Session**: {{avg_tokens_per_session}} tokens
- **Total (All Sessions)**: {{total_tokens}} tokens
- **Remaining Budget**: {{remaining_tokens}} / 200k

### Progress Metrics
- **Tasks Completed**: {{tasks_completed}} / {{tasks_total}} ({{progress_percentage}}%)
- **Velocity**: {{velocity}} tasks/day
- **ETA Completion**: {{eta_completion}}

### MCP Services Usage
{{#if mcp_usage}}
{{#each mcp_usage}}
- **{{service_name}}**: {{call_count}} calls, {{total_time}}ms
{{/each}}
{{else}}
No MCP usage this session
{{/if}}

### Skills Usage
{{#if skills_usage}}
{{#each skills_usage}}
- **{{skill_name}}**: {{usage_count}} times
{{/each}}
{{else}}
No skills used
{{/if}}

### Error Log
{{#if errors}}
{{#each errors}}
- [{{timestamp}}] {{error_type}}: {{message}}
  - Context: {{context}}
  - Resolution: {{resolution}}
{{/each}}
{{else}}
No errors
{{/if}}

---

## 🎯 Quick Start (4 Options)

### Option 1: Resume Last Task ⭐ (Recommended)
- **Task**: {{next_task}}
- **Priority**: 🔴 HIGH
- **Time**: {{task_estimated_time}}
- **Context**: {{task_context}}
- **Previous Work**: {{previous_work}}
- **Expected Deliverable**: {{expected_deliverable}}
- **프롬프트**:
  ```
  {{resume_prompt}}
  ```

### Option 2: Resolve Pending Decision
{{#if first_pending_decision}}
- **Decision**: {{first_pending_decision.title}}
- **Priority**: 🟡 MEDIUM
- **Time**: 10-15 min
- **Options**: {{first_pending_decision.options_count}} options to review
- **프롬프트**:
  ```
  {{decision_prompt}}
  ```
{{else}}
- No pending decisions
{{/if}}

### Option 3: Run Tests & Verification
- **Task**: Run tests and verify {{files_modified_count}} modified files
- **Priority**: 🟡 MEDIUM
- **Time**: 15-20 min
- **Test Command**: {{test_command}}
- **Expected Result**: All tests pass
- **프롬프트**:
  ```
  {{test_prompt}}
  ```

### Option 4: Update Documentation
- **Task**: Update documentation for recent changes
- **Priority**: 🟢 LOW
- **Time**: 20-30 min
- **Files to Update**: {{docs_to_update}}
- **프롬프트**:
  ```
  {{docs_prompt}}
  ```

---

## 📚 References (완전판)

### Git References
- **Branch**: `{{branch}}`
- **Base Branch**: `{{base_branch}}`
- **Ahead/Behind**: {{git_ahead}}/{{git_behind}}
- **Recent Commits**:
  ```bash
  git log --oneline -10
  ```
- **Diff since divergence**:
  ```bash
  git diff {{base_branch}}...HEAD
  ```
- **Uncommitted changes**:
  ```bash
  git status
  ```

### Documentation Links
{{#if docs_links}}
{{#each docs_links}}
- [{{title}}]({{url}}) - {{description}}
{{/each}}
{{else}}
See project README.md
{{/if}}

### External Resources
{{#if external_resources}}
{{#each external_resources}}
- [{{title}}]({{url}}) - {{description}}
{{/each}}
{{else}}
None
{{/if}}

### Related PRs/Issues
{{#if related_prs}}
**Pull Requests**:
{{#each related_prs}}
- [#{{number}}]({{url}}): {{title}} ({{status}})
{{/each}}
{{/if}}

{{#if related_issues}}
**Issues**:
{{#each related_issues}}
- [#{{number}}]({{url}}): {{title}} ({{status}})
{{/each}}
{{/if}}

### Serena Memories
{{#if serena_memories}}
Recent memories related to this session:
{{#each serena_memories}}
- `{{filename}}` ({{created_date}})
  - Topic: {{topic}}
  - Relevance: {{relevance}}
{{/each}}
{{else}}
None
{{/if}}

---

## 🔄 Session Continuity Info

**Previous Session**:
- File: `{{previous_session_file}}`
- Date: {{previous_session_date}}
- Summary: {{previous_session_summary}}

**Next Session Recommendations**:
{{#if next_session_recommendations}}
{{#each next_session_recommendations}}
- {{recommendation}}
{{/each}}
{{else}}
Continue with Option 1 (Resume Last Task)
{{/if}}

---

## 🏷️ Metadata

- **Session ID**: {{session_id}}
- **Template**: Full (high complexity)
- **Complexity Score**: {{complexity_score}}/8
- **Created**: {{timestamp}}
- **Session Duration**: {{session_duration}}
- **Claude Code Version**: {{claude_code_version}}
- **skill version**: session-continuity {{skill_version}}

---

📝 **End of Session Handoff Document**

For lighter sessions, use:
- Minimal template (complexity 0-4)
- Hybrid template (complexity 5-6)

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
- **Next Task**: {{next_task}}
- **Estimated Time**: {{estimated_time}}
- **Quick Start**: Option 1 권장

---

## 📊 Pending Decisions

{{#if pending_decisions}}
{{#each pending_decisions}}
### {{title}}

**Options**:
{{#each options}}
- **{{label}}**: {{description}}
{{/each}}

**Recommendation**: {{recommendation}}
{{#if deadline}}
**Deadline**: {{deadline}}
{{/if}}

---
{{/each}}
{{else}}
✅ No pending decisions - ready to proceed
{{/if}}

---

## 🚀 Next Actions (Immediate)

{{#if immediate_actions}}
{{#each immediate_actions}}
{{add index 1}}. {{content}}
{{/each}}
{{else}}
See Quick Start options below
{{/if}}

---

## 🎯 Quick Start

### Option 1: Resume Last Task ⭐ (Recommended)
- **Task**: {{next_task}}
- **Priority**: 🔴 HIGH
- **Time**: {{task_estimated_time}}
- **프롬프트**: "{{resume_prompt}}"

### Option 2: {{alternative_title}}
- **Task**: {{alternative_task}}
- **Priority**: 🟡 MEDIUM
- **Time**: {{alternative_time}}
- **프롬프트**: "{{alternative_prompt}}"

### Option 3: Custom Task
- **Task**: Describe your custom task
- **Priority**: 🟢 LOW
- **Time**: Variable
- **프롬프트**: "Tell me what you want to work on"

---

📝 **Note**: This is a minimal session handoff. For more details, see:
- Files Modified: `git status`
- Recent Commits: `git log --oneline -5`
- Active Skills: `.claude/skills/*/skill.md`

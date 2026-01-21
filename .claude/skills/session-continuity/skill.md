---
name: session-continuity
version: 2.2.0
type: atomic
description: Template and guidelines for efficient session handoffs in MCP Management System. Focus on current state, pending decisions, and next actions while avoiding repetition of methodologies already in skills. Use when ending a session or preparing NEXT_SESSION.md.
auto_load: true
subagent_compatible: false
permission_mode: "allow"
tags:
  - session
  - handoff
  - continuity
  - next-session
  - documentation
mcp_dependencies: {}
compatible_templates:
  - all
triggers:
  - session handoff
  - next session
  - session continuity
  - end session
  - prepare handoff
capabilities:
  - session_state_capture
  - pending_decisions_tracking
  - next_actions_planning
---

# Session Continuity Template

Efficient session handoff leveraging Skills for methodologies.

## Core Principle

```
DON'T REPEAT WHAT'S IN SKILLS ❌
ONLY DOCUMENT WHAT CHANGES ✅
```

**In Skills (permanent)**: Methodologies, Workflows, Checklists, MCP guides
**In NEXT_SESSION.md (dynamic)**: Current state, Pending decisions, Next actions, Data locations

## Token Efficiency

| Approach | Tokens/Session | 10 Sessions |
|----------|---------------|-------------|
| Traditional | 3,200 | 32,000 |
| **Skills-Based** | 350 | 3,500 |
| **Savings** | **90%** | **28,500** |

## NEXT_SESSION.md Structure

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

## Checklist

**Include ✅**: Current state, Pending decisions, Next actions, Data locations, EXECUTION GUARD
**Exclude ❌**: Methodologies, Workflows, Checklists, MCP guides (all in Skills)

---

**Detailed template and examples**: See `prompt.md`

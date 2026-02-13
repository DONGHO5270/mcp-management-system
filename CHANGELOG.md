# Changelog

All notable changes to MCP Management System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.7.0] - 2026-02-13

### 🎯 Highlights
- **agent-council**: New 5-Persona expert panel skill (Architect/CFO/DevOps/Security/PM)
- **3 New Hooks**: task-completed, teammate-idle, session-end (-98% token savings)
- **.mcp.json.example**: Full 15-service configuration (was 6)
- **Claude Code 2.1.33+** compatibility updates across skills

### Added
- **agent-council** skill v2.0.0 - 5-persona collaborative reasoning with 3-round discussion
  - Team Attention concept implementation
  - Agent Teams compatible (Claude Code 2.1.32+)
  - Token budget: 800-1200 tokens
- **task-completed** hook - Auto-collects metrics on agent task completion
- **teammate-idle** hook - Detects idle agents in Agent Teams
- **session-end** hook - Lightweight session summary (-98% token reduction: 140k → 1-5k)
- 9 new MCP service entries in `.mcp.json.example` (context7, code-context-provider, github, npm-sentinel, node-omnibus, python-toolbox, playwright, magic, mobile, supabase)

### Changed
- **Skills count**: 17 → 18 (agent-council added)
- **Hooks count**: 3 → 6 (3 new productivity hooks)
- **multidimensional-analysis** v3.5.0 → v4.1.0
  - Claude Code 2.1.33+ Task/Memory restrictions
  - Refined token budgets
- **decision-workflow** v2.9.0 → v3.1.0
  - Hybrid B+ modes (Quick/Deep)
  - Enhanced bias detection integration
- **implementation-workflow** v3.0.0 → v3.1.0
  - Claude Code 2.1.33+ compatible
  - Task restrictions defined
- **research-workflow** v3.0.0 → v3.1.0
  - Updated for new Claude Code compatibility
- **session-continuity** - Updated templates
- **mcp-selector** - Updated prompt.md
- **prd-auto-executor** - Updated skill.md
- **.gitignore** - Added patterns for MCP backups, Serena directories, analysis reports, temp files
- **CLAUDE.md** - Updated to v3.1 with agent-council, 6 hooks, new version numbers

### Technical Details
- All composite skills updated for Claude Code 2.1.33+ compatibility
- `.mcp.json.example` now includes all 15 MCP services with installation comments
- Hooks architecture expanded from safety-only to include productivity automation

---

## [3.6.0] - 2026-01-26

### 🎯 Highlights
- **Autocompacting Optimization**: skill.md files reduced by -92%, saving ~69 KB of context tokens per session
- **YAML-only skill.md**: All skill metadata separated from instructions (prompt.md auto-loaded on invocation)

### Changed
- **6 Atomic skill.md** files → YAML-only format
  - core-analysis: 3,279 → 683 bytes (-79%)
  - decision-engine: 3,984 → 719 bytes (-82%)
  - implementation-3wave: 4,726 → 678 bytes (-86%)
  - session-memory: 4,669 → 714 bytes (-85%)
  - git-safety: 3,305 → 529 bytes (-84%)
  - prd-tracker: 3,073 → 562 bytes (-82%)

- **4 Composite skill.md** files → minimal YAML
  - multidimensional-analysis: 15,656 → 944 bytes (-94%)
  - decision-workflow: 7,174 → 714 bytes (-90%)
  - frontend-design: 6,918 → 452 bytes (-93%)
  - research-workflow: 6,874 → 646 bytes (-91%)

### Added
- 6 new `prompt.md` files for Atomic skills (content extracted from skill.md)
- MCP verified status headers in composite prompt.md files

### Technical Details
- Claude Code auto-loads `prompt.md` when a skill is invoked via `Skill()` or `/skill-name`
- `skill.md` is always loaded at session start → smaller = less context consumption
- `prompt.md` is loaded on-demand → no impact on baseline context
- Total reduction: 13 files changed, -1,773 lines

---

## [3.5.1] - 2026-01-25

### 🎯 Highlights
- **Session Migration Context Retention**: 12% → 50%+ improvement
- **Task Result Size Limit**: Prevents token overconsumption in parent context

### Changed
- **multidimensional-analysis** v3.4.0 → v3.5.0
  - Level-based result size limits (Level 2: 1,500자 ~ Level 5: 3,000자)
  - 5-Task token consumption: 60,000+ → 12,500~25,000 (-58~79%)

- **implementation-workflow** v2.4.0 → v2.5.0
  - Fixed 2,000자 result size limit for all 4 Tasks
  - 4-Task token consumption: 48,000+ → 10,000 (-79%)

- **research-workflow** v2.8.0 → v2.9.0
  - Fixed 2,000자 result size limit for all 4 Tasks (Deep Mode)
  - Context occupancy: 28% → 6%

### Technical Details
- Task() results now return concise summaries to parent context
- Detailed analysis stored in Serena Memory
- Result format: Key findings + Conclusion + Confidence %

### Why This Matters
When using Task() for parallel analysis (W1 phase), each Task agent runs in a separate context but returns results to the parent context. Previously, full results (~15,000 chars each) were returned, consuming 35% of context and causing poor session migration retention (12%). With size limits, only essential findings are returned while preserving analysis quality.

---

## [3.5.0] - 2025-12-29

### Added
- W1 5-Task parallel execution specification
- Level-based Task count (Level 2: 3 Tasks ~ Level 5: 5 Tasks)

### Changed
- Explicit parallelization instructions in prompt.md
- Performance improvement: -40~60% execution time

---

## [3.4.0] - 2025-12-29

### Changed
- **Phase 2 Complete**: bias-detection permanent integration
- MCP operations: 48 → 40 (-8)
- Removed ethical-reasoning (value 3.0/5, replaced by clear-thought-1.5)

### Fixed
- Token optimization: Level 5 3800-5400 → 3800-5300 (-100 tokens)

---

## [3.0.0] - 2025-12-28

### Added
- Level selection system (Level 2-5)
- 5-Wave Workflow (W0-W4)
- Top-down design methodology

### Changed
- Token range: 1400-5400 (Level 2-5)
- Confidence range: 86-99.7%+

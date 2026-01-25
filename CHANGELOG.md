# Changelog

All notable changes to MCP Management System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

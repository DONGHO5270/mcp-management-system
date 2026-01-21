---
name: mcp-selector
version: 1.1.0
type: atomic
description: Helps select the most appropriate MCP service from the 15 available services in MCP Management System. Use when deciding which MCP service to use for a specific task or when comparing service capabilities.
auto_load: true
subagent_compatible: true
permission_mode: "allow"
tags:
  - mcp
  - service-selection
  - recommendation
  - capability-mapping
mcp_dependencies: {}
compatible_templates:
  - v5.5.8
triggers:
  - mcp selection
  - which mcp
  - choose service
  - mcp comparison
  - service capabilities
capabilities:
  - mcp_recommendation
  - task_type_mapping
  - capability_analysis
  - service_comparison
---

# MCP Service Selector

15개 MCP 서비스 선택 가이드.

## Service Categories

| Category | Services |
|----------|----------|
| **Analysis (7)** | clear-thought, clear-thought-1.5, sequential-thinking-tools, stochastic-thinking, context7, code-context-provider-mcp, model-enhancement-servers |
| **Development (4)** | github-mcp, npm-sentinel-mcp, node-omnibus-mcp, python-toolbox-mcp |
| **Automation (3)** | playwright-mcp, magic-mcp, mobile-mcp |
| **Backend (1)** | supabase-mcp |

## Decision Tree

```
Analysis? → clear-thought / sequential-thinking / stochastic
Code? → context7 / node-omnibus / python-toolbox / npm-sentinel
Automation? → playwright / mobile / magic / github
Backend? → supabase
```

## Quick Reference

| Service | Best For | Response | Token Cost |
|---------|----------|----------|------------|
| clear-thought | Deep analysis | Slow | Very Low |
| sequential-thinking | Structured plans | Fast | Low |
| stochastic-thinking | Risk analysis | Medium | Low |
| context7 | Code analysis | Fast | Medium |
| github-mcp | Git operations | Fast | Medium |
| playwright-mcp | Browser testing | Slow | High |

## When NOT to Use MCP

- Simple file ops → Read/Write/Edit tools
- Basic bash → Bash tool
- Quick search → Grep/Glob tools

---

**Detailed selection guide**: See `prompt.md`

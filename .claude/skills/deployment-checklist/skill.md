---
name: deployment-checklist
version: 2.0.0
type: composite
description: Comprehensive pre-deployment verification checklist for MCP Management System ensuring all 15 services are tested, documented, validated, and ready for production. Use before any deployment, PR creation, or release.
dependencies:
  - _atomic/session-memory
  - _atomic/git-safety
auto_load: true
subagent_compatible: false
permission_mode: "ask"
tags:
  - deployment
  - verification
  - quality-assurance
  - production-readiness
  - checklist
mcp_dependencies:
  clear-thought: "*"
  clear-thought-1.5: "*"
  sequential-thinking-tools: "*"
  stochastic-thinking: "*"
  context7: "*"
  code-context-provider-mcp: "*"
  model-enhancement-servers: "*"
  github-mcp: "*"
  npm-sentinel-mcp: "*"
  node-omnibus-mcp: "*"
  python-toolbox-mcp: "*"
  playwright-mcp: "*"
  magic-mcp: "*"
  mobile-mcp: "*"
  supabase-mcp: "*"
compatible_templates:
  - v5.5.8
triggers:
  - pre-deployment
  - deployment checklist
  - verify deployment
  - production readiness
  - release checklist
  - pre-release
capabilities:
  - mcp_service_verification
  - documentation_validation
  - integration_testing
  - production_readiness_check
  - release_validation
---

# MCP Management System Deployment Checklist

Pre-deployment verification to ensure safe, reliable deployments.

## Overview

**6 Verification Categories**:
1. MCP Services (15 total)
2. Configuration Files
3. Code Quality
4. Testing
5. Documentation
6. Security & Compatibility

## Deployment Types

| Type | When to Use | Check Level |
|------|-------------|-------------|
| **Hotfix** | Emergency, production down | Minimal (bug fix + rollback) |
| **Bug Fix** | Standard bug fix | Standard (affected area + regression) |
| **Feature** | New feature | Full (all checks + performance) |
| **Major Release** | Breaking changes, v2.0 | Comprehensive (full + security audit) |

## Confidence Levels

| Score | Decision | Action |
|-------|----------|--------|
| ≥90% | ✅ DEPLOY | All checks passed, safe to deploy |
| ≥70% | ⚠️ MONITOR | Deploy with close monitoring |
| ≥50% | ⚠️ STAGING | Deploy to staging first |
| <50% | ❌ BLOCK | Do not deploy, more work needed |

## Quick Commands

```bash
# Full verification
node test-all-15-services.cjs && npm test && node -c .mcp.json

# Rollback
git revert [bad-commit]
```

---

**Detailed execution guide**: See `prompt.md`

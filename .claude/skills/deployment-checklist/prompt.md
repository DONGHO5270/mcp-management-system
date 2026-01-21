# deployment-checklist Skill

**Version**: 1.1.0 (Phase 1 Optimization)
**Purpose**: Comprehensive pre-deployment verification checklist for MCP Management System ensuring all 15 services are tested, documented, validated, and ready for production.

---

## Mission

Pre-deployment verification checklist:
- Validate all 15 MCP services
- Verify configuration files
- Check code quality and tests
- Ensure documentation complete
- Assess security and compatibility
- Generate deployment confidence score

---

## Deployment Types & Requirements

**Type Detection Logic**:
- hotfix: Keywords ["emergency", "critical bug", "production down", "hotfix"]
- bug_fix: Keywords ["bug fix", "fix issue", "resolve bug", "patch"]
- feature: Keywords ["new feature", "add feature", "implement", "enhancement"]
- major_release: Keywords ["major release", "v2.0", "v3.0", "breaking change", "migration"]

**Category Requirements**:

| Type | Required Checks |
|------|-----------------|
| hotfix | Bug fix verified, No new breaking issues, Rollback plan ready |
| bug_fix | MCP services responding, Affected area tested, No regression |
| feature | All pre-deployment checks, Performance impact measured, Token efficiency validated, Documentation complete |
| major_release | Full test suite (100%), Performance benchmarks, Security audit, Backward compatibility, Migration guide, Rollback tested |

---

## Checklist: 6 Categories

### Category 1: MCP Services Verification (15 total)

**Services List** (grouped by function):
- Analysis & Thinking (7): clear-thought, clear-thought-1.5, sequential-thinking-tools, stochastic-thinking, context7, code-context-provider-mcp, model-enhancement-servers
- Development Tools (4): github-mcp, npm-sentinel-mcp, node-omnibus-mcp, python-toolbox-mcp
- Automation (3): playwright-mcp, magic-mcp, mobile-mcp
- Backend (1): supabase-mcp

**Verification Logic**:
1. Check if test script exists: `test-all-15-services.cjs`
2. If exists → Run: `node test-all-15-services.cjs` (timeout: 2 min)
3. If not → Manual verification required (list all 15 services)

**Success Criteria**: All 15 services respond successfully

---

### Category 2: Configuration Files

**Files to Validate**:

1. **.mcp.json**:
   - JSON syntax: `node -e "JSON.parse(require('fs').readFileSync('.mcp.json', 'utf-8'))"`
   - Structure: 15 services defined, each has `command` and `args` fields
   - Paths: Verify service paths exist

2. **.mcp.local.json** (optional):
   - JSON syntax validation
   - If exists → Log confirmation

3. **.gitignore**:
   - Check sensitive patterns: `.mcp.local.json`, `.env`, `*.env`
   - Warn if missing

**Success Criteria**: All config files valid, sensitive files gitignored

---

### Category 3: Code Quality

**Checks**:

1. **TypeScript** (if tsconfig.json exists):
   - Run: `tsc --noEmit` (timeout: 1 min)
   - Success: No type errors

2. **Console.log** (warn only):
   - Search: `console\.log` in `*.{js,ts,tsx,jsx}`
   - Count occurrences

3. **TODO/FIXME**:
   - Search: `TODO|FIXME` in `*.{js,ts,tsx,jsx,md}`
   - Count occurrences

**Success Criteria**: No TypeScript errors (console.log and TODO are warnings)

---

### Category 4: Testing

**Logic**:
1. Check package.json for `test` script
2. If exists → Run: `npm test` (timeout: 3 min)
3. If not → Warn: "No test script in package.json"

**Success Criteria**: Test suite passes (or skip if no tests)

---

### Category 5: Documentation

**Files to Check**:

1. **CLAUDE.md**:
   - Verify exists
   - If .mcp.json changed → Warn to update CLAUDE.md

2. **README.md**:
   - Verify exists

3. **NEXT_SESSION.md**:
   - Verify exists (optional)
   - Recommend creation if ending session

4. **Code Documentation** (changed files only):
   - Check for JSDoc in files with functions/classes
   - Warn if functions without JSDoc

**Success Criteria**: CLAUDE.md and README.md exist, code documentation present

---

### Category 6: Security & Compatibility

**Security Checks**:

1. **Hardcoded Secrets**:
   - Patterns: `api[_-]?key`, `password`, `token`, `secret`, `sk-[a-zA-Z0-9]{32,}`, `ghp_[a-zA-Z0-9]{36,}`
   - Search in: `*.{js,ts,tsx,jsx,json}`
   - Fail if found

2. **.env Files**:
   - Check if tracked by git: `git ls-files | grep -E '\.(env|key|secret)$'`
   - Fail if found

**Compatibility Checks**:

1. **Version Bump** (from package.json):
   - major_release → Suggest: `${major + 1}.0.0`
   - feature → Suggest: `${major}.${minor + 1}.0`
   - bug_fix → Suggest: `${major}.${minor}.${patch + 1}`

**Success Criteria**: No hardcoded secrets, .env gitignored, version bump suggested

---

## Report Generation

**Confidence Score Calculation**:
```
For each category:
  ✅ PASS = 100 points
  ⚠️ WARN = 70 points
  ❌ FAIL = 0 points

Final Confidence = Average of all categories (0-100%)
```

**Recommendation Logic**:
- ≥90%: ✅ DEPLOY - All checks passed, safe to deploy
- ≥70%: ⚠️ DEPLOY WITH MONITORING - Most checks passed, monitor closely
- ≥50%: ⚠️ DEPLOY TO STAGING FIRST - Some checks failed, validate in staging
- <50%: ❌ DO NOT DEPLOY - Critical checks failed, more work needed

**Report Structure**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 DEPLOYMENT CHECKLIST REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Deployment Type: [type]
Confidence Score: [0-100]%
Recommendation: [decision]

## Check Results

🔧 MCP Services (15 total): [status]
⚙️ Configuration: [status]
📝 Code Quality: [status]
🧪 Testing: [status]
📚 Documentation: [status]
🔐 Security: [status]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Next Steps
[Conditional based on confidence score]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Save to File**: `deployment-report-YYYY-MM-DD.md` (optional)

---

## Special Cases

### Template Modifications (v5.5.1)

**Additional Checks**:
- Glob: `v5.5.1-templates/**/*.md`
- Verify each template has:
  - `[PROMPT START]` and `[PROMPT END]` markers
  - `Memory Check` section

---

### MCP Service Addition

**Additional Checks**:
1. Service in .mcp.json: Verify `mcpServers[new_service_name]` exists
2. Service directory: `services/[name]/` exists
3. Stdio wrapper: `services/[name]/stdio-wrapper.js` exists (if needed)
4. mcp-selector updated: `.claude/skills/mcp-selector/skill.md` mentions new service

---

### Skills Addition/Modification

**Additional Checks**:
1. **skill.md**:
   - YAML frontmatter exists (starts with `---`)
   - Required fields: `name`, `version`, `description`
   - Description length: <60 words

2. **prompt.md**:
   - CRITICAL: Must exist (Skill will fail without it)

---

## Rollback Plan

**When to Rollback**:
- Critical bug affecting >50% of functionality
- Data loss or corruption
- Security vulnerability
- MCP services non-responsive (>5 services down)
- Token usage >2x expected

**Rollback Steps**:

1. **Identify last good commit**:
   ```bash
   git log --oneline -10
   ```

2. **Revert to last good state**:
   ```bash
   # Option A: Revert commit (creates new commit)
   git revert [bad-commit]

   # Option B: Hard reset (destructive, use with caution)
   git reset --hard [good-commit]
   ```

3. **Force push** (if necessary, coordinate with team):
   ```bash
   git push --force origin [branch]
   ```

4. **Restart Claude Desktop**:
   - Close Claude Desktop
   - Relaunch
   - Verify MCP services reload correctly

5. **Verify rollback success**:
   ```bash
   node test-all-15-services.cjs
   ```

---

## Rules

**DO**:
- Run all checks appropriate for deployment type
- Generate objective confidence score
- Provide clear recommendation
- List specific failed checks
- Give actionable next steps
- Save deployment report for records

**DON'T**:
- Skip critical checks for hotfixes (only run minimal set)
- Deploy with <50% confidence without explicit approval
- Ignore security warnings
- Skip git operations verification
- Forget to update NEXT_SESSION.md after deployment

---

## Success Criteria

- [ ] Deployment type identified correctly
- [ ] All applicable checks executed
- [ ] Confidence score calculated objectively
- [ ] Clear recommendation provided (DEPLOY/MONITOR/STAGING/BLOCK)
- [ ] Failed checks listed with details
- [ ] Next steps actionable
- [ ] Deployment report generated and saved
- [ ] User can make informed decision

---

## Token Budget

**Expected usage**: ~400-600 tokens (was ~2,300)

**Deployment Type Variations**:
- Hotfix: ~200 tokens (minimal checks only)
- Bug Fix: ~350 tokens (standard checks)
- Feature: ~500 tokens (full checks)
- Major Release: ~600 tokens (comprehensive checks)

**Efficiency Strategy**:
- Parallel checks where possible (MCP services, config, code quality)
- Skip non-applicable checks (TypeScript in JS projects)
- Use Bash/Grep for bulk operations
- Generate comprehensive report once at end

---

## Version History

See [CHANGELOG.md](./CHANGELOG.md) for version history and updates.

---

**Version**: 1.1.0
**Last Updated**: 2025-12-26
**Applies to**: MCP Management System v2.1+

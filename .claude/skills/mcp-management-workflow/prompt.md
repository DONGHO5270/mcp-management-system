# MCP Management System Development Workflow (Executable)

**Version**: 2.1.0
**Pattern**: Linear Sequential Workflow Guide
**Purpose**: Complete development workflow for MCP Management System v2.1 with 15 services

---

## Mission

Provide step-by-step workflow guidance for MCP Management System development:
- **Phase 0-5**: Standard development cycle
- **Workflows A-D**: Scenario-specific shortcuts
- **Session Management**: Start/end procedures
- **Troubleshooting**: Common issue resolution

---

## Step 0: Understand Current Task and Context

```javascript
// 1. Identify task type from user request
const user_request = "[user's task description]";

console.log(`🎯 Task: ${user_request}`);

// 2. Categorize task
const task_categories = {
  bug_fix: ["fix", "bug", "error", "issue", "broken", "crash"],
  feature: ["feature", "add", "implement", "create", "new functionality"],
  template: ["template", "modify template", "serena", "memory check", "token efficiency"],
  mcp_service: ["mcp service", "add service", "integrate", "new mcp", "service connection"],
  analysis: ["analyze", "review", "evaluate", "assess", "investigate"],
  documentation: ["document", "readme", "claude.md", "guide", "docs"],
  deployment: ["deploy", "release", "publish", "pr", "pull request"]
};

let detected_category = "general"; // Default

for (const [category, keywords] of Object.entries(task_categories)) {
  const has_match = keywords.some(kw => user_request.toLowerCase().includes(kw));

  if (has_match) {
    detected_category = category;
    break; // First match wins
  }
}

console.log(`\n📊 Task Category: ${detected_category}`);

// 3. Check current state
console.log(`\n📁 Current State Check:`);

try {
  const next_session_path = "C:\\claude-development\\mcp-management\\NEXT_SESSION.md";
  const next_session_content = Read({ file_path: next_session_path });

  console.log(`✅ NEXT_SESSION.md found - Session continuity available`);

  // Extract current branch, last work, pending decisions
  const branch_match = next_session_content.match(/\*\*Branch\*\*:\s*(.+)/);
  const last_work_match = next_session_content.match(/\*\*Last Work\*\*:\s*(.+)/);

  if (branch_match) {
    console.log(`  - Branch: ${branch_match[1]}`);
  }

  if (last_work_match) {
    console.log(`  - Last Work: ${last_work_match[1]}`);
  }
} catch (error) {
  console.log(`ℹ️ NEXT_SESSION.md not found - Starting fresh session`);
}

// 4. Verify MCP system health (optional - only if task requires MCP)
if (["feature", "template", "mcp_service", "analysis"].includes(detected_category)) {
  console.log(`\n🔧 MCP System Health Check:`);
  console.log(`  - .mcp.json: ${fileExists("C:\\claude-development\\mcp-management\\.mcp.json") ? "✅" : "❌"}`);
  console.log(`  - mcp-bridge.cjs: ${fileExists("C:\\claude-development\\mcp-management\\mcp-bridge.cjs") ? "✅" : "❌"}`);
  console.log(`  - 15 services configured: Use 'node mcp-bridge.cjs check all' to verify`);
}
```

**Helper Function**:
```javascript
function fileExists(path) {
  try {
    Read({ file_path: path, limit: 1 });
    return true;
  } catch {
    return false;
  }
}
```

---

## Step 1: Select Appropriate Workflow

Based on detected task category, select the most efficient workflow path.

### Workflow Selection Logic

```javascript
let selected_workflow = null;
let workflow_steps = [];

switch (detected_category) {
  case "bug_fix":
    selected_workflow = "Workflow A: Quick Bug Fix";
    workflow_steps = [
      "1. Identify issue location (no Phase 0 needed for simple bugs)",
      "2. Fix code with minimal changes",
      "3. Test affected area only",
      "4. Commit with 'fix:' prefix",
      "5. Deploy (skip full checklist if low-risk)"
    ];
    console.log(`\n🚀 Selected: ${selected_workflow}`);
    console.log(`\n**Estimated Time**: 15-30 minutes`);
    console.log(`**Complexity**: Low`);
    console.log(`**Risk**: Low (isolated change)`);
    break;

  case "feature":
    selected_workflow = "Workflow B: Feature Addition";
    workflow_steps = [
      "1. Phase 0 analysis (use phase0-analysis skill)",
      "2. MCP service selection (use mcp-selector skill)",
      "3. Implementation with TDD (if applicable)",
      "4. Full testing suite (unit + integration)",
      "5. Documentation (CLAUDE.md, README.md if needed)",
      "6. Pre-deployment checklist (use deployment-checklist skill)",
      "7. Deploy with PR"
    ];
    console.log(`\n🚀 Selected: ${selected_workflow}`);
    console.log(`\n**Estimated Time**: 2-4 hours`);
    console.log(`**Complexity**: Medium-High`);
    console.log(`**Risk**: Medium (requires full validation)`);
    break;

  case "template":
    selected_workflow = "Workflow C: Template Modification";
    workflow_steps = [
      "1. Phase 0: Analyze token efficiency impact",
      "2. Open template in v5.5.1-templates/",
      "3. Identify modification points: Memory Check, Phase 0, Serena calls",
      "4. Apply modifications preserving structure",
      "5. Test with actual prompts (before/after comparison)",
      "6. Measure token usage (target: >= 70% confidence)",
      "7. Document savings and deploy"
    ];
    console.log(`\n🚀 Selected: ${selected_workflow}`);
    console.log(`\n**Estimated Time**: 45-90 minutes`);
    console.log(`**Complexity**: Medium`);
    console.log(`**Risk**: Medium (token efficiency validation required)`);
    break;

  case "mcp_service":
    selected_workflow = "Workflow D: MCP Service Addition";
    workflow_steps = [
      "1. Phase 0: Evaluate necessity (vs existing 15 services)",
      "2. Implement service (or configure existing)",
      "3. Add to .mcp.json with proper env vars",
      "4. Test connection: node mcp-bridge.cjs [service] test",
      "5. Update mcp-selector skill (if new category)",
      "6. Update CLAUDE.md MCP Services section",
      "7. Deploy and monitor"
    ];
    console.log(`\n🚀 Selected: ${selected_workflow}`);
    console.log(`\n**Estimated Time**: 1-2 hours`);
    console.log(`**Complexity**: Medium-High`);
    console.log(`**Risk**: Medium-High (system-wide impact)`);
    break;

  case "analysis":
  case "documentation":
  case "deployment":
  case "general":
  default:
    selected_workflow = "Standard Phase 0-5 Cycle";
    workflow_steps = [
      "Phase 0: Analysis & Planning (use phase0-analysis skill)",
      "Phase 1: MCP Service Selection (use mcp-selector skill)",
      "Phase 2: Implementation",
      "Phase 3: Testing (node test-all-15-services.cjs)",
      "Phase 4: Documentation",
      "Phase 5: Deployment (use deployment-checklist skill)"
    ];
    console.log(`\n🚀 Selected: ${selected_workflow}`);
    console.log(`\n**Estimated Time**: Varies (2-8 hours depending on scope)`);
    console.log(`**Complexity**: Variable`);
    console.log(`**Risk**: Depends on phase completion`);
    break;
}

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`## Workflow Steps`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

workflow_steps.forEach((step, index) => {
  console.log(`\n${step}`);
});
```

---

## Step 2: Execute Selected Workflow

### Phase-Based Execution (for Standard Cycle or Feature Addition)

#### Phase 0: Analysis & Planning

```javascript
console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`## Phase 0: Analysis & Planning`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

console.log(`\n**Action Required**: Use phase0-analysis skill for cognitive enhancement`);
console.log(`\nSuggested prompt for phase0-analysis:`);
console.log(`\`\`\`\n/phase0-analysis "${user_request}"\n\`\`\``);

console.log(`\n**What Phase 0 Provides**:`);
console.log(`- Sequential Thinking: Break down problem into steps`);
console.log(`- First Principles: Analyze from fundamentals`);
console.log(`- Systems Thinking: Consider component interactions`);
console.log(`- Stochastic Analysis: Evaluate probabilities and risks`);
console.log(`- Bias Detection: Check for cognitive traps`);

console.log(`\n**Expected Output**:`);
console.log(`- Structured analysis with confidence levels`);
console.log(`- Risk assessment (High/Medium/Low)`);
console.log(`- Recommended approach with rationale`);
console.log(`- Baseline saved to Serena Memory (if available)`);

console.log(`\n⏸️ **CHECKPOINT**: Complete Phase 0 before proceeding to Phase 1`);
```

#### Phase 1: MCP Service Selection

```javascript
console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`## Phase 1: MCP Service Selection`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

console.log(`\n**Action Required**: Use mcp-selector skill to choose MCP services`);
console.log(`\nSuggested prompt for mcp-selector:`);
console.log(`\`\`\`\n/mcp-selector "${user_request}"\n\`\`\``);

console.log(`\n**What MCP Selector Provides**:`);
console.log(`- Task categorization (analysis/code/automation/backend)`);
console.log(`- Top 3 recommended services with rationale`);
console.log(`- Performance characteristics (token cost, response time)`);
console.log(`- Usage examples (direct + indirect calls)`);
console.log(`- Service chain recommendations (if applicable)`);

console.log(`\n**Service Availability Check**:`);
console.log(`\`\`\`bash`);
console.log(`# Verify all 15 services are responding`);
console.log(`node "C:\\claude-development\\mcp-management\\mcp-bridge.cjs" check all`);
console.log(`\`\`\``);

console.log(`\n**Configuration Validation**:`);
console.log(`- .mcp.json: Base configuration (15 services)`);
console.log(`- .mcp.local.json: Project-specific overrides (optional)`);
console.log(`- Merged config: Final runtime configuration`);

console.log(`\n⏸️ **CHECKPOINT**: Verify selected services before implementation`);
```

#### Phase 2: Implementation

```javascript
console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`## Phase 2: Implementation`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

// Implementation guidance based on task category
if (detected_category === "feature") {
  console.log(`\n**Feature Implementation**:`);
  console.log(`\n1. Create feature branch:`);
  console.log(`   \`\`\`bash`);
  console.log(`   git checkout -b feature/[name]`);
  console.log(`   \`\`\``);

  console.log(`\n2. Follow TDD (Test-Driven Development) if applicable:`);
  console.log(`   - Write failing test first`);
  console.log(`   - Implement minimal code to pass`);
  console.log(`   - Refactor for quality`);
  console.log(`   - Repeat`);

  console.log(`\n3. TypeScript conventions:`);
  console.log(`   - Use strict mode`);
  console.log(`   - Prefer interfaces over types (for extensibility)`);
  console.log(`   - Explicit return types for public functions`);
  console.log(`   - Meaningful variable names (avoid abbreviations)`);

  console.log(`\n4. Test incrementally:`);
  console.log(`   - Unit tests: Individual functions/classes`);
  console.log(`   - Integration tests: Component interactions`);
  console.log(`   - E2E tests: Full user workflows (if UI)`);

} else if (detected_category === "template") {
  console.log(`\n**Template Modification**:`);
  console.log(`\n1. Open template file:`);
  console.log(`   - Location: v5.5.1-templates/`);
  console.log(`   - Pattern: XX_[WORKFLOW]_[MODE].md`);
  console.log(`   - Examples: 03_DECISION_UNIFIED.md, 04_IMPLEMENTATION_UNIFIED.md`);

  console.log(`\n2. Identify modification points:`);
  console.log(`   - **Memory Check sections**: Add Serena find_symbol/find_memory calls`);
  console.log(`   - **Phase 0 integration**: Ensure consistent cognitive framework`);
  console.log(`   - **Conditional execution**: S1 vs S2+ logic (coverage >= 70%)`);

  console.log(`\n3. Apply modifications preserving structure:`);
  console.log(`   \`\`\`markdown`);
  console.log(`   # Template Structure (DO NOT CHANGE)`);
  console.log(`   [PROMPT START]`);
  console.log(`   ## Memory Check → ADD: Serena find_symbol/find_memory`);
  console.log(`   ## Phase 0 Analysis → ENSURE: Consistency with phase0-analysis skill`);
  console.log(`   ## Phase 1 Execution → UPDATE: Task descriptions if needed`);
  console.log(`   [PROMPT END]`);
  console.log(`   \`\`\``);

  console.log(`\n4. Token efficiency preservation:`);
  console.log(`   - Keep prompts concise (avoid redundancy)`);
  console.log(`   - Use Progressive Disclosure (simple first, complexity if needed)`);
  console.log(`   - Reference skills instead of repeating methodologies`);
  console.log(`   - Target: S1 < 800 tokens, S2+ < 200 tokens`);

} else if (detected_category === "mcp_service") {
  console.log(`\n**MCP Service Integration**:`);
  console.log(`\n1. Add service to .mcp.json:`);
  console.log(`   \`\`\`json`);
  console.log(`   {`);
  console.log(`     "mcpServers": {`);
  console.log(`       "new-service": {`);
  console.log(`         "command": "node",`);
  console.log(`         "args": ["./services/new-service/index.js"],`);
  console.log(`         "env": {`);
  console.log(`           "DEBUG": "false",`);
  console.log(`           "MAX_RETRIES": "3"`);
  console.log(`         },`);
  console.log(`         "type": "stdio"`);
  console.log(`       }`);
  console.log(`     }`);
  console.log(`   }`);
  console.log(`   \`\`\``);

  console.log(`\n2. Test service independently:`);
  console.log(`   \`\`\`bash`);
  console.log(`   # Direct test`);
  console.log(`   node ./services/new-service/index.js`);
  console.log(`   `);
  console.log(`   # Bridge test`);
  console.log(`   node mcp-bridge.cjs new-service test`);
  console.log(`   \`\`\``);

  console.log(`\n3. Create stdio-wrapper (if needed):`);
  console.log(`   - Purpose: Normalize input/output for Claude Code`);
  console.log(`   - Template: services/[existing-service]/stdio-wrapper.js`);
  console.log(`   - Must handle: stdin JSON → service call → stdout JSON`);

  console.log(`\n4. Update documentation:`);
  console.log(`   - CLAUDE.md: Add to "🔧 MCP Management System" section`);
  console.log(`   - mcp-selector skill: Add to appropriate category`);
  console.log(`   - README.md: Update service count (15 → 16)`);

} else {
  console.log(`\n**General Implementation Guidance**:`);
  console.log(`- Follow existing code patterns in the project`);
  console.log(`- Write self-documenting code (meaningful names)`);
  console.log(`- Add comments only for complex logic`);
  console.log(`- Test as you go (don't accumulate untested code)`);
  console.log(`- Commit frequently with clear messages`);
}

console.log(`\n⏸️ **CHECKPOINT**: Implementation complete before testing`);
```

#### Phase 3: Testing

```javascript
console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`## Phase 3: Testing`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

console.log(`\n**Testing Checklist**:`);
const testing_checklist = [
  { item: "Unit tests pass (if applicable)", critical: false },
  { item: "Integration tests pass", critical: true },
  { item: "All 15 MCP services responding", critical: true },
  { item: "Token efficiency validated", critical: true },
  { item: "No regression in existing features", critical: true },
  { item: "Error rate < 5%", critical: true }
];

testing_checklist.forEach(check => {
  const marker = check.critical ? "🔴" : "🟡";
  console.log(`${marker} [ ] ${check.item}`);
});

console.log(`\n**MCP System Testing**:`);
console.log(`\`\`\`bash`);
console.log(`# Test all 15 services (comprehensive)`);
console.log(`node test-all-15-services.cjs`);
console.log(``);
console.log(`# Test specific service (quick validation)`);
console.log(`node test-clear-thought-1.5.cjs`);
console.log(`node test-stochastic-thinking.cjs`);
console.log(``);
console.log(`# Verify bridge functionality`);
console.log(`node mcp-bridge.cjs check all`);
console.log(`\`\`\``);

console.log(`\n**Expected Test Results**:`);
console.log(`- ✅ All services: Responding within 5 seconds`);
console.log(`- ✅ Token usage: Within expected range (baseline ± 10%)`);
console.log(`- ✅ Error rate: < 5% (transient failures acceptable)`);
console.log(`- ✅ No console errors (warnings acceptable)`);

console.log(`\n**Token Efficiency Validation** (for template changes):`);
console.log(`\`\`\`bash`);
console.log(`# Measure before modification`);
console.log(`node measure-token-usage.cjs --template [name] --baseline`);
console.log(``);
console.log(`# Measure after modification`);
console.log(`node measure-token-usage.cjs --template [name] --compare`);
console.log(``);
console.log(`# Expected: >= 70% confidence in improvement`);
console.log(`\`\`\``);

console.log(`\n⚠️ **If Tests Fail**:`);
console.log(`1. Review error messages (check logs)`);
console.log(`2. Test in isolation (single service/feature)`);
console.log(`3. Check configuration (.mcp.json syntax)`);
console.log(`4. Revert if critical failure (git reset --hard)`);
console.log(`5. Fix incrementally and re-test`);

console.log(`\n⏸️ **CHECKPOINT**: All critical tests passing before documentation`);
```

#### Phase 4: Documentation

```javascript
console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`## Phase 4: Documentation`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

console.log(`\n**Required Documentation** (depending on change scope):`);

const doc_requirements = [
  {
    file: "Code Comments",
    when: "Complex logic only (avoid obvious comments)",
    example: "// Recursive backtracking with memoization for O(n) → O(log n)"
  },
  {
    file: "CLAUDE.md",
    when: "MCP usage changed or new MCP service added",
    example: "Update '🔧 MCP Management System' section with new service"
  },
  {
    file: "README.md",
    when: "User-facing changes or new features",
    example: "Update Quick Start section or feature list"
  },
  {
    file: "NEXT_SESSION.md",
    when: "Session ending (always)",
    example: "Brief summary for continuity (use session-continuity skill)"
  }
];

doc_requirements.forEach(doc => {
  console.log(`\n**${doc.file}**:`);
  console.log(`  - When: ${doc.when}`);
  console.log(`  - Example: ${doc.example}`);
});

console.log(`\n**Documentation Template** (for significant changes):`);
console.log(`\`\`\`markdown`);
console.log(`## Feature: [Name]`);
console.log(``);
console.log(`### What Changed`);
console.log(`- File: [path]`);
console.log(`- Services used: [MCP services, if any]`);
console.log(`- Token impact: [+/- X%, if applicable]`);
console.log(``);
console.log(`### Why`);
console.log(`- Problem: [description]`);
console.log(`- Solution: [approach]`);
console.log(`- Alternatives considered: [list]`);
console.log(``);
console.log(`### How to Use`);
console.log(`[usage examples]`);
console.log(``);
console.log(`### Next Steps`);
console.log(`[follow-up tasks, if any]`);
console.log(`\`\`\``);

console.log(`\n**Token Efficiency Principle for Documentation**:`);
console.log(`- ✅ DO: Document decisions and state`);
console.log(`- ✅ DO: Reference skills for methodologies`);
console.log(`- ❌ DON'T: Repeat workflow steps (in skills)`);
console.log(`- ❌ DON'T: Copy-paste checklists (in skills)`);
console.log(`- ❌ DON'T: Duplicate MCP service guide (in mcp-selector)`);

console.log(`\n⏸️ **CHECKPOINT**: Documentation complete before deployment`);
```

#### Phase 5: Deployment

```javascript
console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`## Phase 5: Deployment`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

console.log(`\n**Pre-Deployment Validation**:`);
console.log(`\`\`\`\n/deployment-checklist\n\`\`\``);
console.log(`\n(This skill will verify all 15 services, tests, and configuration)`);

console.log(`\n**Deployment Process**:`);
console.log(`\n1. Create commit with conventional format:`);
console.log(`   \`\`\`bash`);
console.log(`   git add [files]`);
console.log(`   git commit -m "feat: [description]`);
console.log(``);
console.log(`   - [change 1]`);
console.log(`   - [change 2]`);
console.log(``);
console.log(`   🤖 Generated with Claude Code`);
console.log(`   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"`);
console.log(`   \`\`\``);

console.log(`\n   **Commit Prefix Guide**:`);
console.log(`   - feat: New feature`);
console.log(`   - fix: Bug fix`);
console.log(`   - docs: Documentation only`);
console.log(`   - refactor: Code change (no behavior change)`);
console.log(`   - test: Adding/updating tests`);
console.log(`   - chore: Maintenance (dependencies, config)`);

console.log(`\n2. Push to remote:`);
console.log(`   \`\`\`bash`);
console.log(`   git push origin [branch]`);
console.log(`   \`\`\``);

console.log(`\n3. Create PR (if multi-developer project):`);
console.log(`   \`\`\`bash`);
console.log(`   gh pr create --title "[Title]" --body "[Description]`);
console.log(`   `);
console.log(`   ## Summary`);
console.log(`   [1-3 bullet points]`);
console.log(`   `);
console.log(`   ## Test Plan`);
console.log(`   - [x] All MCP services responding`);
console.log(`   - [x] Token efficiency validated`);
console.log(`   - [x] No regression`);
console.log(`   `);
console.log(`   🤖 Generated with Claude Code"`);
console.log(`   \`\`\``);

console.log(`\n4. Monitor for issues:`);
console.log(`   - First 30 minutes: Active monitoring`);
console.log(`   - Check error logs (if applicable)`);
console.log(`   - Verify MCP services still responding`);
console.log(`   - User feedback (if user-facing change)`);

console.log(`\n**Post-Deployment**:`);
const post_deployment = [
  "Verify in production/target environment",
  "Monitor error logs (first 24 hours)",
  "Update NEXT_SESSION.md with deployment notes",
  "Document lessons learned (if significant)",
  "Celebrate success 🎉"
];

post_deployment.forEach((task, index) => {
  console.log(`${index + 1}. ${task}`);
});

console.log(`\n✅ **DEPLOYMENT COMPLETE**`);
```

---

## Step 3: Documentation and Session Continuity

```javascript
console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`## Session Continuity Update`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

console.log(`\n**Action Required**: Update NEXT_SESSION.md before ending session`);
console.log(`\nUse session-continuity skill:`);
console.log(`\`\`\`\n/session-continuity EXECUTION_MODE=WAIT_FOR_USER_APPROVAL\n\`\`\``);

console.log(`\n**What to Document** (brief, state-focused):`);
console.log(`- ✅ Current state: Branch, last work, progress`);
console.log(`- ✅ Pending decisions: What needs user choice`);
console.log(`- ✅ Next actions: Top 3-5 tasks for next session`);
console.log(`- ✅ Data locations: Where to find results/files`);

console.log(`\n**What NOT to Document** (already in skills):`);
console.log(`- ❌ Methodologies (phase0-analysis has this)`);
console.log(`- ❌ Workflows (mcp-management-workflow has this)`);
console.log(`- ❌ Checklists (deployment-checklist has this)`);
console.log(`- ❌ MCP guide (mcp-selector has this)`);

console.log(`\n**Token Savings**: Session continuity with skills = 90% reduction`);
console.log(`- Traditional: ~3,000 tokens (repeating everything)`);
console.log(`- Skills-based: ~300 tokens (state only)`);
```

---

## Step 4: Troubleshooting (If Needed)

```javascript
console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`## Common Issues & Solutions`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

const troubleshooting_guide = [
  {
    issue: "MCP Service Not Responding",
    symptoms: ["Timeout errors", "Connection refused", "Service unavailable"],
    solutions: [
      "1. Check .mcp.json syntax: node -e \"require('./.mcp.json')\"",
      "2. Verify service path exists: ls services/[service-name]",
      "3. Test service independently: node services/[service-name]/index.js",
      "4. Check Claude Desktop logs (if using Claude Desktop)",
      "5. Restart Claude Code / Claude Desktop",
      "6. Verify environment variables in .mcp.json"
    ]
  },
  {
    issue: "High Token Usage",
    symptoms: ["Session exceeds budget", "Slow response", "Context limit warnings"],
    solutions: [
      "1. Measure current usage (baseline)",
      "2. Identify bottlenecks: Check repeated MCP calls",
      "3. Apply Progressive Disclosure: Quick Mode first, Deep Mode if needed",
      "4. Use Skills instead of direct MCP (95-97% savings)",
      "5. Reference skills in documentation (don't repeat)",
      "6. Re-measure and validate improvement (target: >= 70% confidence)"
    ]
  },
  {
    issue: "Template Breaking Changes",
    symptoms: ["Template doesn't work", "Unexpected behavior", "Token efficiency regression"],
    solutions: [
      "1. Revert to last known good version: git checkout [commit] [file]",
      "2. Apply changes incrementally (one section at a time)",
      "3. Test after each change (before/after token comparison)",
      "4. Use git bisect if needed: git bisect start/bad/good",
      "5. Verify structure preservation (Memory Check, Phase 0, etc.)",
      "6. Check for syntax errors in conditional logic"
    ]
  },
  {
    issue: "Session Continuity Lost",
    symptoms: ["Can't remember context", "Starting from scratch", "Missing state"],
    solutions: [
      "1. Check NEXT_SESSION.md for last known state",
      "2. Review git log for recent commits: git log --oneline -10",
      "3. Check test results for progress indicators",
      "4. Use Serena find_memory to recover context (if available)",
      "5. Reconstruct from deployment-checklist if available",
      "6. Ask user for context if critical information missing"
    ]
  }
];

troubleshooting_guide.forEach(guide => {
  console.log(`\n### ${guide.issue}`);
  console.log(`\n**Symptoms**:`);
  guide.symptoms.forEach(symptom => console.log(`- ${symptom}`));
  console.log(`\n**Solutions**:`);
  guide.solutions.forEach(solution => console.log(`${solution}`));
});

console.log(`\n💡 **Pro Tip**: Most issues are prevented by following Phase 0-5 workflow completely.`);
```

---

## Best Practices Summary

```javascript
console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`## Best Practices (Quick Reference)`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

console.log(`\n**Token Efficiency** (Target: 95-97% savings):`);
console.log(`- Use Skills for repeated patterns`);
console.log(`- Use MCP for computation (80% savings)`);
console.log(`- Combine Skills + MCP for complex tasks (84% savings)`);
console.log(`- Measure before and after changes`);

console.log(`\n**Code Quality**:`);
console.log(`- Follow TypeScript conventions (strict mode)`);
console.log(`- Write self-documenting code (meaningful names)`);
console.log(`- Add comments for complex logic only`);
console.log(`- Test early and often`);

console.log(`\n**MCP Management**:`);
console.log(`- Verify all 15 services before major work`);
console.log(`- Use mcp-selector for service choice`);
console.log(`- Test services independently when issues arise`);
console.log(`- Monitor token usage trends`);

console.log(`\n**Documentation**:`);
console.log(`- Keep NEXT_SESSION.md minimal (state only)`);
console.log(`- Let Skills handle methodologies`);
console.log(`- Update CLAUDE.md when MCP changes`);
console.log(`- Document decisions, not processes`);

console.log(`\n**Testing**:`);
console.log(`- Unit tests: Individual components`);
console.log(`- Integration tests: Component interactions`);
console.log(`- MCP tests: All 15 services health`);
console.log(`- Token efficiency: Before/after validation`);
```

---

## Quick Reference

```javascript
console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`## Quick Reference`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

console.log(`\n**Key Files**:`);
console.log(`- .mcp.json → MCP service configuration (base)`);
console.log(`- .mcp.local.json → Local overrides (optional)`);
console.log(`- CLAUDE.md → Project context and MCP guide`);
console.log(`- mcp-bridge.cjs → Indirect MCP calls`);
console.log(`- v5.5.1-templates/ → Template files`);
console.log(`- NEXT_SESSION.md → Session continuity state`);

console.log(`\n**Key Commands**:`);
console.log(`\`\`\`bash`);
console.log(`# Test all MCP services`);
console.log(`node test-all-15-services.cjs`);
console.log(``);
console.log(`# Call MCP indirectly`);
console.log(`node mcp-bridge.cjs [service] [method] "[params]"`);
console.log(``);
console.log(`# Validate config`);
console.log(`node -e "require('./.mcp.json')"`);
console.log(``);
console.log(`# Create PR`);
console.log(`gh pr create --title "[title]" --body "[body]"`);
console.log(``);
console.log(`# Check service health`);
console.log(`node mcp-bridge.cjs check all`);
console.log(`\`\`\``);

console.log(`\n**Key Skills** (auto-load on trigger keywords):`);
console.log(`- phase0-analysis → Cognitive enhancement framework`);
console.log(`- mcp-selector → MCP service selection guide`);
console.log(`- deployment-checklist → Pre-deployment verification`);
console.log(`- session-continuity → Session handoff template`);
console.log(`- mcp-management-workflow → This workflow guide`);

console.log(`\n**Workflow Shortcuts**:`);
console.log(`- Bug fix → Workflow A (15-30 min)`);
console.log(`- Feature → Workflow B (2-4 hours)`);
console.log(`- Template → Workflow C (45-90 min)`);
console.log(`- MCP service → Workflow D (1-2 hours)`);
console.log(`- Complex task → Phase 0-5 (varies)`);
```

---

## Completion

```javascript
console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`## Workflow Complete`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

console.log(`\n✅ **Status**: ${selected_workflow} guidance provided`);
console.log(`\n📊 **Next Steps**: Follow workflow steps sequentially`);
console.log(`\n🔗 **Related Skills**:`);
console.log(`   - /phase0-analysis for cognitive enhancement`);
console.log(`   - /mcp-selector for MCP service selection`);
console.log(`   - /deployment-checklist for pre-deployment verification`);
console.log(`   - /session-continuity for session handoff`);

console.log(`\n💡 **Remember**: Skills save 95-97% tokens. Use them instead of repeating workflows.`);

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
```

---

## Token Budget

**Total MCP Management Workflow: ~300-400 tokens**

**Breakdown**:
- Step 0 (Understand Task): ~60 tokens
- Step 1 (Select Workflow): ~40 tokens
- Step 2 (Execute Workflow): ~150 tokens (varies by workflow)
- Step 3 (Documentation): ~40 tokens
- Step 4 (Troubleshooting): ~50 tokens (if needed)
- Quick Reference: ~40 tokens

**Efficiency Strategy**:
- Reference skill.md for detailed procedures (don't repeat)
- Provide workflow selection logic only
- Give phase-specific guidance without full details
- Use checklists and quick references
- Point to other skills (phase0-analysis, mcp-selector, deployment-checklist, session-continuity)

**When User Needs More Detail**:
- Refer to skill.md sections (Line X-Y in skill.md)
- Suggest appropriate Skills (/phase0-analysis, /mcp-selector, etc.)
- Provide specific examples for current task only

---

**Version**: 2.1.0
**Pattern**: Linear Sequential Workflow Guide
**Complements**: phase0-analysis, mcp-selector, deployment-checklist, session-continuity
**Token Efficiency**: ~95-97% savings vs manual workflow documentation

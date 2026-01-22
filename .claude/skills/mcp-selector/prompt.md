# MCP Service Selector - Executable Prompt

**Version**: 1.0.0
**Purpose**: Intelligent guide for selecting the optimal MCP service from 15 available services
**Pattern**: Linear Guide/Reference Tool

---

## Mission

Help users select the most appropriate MCP service(s) for their specific task by:
1. Understanding the task requirements
2. Categorizing task type
3. Matching to suitable services
4. Providing clear recommendations with rationale
5. Generating usage examples

---

## Step 0: Understand User's Task/Need

```javascript
// 1. Extract task description from user input
const user_task = "[user's request]";

console.log(`🎯 Task: ${user_task}`);

// 2. Identify task keywords
const task_keywords = {
  analysis: ["analyze", "analysis", "evaluate", "assess", "review", "examine", "study"],
  thinking: ["think", "decide", "decision", "compare", "strategy", "plan", "design"],
  probability: ["risk", "probability", "chance", "likelihood", "uncertainty", "scenario", "monte carlo"],
  systems: ["system", "architecture", "interaction", "dependency", "integration", "whole", "holistic"],
  sequential: ["step-by-step", "sequence", "workflow", "process", "procedure", "stages"],

  code: ["code", "refactor", "optimize", "debug", "function", "class", "module"],
  context: ["context", "structure", "pattern", "relationship", "dependency tree"],
  javascript: ["javascript", "node", "npm", "react", "next", "express"],
  python: ["python", "pip", "django", "flask", "pandas", "numpy"],
  dependencies: ["package", "dependency", "npm", "security", "vulnerability", "update"],

  automation: ["automate", "automation", "script", "batch", "repeat", "workflow"],
  browser: ["browser", "web", "ui", "click", "navigate", "scrape", "e2e", "test"],
  mobile: ["mobile", "app", "android", "ios", "device", "simulator"],
  git: ["git", "github", "pr", "pull request", "commit", "branch", "merge"],

  backend: ["database", "api", "backend", "supabase", "postgres", "authentication", "storage"]
};

// 3. Match keywords to categories
let matched_categories = [];

for (const [category, keywords] of Object.entries(task_keywords)) {
  const has_match = keywords.some(kw => user_task.toLowerCase().includes(kw));

  if (has_match) {
    matched_categories.push(category);
  }
}

console.log(`\n📊 Matched Categories: ${matched_categories.join(', ')}`);

// 4. Determine primary task type
let task_type = "general"; // Default

// Priority order: backend > automation > code > thinking > analysis
if (matched_categories.includes('backend')) {
  task_type = "backend";
} else if (matched_categories.some(cat => ['automation', 'browser', 'mobile', 'git'].includes(cat))) {
  task_type = "automation";
} else if (matched_categories.some(cat => ['code', 'context', 'javascript', 'python', 'dependencies'].includes(cat))) {
  task_type = "code";
} else if (matched_categories.some(cat => ['thinking', 'probability', 'systems', 'sequential'].includes(cat))) {
  task_type = "thinking";
} else if (matched_categories.includes('analysis')) {
  task_type = "analysis";
}

console.log(`\n🎯 Primary Task Type: ${task_type}`);
```

**Output**:
```markdown
## Task Analysis

**Input**: [user's task description]
**Detected Type**: [task_type]
**Matched Categories**: [category1, category2, ...]
```

---

## Step 1: Categorize Task Type

```javascript
// Define service categories
const service_categories = {
  analysis_thinking: [
    { name: "clear-thought", best_for: "Deep sequential analysis with step-by-step reasoning", token_cost: "very_low", response_time: "slow" },
    { name: "clear-thought-1.5", best_for: "Systems thinking with decision frameworks", token_cost: "low", response_time: "medium" },
    { name: "sequential-thinking-tools", best_for: "Structured problem-solving workflows", token_cost: "low", response_time: "fast" },
    { name: "stochastic-thinking", best_for: "Probability analysis and Monte Carlo simulations", token_cost: "low", response_time: "medium" },
    { name: "context7", best_for: "Code context and dependency analysis", token_cost: "medium", response_time: "fast" },
    { name: "code-context-provider-mcp", best_for: "Code pattern recognition and refactoring", token_cost: "medium", response_time: "fast" },
    { name: "model-enhancement-servers", best_for: "AI performance optimization", token_cost: "low", response_time: "medium" }
  ],

  development: [
    { name: "github-mcp", best_for: "GitHub repository management and PR automation", token_cost: "medium", response_time: "fast" },
    { name: "npm-sentinel-mcp", best_for: "NPM package monitoring and security scanning", token_cost: "low", response_time: "fast" },
    { name: "node-omnibus-mcp", best_for: "Node.js process management and utilities", token_cost: "medium", response_time: "fast" },
    { name: "python-toolbox-mcp", best_for: "Python code quality and data processing", token_cost: "medium", response_time: "medium" }
  ],

  automation: [
    { name: "playwright-mcp", best_for: "Browser automation and E2E testing", token_cost: "high", response_time: "slow" },
    { name: "magic-mcp", best_for: "General-purpose workflow automation", token_cost: "medium", response_time: "medium" },
    { name: "mobile-mcp", best_for: "Mobile app development and testing", token_cost: "medium", response_time: "medium" }
  ],

  backend: [
    { name: "supabase-mcp", best_for: "Database management and API endpoints", token_cost: "medium", response_time: "fast" }
  ]
};

// Match task type to service category
let candidate_services = [];

if (task_type === "backend") {
  candidate_services = service_categories.backend;
} else if (task_type === "automation") {
  candidate_services = service_categories.automation;
} else if (task_type === "code") {
  candidate_services = [...service_categories.analysis_thinking.filter(s => ['context7', 'code-context-provider-mcp'].includes(s.name)), ...service_categories.development];
} else if (task_type === "thinking") {
  candidate_services = service_categories.analysis_thinking.filter(s => !['context7', 'code-context-provider-mcp'].includes(s.name));
} else if (task_type === "analysis") {
  candidate_services = service_categories.analysis_thinking;
} else {
  // General - offer all categories
  candidate_services = [...service_categories.analysis_thinking, ...service_categories.development, ...service_categories.automation, ...service_categories.backend];
}

console.log(`\n📦 Candidate Services (${candidate_services.length}):`);
candidate_services.forEach((service, i) => {
  console.log(`${i + 1}. ${service.name} - ${service.best_for}`);
});
```

**Output**:
```markdown
## Service Category Matching

**Task Type**: [task_type]
**Candidate Services**: [count] services identified

[List of candidate services with descriptions]
```

---

## Step 2: Match to Appropriate MCP Services

```javascript
// Decision tree logic based on matched categories
let recommended_services = [];
let rationale = [];

// Analysis-specific matching
if (matched_categories.includes('probability') || matched_categories.includes('risk')) {
  recommended_services.push({
    service: "stochastic-thinking",
    reason: "Probability analysis and Monte Carlo simulations for risk assessment",
    priority: 1
  });
}

if (matched_categories.includes('systems') || matched_categories.includes('architecture')) {
  recommended_services.push({
    service: "clear-thought-1.5",
    reason: "Systems thinking for analyzing architecture and component interactions",
    priority: 1
  });
}

if (matched_categories.includes('sequential') || matched_categories.includes('workflow')) {
  recommended_services.push({
    service: "sequential-thinking-tools",
    reason: "Structured step-by-step problem-solving workflows",
    priority: 1
  });
}

if (matched_categories.includes('analysis') && !matched_categories.some(cat => ['probability', 'systems', 'sequential'].includes(cat))) {
  recommended_services.push({
    service: "clear-thought",
    reason: "Deep sequential analysis with comprehensive step-by-step reasoning",
    priority: 1
  });
}

// Code-specific matching
if (matched_categories.includes('code') || matched_categories.includes('context')) {
  if (user_task.toLowerCase().includes('refactor') || user_task.toLowerCase().includes('pattern')) {
    recommended_services.push({
      service: "code-context-provider-mcp",
      reason: "Pattern recognition and refactoring suggestions",
      priority: 1
    });
  } else {
    recommended_services.push({
      service: "context7",
      reason: "Code context and dependency analysis",
      priority: 1
    });
  }
}

if (matched_categories.includes('javascript') || matched_categories.includes('node')) {
  recommended_services.push({
    service: "node-omnibus-mcp",
    reason: "Node.js process management and utilities",
    priority: 2
  });
}

if (matched_categories.includes('python')) {
  recommended_services.push({
    service: "python-toolbox-mcp",
    reason: "Python code quality and data processing",
    priority: 2
  });
}

if (matched_categories.includes('dependencies')) {
  recommended_services.push({
    service: "npm-sentinel-mcp",
    reason: "NPM package security scanning and vulnerability detection",
    priority: 1
  });
}

// Automation-specific matching
if (matched_categories.includes('browser') || user_task.toLowerCase().includes('e2e')) {
  recommended_services.push({
    service: "playwright-mcp",
    reason: "Browser automation and E2E testing capabilities",
    priority: 1
  });
}

if (matched_categories.includes('mobile')) {
  recommended_services.push({
    service: "mobile-mcp",
    reason: "Mobile app development and device testing",
    priority: 1
  });
}

if (matched_categories.includes('git') || user_task.toLowerCase().includes('pr')) {
  recommended_services.push({
    service: "github-mcp",
    reason: "GitHub repository operations and PR automation",
    priority: 1
  });
}

if (matched_categories.includes('automation') && recommended_services.length === 0) {
  recommended_services.push({
    service: "magic-mcp",
    reason: "General-purpose workflow automation",
    priority: 2
  });
}

// Backend-specific matching
if (matched_categories.includes('backend') || user_task.toLowerCase().includes('database')) {
  recommended_services.push({
    service: "supabase-mcp",
    reason: "Database management, API endpoints, and authentication",
    priority: 1
  });
}

// Sort by priority (1 = primary, 2 = secondary)
recommended_services.sort((a, b) => a.priority - b.priority);

console.log(`\n✅ Recommended Services (${recommended_services.length}):`);
recommended_services.forEach((rec, i) => {
  const emoji = rec.priority === 1 ? "🥇" : "🥈";
  console.log(`${emoji} ${i + 1}. ${rec.service}`);
  console.log(`   Reason: ${rec.reason}`);
});
```

**Output**:
```markdown
## Recommended Services

### Primary Recommendations (🥇)
[Services with priority 1, matched to user's task]

### Secondary Recommendations (🥈)
[Services with priority 2, complementary capabilities]
```

---

## Step 3: Provide Service Recommendations with Rationale

```javascript
// Generate detailed recommendation for each service
recommended_services.forEach((rec, index) => {
  // Lookup service details
  const service_details = [
    ...service_categories.analysis_thinking,
    ...service_categories.development,
    ...service_categories.automation,
    ...service_categories.backend
  ].find(s => s.name === rec.service);

  if (!service_details) {
    console.log(`⚠️ Service ${rec.service} not found in catalog`);
    return;
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`## ${index + 1}. ${rec.service}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  console.log(`\n**Best For**: ${service_details.best_for}`);
  console.log(`**Why This Service**: ${rec.reason}`);

  console.log(`\n**Performance Characteristics**:`);
  console.log(`- Token Cost: ${service_details.token_cost.toUpperCase()}`);
  console.log(`- Response Time: ${service_details.response_time}`);

  // Add usage context
  console.log(`\n**When to Use**:`);

  if (rec.service === "clear-thought") {
    console.log(`- Complex problems requiring deep analysis`);
    console.log(`- Step-by-step reasoning needed`);
    console.log(`- High token efficiency required (98%+ savings)`);
  } else if (rec.service === "clear-thought-1.5") {
    console.log(`- System-wide architecture decisions`);
    console.log(`- Component interaction analysis`);
    console.log(`- Decision frameworks needed`);
  } else if (rec.service === "sequential-thinking-tools") {
    console.log(`- Structured workflows and processes`);
    console.log(`- Breaking down complex tasks into steps`);
    console.log(`- Planning and execution strategies`);
  } else if (rec.service === "stochastic-thinking") {
    console.log(`- Risk assessment and probability analysis`);
    console.log(`- Monte Carlo simulations`);
    console.log(`- Uncertainty quantification`);
  } else if (rec.service === "context7") {
    console.log(`- Understanding code structure and dependencies`);
    console.log(`- Analyzing project architecture`);
    console.log(`- Identifying code relationships`);
  } else if (rec.service === "code-context-provider-mcp") {
    console.log(`- Code pattern recognition`);
    console.log(`- Refactoring opportunities`);
    console.log(`- Code quality improvement`);
  } else if (rec.service === "github-mcp") {
    console.log(`- Creating and managing PRs`);
    console.log(`- Repository operations`);
    console.log(`- Code review automation`);
  } else if (rec.service === "npm-sentinel-mcp") {
    console.log(`- Dependency security scanning`);
    console.log(`- Package vulnerability detection`);
    console.log(`- Dependency updates management`);
  } else if (rec.service === "node-omnibus-mcp") {
    console.log(`- Node.js process management`);
    console.log(`- System utilities for Node projects`);
    console.log(`- File system operations`);
  } else if (rec.service === "python-toolbox-mcp") {
    console.log(`- Python code quality analysis`);
    console.log(`- Data processing tasks`);
    console.log(`- Python project utilities`);
  } else if (rec.service === "playwright-mcp") {
    console.log(`- Browser automation and testing`);
    console.log(`- E2E test scenarios`);
    console.log(`- Web scraping tasks`);
  } else if (rec.service === "magic-mcp") {
    console.log(`- General workflow automation`);
    console.log(`- Custom scripting tasks`);
    console.log(`- Repetitive task automation`);
  } else if (rec.service === "mobile-mcp") {
    console.log(`- Mobile app testing`);
    console.log(`- Device simulation`);
    console.log(`- Mobile development workflows`);
  } else if (rec.service === "supabase-mcp") {
    console.log(`- Database operations`);
    console.log(`- API endpoint management`);
    console.log(`- Authentication and storage`);
  }

  // Add cautions if applicable
  console.log(`\n**Cautions**:`);

  if (service_details.token_cost === "high") {
    console.log(`⚠️ High token cost - use for essential automation tasks only`);
  }

  if (service_details.response_time === "slow") {
    console.log(`⚠️ Slower response time - plan for longer execution`);
  }

  if (rec.service === "stochastic-thinking") {
    console.log(`⚠️ Requires clear probability parameters (iterations, scenarios)`);
  }

  if (rec.service === "playwright-mcp") {
    console.log(`⚠️ Requires browser setup and may fail on headless environments`);
  }

  if (rec.service === "supabase-mcp") {
    console.log(`⚠️ Requires Supabase project configuration`);
  }
});
```

**Output**:
```markdown
[For each recommended service]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## N. [service-name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Best For**: [capability]
**Why This Service**: [rationale]

**Performance Characteristics**:
- Token Cost: [VERY_LOW/LOW/MEDIUM/HIGH]
- Response Time: [fast/medium/slow]

**When to Use**:
- [use case 1]
- [use case 2]
- [use case 3]

**Cautions**:
[warnings if applicable]
```

---

## Step 4: Generate Usage Examples

```javascript
// Generate usage examples for recommended services
console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`## Usage Examples`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

recommended_services.forEach((rec, index) => {
  console.log(`\n### Example ${index + 1}: ${rec.service}`);

  // Generate context-specific example
  const example_prompt = user_task.replace(/['"]/g, '');

  console.log(`\n**Direct Call** (after Claude restart):`);
  console.log(`\`\`\`javascript`);
  console.log(`Task("${rec.service}", {`);
  console.log(`  subagent_type: "general-purpose",`);
  console.log(`  prompt: "${example_prompt}"`);
  console.log(`});`);
  console.log(`\`\`\``);

  console.log(`\n**Indirect Call** (within session):`);
  console.log(`\`\`\`bash`);

  if (rec.service === "clear-thought") {
    console.log(`node "C:\\\\claude-development\\\\mcp-management\\\\mcp-bridge.cjs" clear-thought analyze "${example_prompt}"`);
  } else if (rec.service === "clear-thought-1.5") {
    console.log(`node "C:\\\\claude-development\\\\mcp-management\\\\mcp-bridge.cjs" clear-thought-1.5 systems_thinking "${example_prompt}"`);
  } else if (rec.service === "sequential-thinking-tools") {
    console.log(`node "C:\\\\claude-development\\\\mcp-management\\\\mcp-bridge.cjs" sequential-thinking-tools plan "${example_prompt}"`);
  } else if (rec.service === "stochastic-thinking") {
    console.log(`node "C:\\\\claude-development\\\\mcp-management\\\\mcp-bridge.cjs" stochastic-thinking evaluate "${example_prompt}"`);
  } else if (rec.service === "github-mcp") {
    console.log(`node "C:\\\\claude-development\\\\mcp-management\\\\mcp-bridge.cjs" github-mcp github_action "{\\"action\\": \\"list_prs\\"}"`);
  } else {
    console.log(`node "C:\\\\claude-development\\\\mcp-management\\\\mcp-bridge.cjs" ${rec.service} [method] "${example_prompt}"`);
  }

  console.log(`\`\`\``);
});

// Suggest service chains for complex tasks
if (recommended_services.length > 1) {
  console.log(`\n### Service Chain Recommendation`);
  console.log(`\nFor complex tasks, consider chaining services sequentially:\n`);

  console.log(`\`\`\`javascript`);
  console.log(`// Step 1: Use ${recommended_services[0].service}`);
  console.log(`Task("${recommended_services[0].service}", {`);
  console.log(`  subagent_type: "general-purpose",`);
  console.log(`  prompt: "Step 1: ${recommended_services[0].reason}"`);
  console.log(`});`);
  console.log(``);
  console.log(`// Step 2: Use ${recommended_services[1].service}`);
  console.log(`Task("${recommended_services[1].service}", {`);
  console.log(`  subagent_type: "general-purpose",`);
  console.log(`  prompt: "Step 2: ${recommended_services[1].reason}"`);
  console.log(`});`);

  if (recommended_services.length > 2) {
    console.log(``);
    console.log(`// Step 3: Use ${recommended_services[2].service}`);
    console.log(`Task("${recommended_services[2].service}", {`);
    console.log(`  subagent_type: "general-purpose",`);
    console.log(`  prompt: "Step 3: ${recommended_services[2].reason}"`);
    console.log(`});`);
  }

  console.log(`\`\`\``);

  console.log(`\n**Why Chain Services?**`);
  console.log(`- Each service provides specialized capability`);
  console.log(`- Results from one service inform the next`);
  console.log(`- Comprehensive analysis with clear separation of concerns`);
}
```

**Output**:
```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## Usage Examples
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Example 1: [service-name]

**Direct Call** (after Claude restart):
```javascript
Task("[service]", {
  subagent_type: "general-purpose",
  prompt: "[user's task]"
});
```

**Indirect Call** (within session):
```bash
node "./mcp-bridge.cjs" [service] [method] "[params]"
```

[Additional examples for other recommended services]

### Service Chain Recommendation
[If multiple services recommended, show sequential chain]
```

---

## Step 5: Provide Additional Guidance

```javascript
// Check if .mcp.json exists
const project_root = process.cwd();
const mcp_config_path = `${project_root}/.mcp.json`;

let has_mcp_config = false;

try {
  Read({ file_path: mcp_config_path });
  has_mcp_config = true;
  console.log(`\n✅ .mcp.json found - MCP services are configured`);
} catch (error) {
  console.log(`\n⚠️ .mcp.json not found`);
  console.log(`This project may not have MCP services configured.`);
  console.log(`\nTo enable MCP services, copy .mcp.json from MCP Management System:`);
  console.log(`\`\`\`bash`);
  console.log(`cp C:\\\\claude-development\\\\mcp-management\\\\.mcp.json .`);
  console.log(`\`\`\``);
}

// Provide token efficiency tips
console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`## Token Efficiency Tips`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

console.log(`\n**Highest Token Savings** (98%+ efficiency):`);
console.log(`- clear-thought: Complex analysis tasks`);
console.log(`- stochastic-thinking: Probability simulations`);

console.log(`\n**Medium Token Savings** (70-90% efficiency):`);
console.log(`- sequential-thinking-tools: Structured workflows`);
console.log(`- clear-thought-1.5: Systems analysis`);

console.log(`\n**Standard Efficiency** (40-60% efficiency):`);
console.log(`- Development tools: github-mcp, npm-sentinel-mcp`);
console.log(`- Automation tools: playwright-mcp, magic-mcp`);

console.log(`\n**When NOT to Use MCP**:`);
console.log(`- Simple file operations → Use built-in Read/Write/Edit tools`);
console.log(`- Basic bash commands → Use Bash tool directly`);
console.log(`- Quick searches → Use Grep/Glob tools`);
console.log(`- One-line calculations → Compute directly`);

console.log(`\n💡 **Best Practice**: Start with thinking tools for analysis, then use specialized tools for execution.`);

// Common pitfalls
console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`## Common Pitfalls to Avoid`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

console.log(`\n❌ **Don't**:`);
console.log(`- Use browser automation (playwright-mcp) for simple data extraction`);
console.log(`- Chain too many services (>3) - diminishing returns`);
console.log(`- Ignore token costs for high-frequency operations`);
console.log(`- Use MCP when built-in tools are sufficient`);

console.log(`\n✅ **Do**:`);
console.log(`- Match service to task complexity`);
console.log(`- Start with single service, chain only if needed`);
console.log(`- Consider token costs for production workflows`);
console.log(`- Verify service is configured in .mcp.json before use`);
```

**Output**:
```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## Token Efficiency Tips
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Token savings by service category]
[When NOT to use MCP]
[Best practices]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## Common Pitfalls to Avoid
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Common mistakes and how to avoid them]
```

---

## Success Criteria

**Successful MCP Service Selection**:

- [ ] User's task clearly understood
- [ ] Task type correctly categorized (analysis/code/automation/backend)
- [ ] 1-3 services recommended (not overwhelming)
- [ ] Clear rationale for each recommendation
- [ ] Performance characteristics explained (token cost, response time)
- [ ] Usage examples provided (direct + indirect call)
- [ ] Service chain suggested if applicable (for complex tasks)
- [ ] Configuration verified (.mcp.json check)
- [ ] Token efficiency guidance included
- [ ] Common pitfalls mentioned

**Quality Checks**:
- Recommendations match task requirements
- Rationale is clear and specific
- Examples are copy-paste ready
- No services recommended that aren't configured
- Token cost warnings for high-cost services

---

## Token Budget

**Total MCP Selector: ~200-300 tokens**

**Breakdown**:
- Step 0 (Task Understanding): ~50 tokens
- Step 1 (Categorization): ~30 tokens
- Step 2 (Service Matching): ~40 tokens
- Step 3 (Recommendations): ~80 tokens (3 services × ~25 tokens each)
- Step 4 (Usage Examples): ~60 tokens
- Step 5 (Additional Guidance): ~40 tokens

**Efficiency Strategy**:
- Use keyword matching instead of LLM analysis
- Limit recommendations to top 3 services
- Generate examples programmatically
- Avoid redundant explanations

**When Recommendations Are Unclear**:
- Provide all 15 services categorized by type
- Let user choose based on their expertise
- Suggest starting with thinking tools for complex tasks

---

## Special Cases

### Case 1: No Clear Match

```javascript
if (recommended_services.length === 0) {
  console.log(`\n⚠️ No specific service matches detected.`);
  console.log(`\n**Suggested Approach**:`);
  console.log(`1. Start with **clear-thought** for general analysis`);
  console.log(`2. Use **sequential-thinking-tools** to break down the task`);
  console.log(`3. Once task is clearer, select specialized service`);

  console.log(`\n**All Available Services**:`);
  console.log(`\n🧠 Analysis & Thinking (7):`);
  console.log(`- clear-thought, clear-thought-1.5, sequential-thinking-tools`);
  console.log(`- stochastic-thinking, context7, code-context-provider-mcp`);
  console.log(`- model-enhancement-servers`);

  console.log(`\n🛠️ Development (4):`);
  console.log(`- github-mcp, npm-sentinel-mcp, node-omnibus-mcp, python-toolbox-mcp`);

  console.log(`\n🤖 Automation (3):`);
  console.log(`- playwright-mcp, magic-mcp, mobile-mcp`);

  console.log(`\n☁️ Backend (1):`);
  console.log(`- supabase-mcp`);
}
```

### Case 2: Multiple Conflicting Matches

```javascript
if (recommended_services.length > 5) {
  console.log(`\n⚠️ Multiple services match this task.`);
  console.log(`\nRecommended priority order:`);

  // Sort by priority and token efficiency
  const sorted_services = recommended_services.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;

    const cost_order = { very_low: 1, low: 2, medium: 3, high: 4 };
    const a_cost = service_categories.analysis_thinking.concat(service_categories.development, service_categories.automation, service_categories.backend).find(s => s.name === a.service)?.token_cost || 'medium';
    const b_cost = service_categories.analysis_thinking.concat(service_categories.development, service_categories.automation, service_categories.backend).find(s => s.name === b.service)?.token_cost || 'medium';

    return cost_order[a_cost] - cost_order[b_cost];
  });

  // Show only top 3
  recommended_services = sorted_services.slice(0, 3);

  console.log(`Showing top 3 most relevant services based on priority and token efficiency.`);
}
```

### Case 3: Service Not Configured

```javascript
// Check if recommended service exists in .mcp.json
if (has_mcp_config) {
  try {
    const mcp_config = JSON.parse(Read({ file_path: mcp_config_path }));

    recommended_services.forEach(rec => {
      const service_exists = rec.service in (mcp_config.mcpServers || {});

      if (!service_exists) {
        console.log(`\n⚠️ ${rec.service} is not configured in .mcp.json`);
        console.log(`To enable this service, add to .mcp.json:`);
        console.log(`\`\`\`json`);
        console.log(`"${rec.service}": {`);
        console.log(`  "command": "node",`);
        console.log(`  "args": ["C:\\\\claude-development\\\\mcp-management\\\\services\\\\${rec.service}\\\\index.js"],`);
        console.log(`  "type": "stdio"`);
        console.log(`}`);
        console.log(`\`\`\``);
      }
    });
  } catch (error) {
    console.log(`\n⚠️ Failed to parse .mcp.json: ${error.message}`);
  }
}
```

---

## Helper Functions

```javascript
/**
 * Get service details by name
 */
function getServiceDetails(service_name) {
  const all_services = [
    ...service_categories.analysis_thinking,
    ...service_categories.development,
    ...service_categories.automation,
    ...service_categories.backend
  ];

  return all_services.find(s => s.name === service_name);
}

/**
 * Format token cost as user-friendly string
 */
function formatTokenCost(cost) {
  const cost_map = {
    very_low: "⭐⭐⭐ Excellent (98%+ savings)",
    low: "⭐⭐ Good (70-90% savings)",
    medium: "⭐ Standard (40-60% savings)",
    high: "⚠️ High (consider alternatives)"
  };

  return cost_map[cost] || cost;
}

/**
 * Format response time as user-friendly string
 */
function formatResponseTime(time) {
  const time_map = {
    fast: "⚡ Fast (<2 seconds)",
    medium: "🔄 Medium (2-5 seconds)",
    slow: "⏳ Slow (5-15 seconds)"
  };

  return time_map[time] || time;
}
```

---

## Rules

**DO**:
- Provide 1-3 focused recommendations (not overwhelming)
- Explain WHY each service is recommended
- Include both direct and indirect usage examples
- Mention token costs and response times
- Suggest service chains for complex tasks
- Verify .mcp.json configuration
- Warn about high-cost services

**DON'T**:
- Recommend services not configured in .mcp.json
- Suggest MCP when built-in tools are sufficient
- Chain more than 3 services (diminishing returns)
- Ignore token efficiency considerations
- Provide generic recommendations without rationale
- Overwhelm user with all 15 services

---

## Output Template

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 MCP Service Selection Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Your Task**: [user input]
**Task Type**: [analysis/code/automation/backend]
**Matched Categories**: [category1, category2, ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## Recommended Services
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 🥇 Primary Recommendations

#### 1. [service-name]

**Best For**: [capability]
**Why This Service**: [rationale]

**Performance**:
- Token Cost: [rating]
- Response Time: [rating]

**When to Use**:
- [use case 1]
- [use case 2]

**Cautions**: [if any]

**Usage Example**:
```javascript
Task("[service]", {
  subagent_type: "general-purpose",
  prompt: "[your task]"
});
```

[Repeat for each primary recommendation]

### 🥈 Secondary Recommendations
[If applicable]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## Service Chain Recommendation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[If multiple services recommended, show sequential chain]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## Quick Tips
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Token Efficiency**: [guidance]
**When NOT to Use MCP**: [guidance]
**Best Practice**: [guidance]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

**Version**: 1.0.0
**Last Updated**: 2025-12-24
**Estimated Execution Time**: 30-60 seconds
**Token Budget**: 200-300 tokens

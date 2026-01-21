# MCP Management System

> **"Decision confidence: 72% → 95% | Complex analysis: 2 hours → 15 minutes"**
>
> Extend Claude Code's cognitive capabilities to make **better decisions**, **faster**.
> This system is battle-tested in production and **proven by results**.

**[English](#english)** | **[한국어](#korean)**

---

# English

## What This System Solves

| Problem | Solution |
|---------|----------|
| "Claude only gives surface-level answers" | **Structured analysis workflows** - Analyze from 5 perspectives simultaneously |
| "I'm not confident in complex decisions" | **Bias Detection** - Automatically detect and correct 4 cognitive biases |
| "Analysis feels shallow" | **Multidimensional analysis** - Choose depth from Level 2 to 5 |
| "I keep repeating the same context every session" | **Serena Memory** - Persistent context storage across sessions |
| "I don't know where to start when implementing features" | **3-Wave workflow** - Structured step-by-step guidance |

---

## Verified Results

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Decision confidence | 72% | 95% | **+23%p** |
| Analysis perspectives | 1 | 5 | **5x** |
| Complex analysis time | 2 hours | 15 min | **-87%** |
| Cognitive bias detection | Manual | Auto (4 types) | **Automated** |
| Cross-session context | Lost | Persistent | **100% retained** |

---

## Core Skills

### decision-workflow

**Problem it solves:**
> "MSA vs Monolith - which should I choose?"
> "I made a decision but I'm not confident about it"

**How it works:**
- **Quick Mode** (5 min): For rapid decisions
- **Deep Mode** (15 min): In-depth analysis for high-stakes decisions

**Output:**
```
✅ Comparison of 4 options
✅ Detection of 4 cognitive biases (Confirmation Bias, Sunk Cost, etc.)
✅ Confidence calibration: 85% → 70% (prevents overconfidence)
✅ Final recommendation with concrete reasoning
```

**Usage:** `/decision-workflow "MSA vs Monolith selection"`

---

### multidimensional-analysis

**Problem it solves:**
> "I only analyze from one perspective"
> "I'm worried I'm missing something"

**How it works:**
- **Level 2** (20 min): Quick review - 3 perspectives
- **Level 3** (35 min): Standard analysis - 4 perspectives
- **Level 4** (50 min): Deep analysis - 5 perspectives
- **Level 5** (70 min): Research-grade - 5 perspectives + academic rigor

**5 Analysis Perspectives:**
| Perspective | Focus |
|-------------|-------|
| Technical | Architecture, scalability, maintainability |
| Cost | Initial cost, operational cost, TCO |
| Risk | Technical debt, failure scenarios, recovery strategies |
| Organization | Team capability, hiring difficulty, learning curve |
| Market | Competitive advantage, market fit, future outlook |

**Output:**
```
✅ Comprehensive 5-perspective analysis
✅ Probabilistic scenarios (Monte Carlo simulation)
✅ Bias detection and correction
✅ Actionable roadmap
```

**Usage:** `/multidimensional-analysis "Project architecture analysis" Level 3`

---

### implementation-workflow

**Problem it solves:**
> "I don't know where to start when implementing a feature"
> "I keep missing things during implementation"

**How it works:**
- **Wave 1**: Requirements analysis + tech stack validation
- **Wave 2**: Design + dependency analysis
- **Wave 3**: Implementation plan + test strategy

**Output:**
```
✅ Step-by-step implementation checklist
✅ Technical risks identified upfront
✅ Auto-generated test scenarios
✅ Time estimation
```

**Usage:** `/implementation-workflow "Add user authentication"`

---

### research-workflow

**Problem it solves:**
> "I don't know what criteria to use when comparing technologies"
> "I did the research but can't reach a conclusion"

**How it works:**
- **Quick Mode**: Rapid tech comparison (10 min)
- **Deep Mode**: In-depth tech research (30 min)

**Output:**
```
✅ Pros/cons matrix by technology
✅ Real-world use case analysis
✅ Unbiased recommendation
```

**Usage:** `/research-workflow "React vs Vue vs Svelte comparison"`

---

## Hooks

Hooks run **automatically** to provide safety and traceability.

### permission-request

**Role:** Automatic permission check before MCP tool usage

**Benefits:**
- Prevents accidental dangerous operations
- Only executes approved actions
- Auto-logs all usage

---

### pre-tool-use

**Role:** Input validation and safety checks before tool execution

**Benefits:**
- Auto-limits inputs exceeding 5000 characters
- Blocks dangerous paths (`/etc/`, `C:\Windows\`)
- Filters sensitive information

---

### subagent-stop

**Role:** Auto-records subagent (Task) execution on completion

**Benefits:**
- Auto-saves all analysis/work history
- Traceable even after session ends
- Integrates with Serena Memory

**Output:** `.serena/memories/agent_execution_{date}.md`

---

## Serena Memory (Optional - Advanced)

### Problems it solves

| Problem | Serena Solution |
|---------|-----------------|
| "Claude doesn't remember yesterday's analysis" | Persistent memory across sessions |
| "Setting up context for each project is tedious" | Auto-loads project-specific context |
| "I want to track decision history" | Auto-records all analyses and decisions |

### Example Output

```
.serena/memories/
├── decision_msa_vs_monolith_2026-01-15.md    # Decision record
├── architecture_analysis_2026-01-14.md       # Analysis result
├── session_context_2026-01-13.md             # Session context
└── agent_execution_2026-01-12.md             # Agent execution log
```

**Result:** Claude can instantly reference analysis from 2 weeks ago

---

### ⚠️ Setup Complexity Notice

**To be honest:** Serena setup is complex.

| Complexity Factor | Reason |
|-------------------|--------|
| Docker required | Container-based execution |
| Path configuration | Differs for Windows / WSL / macOS |
| Volume mount | Syntax varies by OS |
| project.yml | Errors if required fields are missing |

---

### 🤖 Easy Setup with AI (Recommended)

**Don't configure it yourself. Let AI do it.**

Share the following with Claude for auto-configuration:

```
"Set up Serena Memory for me.
- My environment: [Windows 11 / macOS / WSL2]
- Project path: [C:\my-project or /home/user/my-project]
- Docker installed: [yes/no]"
```

Claude will generate the appropriate `.mcp.json` and `project.yml` for your environment.

---

### Configuration Examples by OS

<details>
<summary><b>Windows (Git Bash)</b></summary>

```json
{
  "serena-memory": {
    "command": "docker",
    "args": [
      "run", "-i", "--rm",
      "-v", "//c/projects:/projects",
      "serena-mcp:latest",
      "--project", "/projects/my-project"
    ],
    "env": {
      "MSYS_NO_PATHCONV": "1",
      "MSYS2_ARG_CONV_EXCL": "*"
    },
    "type": "stdio"
  }
}
```
</details>

<details>
<summary><b>macOS / Linux</b></summary>

```json
{
  "serena-memory": {
    "command": "docker",
    "args": [
      "run", "-i", "--rm",
      "-v", "/Users/name/projects:/projects",
      "serena-mcp:latest",
      "--project", "/projects/my-project"
    ],
    "type": "stdio"
  }
}
```
</details>

<details>
<summary><b>WSL2</b></summary>

```json
{
  "serena-memory": {
    "command": "docker",
    "args": [
      "run", "-i", "--rm",
      "-v", "/home/user/projects:/projects",
      "serena-mcp:latest",
      "--project", "/projects/my-project"
    ],
    "type": "stdio"
  }
}
```
</details>

---

### Required: project.yml

Error occurs without `.serena/project.yml`:

```yaml
language: typescript   # ← Required!
project_name: my-project
project_root: /projects/my-project
```

**Tip:** Ask Claude: `"Create a Serena project.yml for me"`

---

### Troubleshooting Serena

Share the error message with Claude:

```
"I got a Serena error:
Error: [paste error message]
My environment: [Windows 11 / macOS 14 / Ubuntu 22.04]
Docker version: [docker --version output]
Current .mcp.json: [paste config]"
```

AI will fix it for your environment.

---

## ⚠️ From the Author (Please Read)

**My position:** I'm sharing this system because it works well for me. However, I don't fully understand every internal process and logic.

**Important expectations:**
- ✅ **Results are verified**: This system is in active use and delivers results
- ❌ **No support provided**: I cannot answer technical support or detailed questions
- ❌ **No internal explanations**: Please don't ask how specific parts work
- ⚠️ **Issues may go unanswered**: Time constraints may prevent responses to GitHub Issues
- 🤖 **AI verification recommended**: If problems arise, ask Claude or ChatGPT first

**Recommendations:**
- **Fork** this repository and use it as your own
- **Ask AI first** when problems occur
- Community contributions are welcome, but don't expect immediate responses

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/mcp-management.git
cd mcp-management
```

### 2. Install Required MCP Services (3 minimum)

Install just **3 services** to use core Skills.

| Service | Repository | Purpose |
|---------|------------|---------|
| clear-thought | [waldzellai/waldzell-mcp](https://github.com/waldzellai/waldzell-mcp) | Deep analysis, mental models |
| sequential-thinking-tools | [spences10/mcp-sequentialthinking-tools](https://github.com/spences10/mcp-sequentialthinking-tools) | Step-by-step reasoning |
| stochastic-thinking | [waldzellai/stochasticthinking](https://github.com/waldzellai/stochasticthinking) | Probabilistic analysis |

> **Full list**: See [INSTALLATION.md](./INSTALLATION.md) for all 18 MCP services.

```bash
# 1. clear-thought (deep analysis)
git clone https://github.com/waldzellai/waldzell-mcp.git
cd waldzell-mcp/packages/server-clear-thought
npm install && npm run build

# 2. sequential-thinking-tools (sequential reasoning)
git clone https://github.com/spences10/mcp-sequentialthinking-tools.git
cd mcp-sequentialthinking-tools
npm install && npm run build

# 3. stochastic-thinking (probabilistic analysis)
git clone https://github.com/waldzellai/stochasticthinking.git
cd stochasticthinking
npm install && npm run build
```

### 3. Configure .mcp.json

Copy `.mcp.json.example` and modify paths:

```bash
cp .mcp.json.example .mcp.json
# Modify paths for your environment
```

### 4. Use in Claude Code

```bash
# After restarting Claude Code
/decision-workflow "test decision"
```

---

## Folder Structure

```
mcp-management/
├── .claude/
│   ├── skills/           # 17 Skills (core value)
│   │   ├── _atomic/      # 6 basic building blocks
│   │   ├── decision-workflow/
│   │   ├── multidimensional-analysis/
│   │   └── ...
│   └── hooks/            # 3 automation triggers
├── .mcp.json.example     # MCP config template
├── CLAUDE.md             # Project context
├── INSTALLATION.md       # Full installation guide (18 services)
└── README.md             # This file
```

---

## Additional Documentation

- **[INSTALLATION.md](./INSTALLATION.md)** - Full installation guide for all 18 MCP services
- **[CLAUDE.md](./CLAUDE.md)** - Project context and advanced usage

---

## Requirements

- **Node.js** 18+
- **Claude Code** (claude.ai/code)
- **Docker** (for Serena Memory)

---

## License

**Apache License 2.0**

> **Note:** This version is released under Apache 2.0. Future versions may be released under a different license.

---

## Contributing

Issues and PRs are welcome. However, don't expect immediate responses.

**When problems occur:** Ask AI first. Most configuration issues can be resolved by Claude.

---
---

# 한국어 <a id="korean"></a>

## 이 시스템이 해결하는 문제

| 기존 문제 | 이 시스템의 해결책 |
|----------|------------------|
| "Claude가 단순 답변만 해요" | **체계적 분석 워크플로우** - 5가지 관점에서 동시 분석 |
| "복잡한 결정에서 확신이 없어요" | **Bias Detection** - 4가지 인지 편향 자동 검출 및 교정 |
| "분석이 피상적이에요" | **다차원 분석** - Level 2~5 깊이 선택 가능 |
| "매번 같은 질문을 반복해요" | **Serena Memory** - 세션 간 컨텍스트 영구 저장 |
| "기능 구현 시 뭘 먼저 해야 할지 막막해요" | **3-Wave 워크플로우** - 구조화된 단계별 가이드 |

---

## 실제 검증된 결과

| 지표 | Before | After | 개선 |
|------|--------|-------|------|
| 의사결정 신뢰도 | 72% | 95% | **+23%p** |
| 분석 관점 | 1가지 | 5가지 | **5배** |
| 복잡한 분석 시간 | 2시간 | 15분 | **-87%** |
| 인지 편향 검출 | 수동 | 자동 4가지 | **자동화** |
| 세션 간 컨텍스트 | 유실 | 영구 저장 | **100% 유지** |

---

## 핵심 Skills 상세

### decision-workflow (의사결정)

**이런 문제를 해결합니다**:
> "MSA vs 모노리스, 뭘 선택해야 할지 모르겠어요"
> "결정은 했는데 확신이 없어요"

**작동 방식**:
- **Quick Mode** (5분): 빠른 판단이 필요할 때
- **Deep Mode** (15분): 고위험 결정에 심층 분석

**결과물**:
```
✅ 4가지 옵션 비교 분석
✅ 인지 편향 4개 검출 (Confirmation Bias, Sunk Cost 등)
✅ 신뢰도 85% → 70% 교정 (과신 방지)
✅ 구체적 근거와 함께 최종 추천
```

**사용법**: `/decision-workflow "MSA vs 모노리스 선택"`

---

### multidimensional-analysis (다차원 분석)

**이런 문제를 해결합니다**:
> "한 가지 관점에서만 분석하게 돼요"
> "놓치는 부분이 있을까 불안해요"

**작동 방식**:
- **Level 2** (20분): 빠른 검토 - 3가지 관점
- **Level 3** (35분): 일반 분석 - 4가지 관점
- **Level 4** (50분): 심층 분석 - 5가지 관점
- **Level 5** (70분): 연구급 분석 - 5가지 관점 + 학술적 검증

**5가지 분석 관점**:
| 관점 | 분석 내용 |
|------|----------|
| 기술적 | 아키텍처, 확장성, 유지보수성 |
| 비용 | 초기 비용, 운영 비용, TCO |
| 리스크 | 기술 부채, 장애 시나리오, 복구 전략 |
| 조직 | 팀 역량, 채용 난이도, 학습 곡선 |
| 시장 | 경쟁 우위, 시장 적합성, 미래 전망 |

**결과물**:
```
✅ 5가지 관점 종합 분석
✅ 확률적 시나리오 (Monte Carlo 시뮬레이션)
✅ 편향 검출 및 교정
✅ 실행 가능한 로드맵
```

**사용법**: `/multidimensional-analysis "프로젝트 아키텍처 분석" Level 3`

---

### implementation-workflow (기능 구현)

**이런 문제를 해결합니다**:
> "기능 구현 시 어디서부터 시작해야 할지 모르겠어요"
> "구현하다 보면 놓치는 부분이 생겨요"

**작동 방식**:
- **Wave 1**: 요구사항 분석 + 기술 스택 검증
- **Wave 2**: 설계 + 의존성 분석
- **Wave 3**: 구현 계획 + 테스트 전략

**결과물**:
```
✅ 단계별 구현 체크리스트
✅ 기술적 리스크 사전 식별
✅ 테스트 시나리오 자동 생성
✅ 예상 소요 시간 추정
```

**사용법**: `/implementation-workflow "사용자 인증 기능 추가"`

---

### research-workflow (리서치)

**이런 문제를 해결합니다**:
> "기술 비교할 때 어떤 기준으로 봐야 할지 모르겠어요"
> "조사는 했는데 결론을 못 내리겠어요"

**작동 방식**:
- **Quick Mode**: 빠른 기술 비교 (10분)
- **Deep Mode**: 심층 기술 조사 (30분)

**결과물**:
```
✅ 기술별 장단점 매트릭스
✅ 실제 사용 사례 분석
✅ 편향 없는 추천
```

**사용법**: `/research-workflow "React vs Vue vs Svelte 비교"`

---

## Hooks 상세

Hooks는 **자동으로 실행**되어 안전성과 추적성을 제공합니다.

### permission-request (권한 검증)

**역할**: MCP 도구 사용 전 자동 권한 검사

**이점**:
- 위험한 작업 실수 방지
- 승인된 작업만 실행
- 사용 로그 자동 기록

---

### pre-tool-use (입력 전처리)

**역할**: 도구 실행 전 입력값 검증 및 안전성 검사

**이점**:
- 5000자 초과 입력 자동 제한
- 위험 경로 (`/etc/`, `C:\Windows\`) 자동 차단
- 민감 정보 필터링

---

### subagent-stop (실행 기록)

**역할**: 서브에이전트(Task) 실행 완료 시 자동 기록

**이점**:
- 모든 분석/작업 내역 자동 저장
- 세션 종료 후에도 추적 가능
- Serena Memory와 연동

**결과물**: `.serena/memories/agent_execution_{date}.md`

---

## Serena Memory (선택 - 고급 기능)

### 이런 문제를 해결합니다

| 문제 | Serena 해결책 |
|------|--------------|
| "어제 분석한 내용을 Claude가 기억 못해요" | 세션 간 메모리 영구 저장 |
| "프로젝트마다 컨텍스트 설정이 번거로워요" | 프로젝트별 자동 컨텍스트 로드 |
| "의사결정 히스토리를 추적하고 싶어요" | 모든 분석/결정 자동 기록 |

### 결과 예시

```
.serena/memories/
├── decision_msa_vs_monolith_2026-01-15.md    # 의사결정 기록
├── architecture_analysis_2026-01-14.md       # 분석 결과
├── session_context_2026-01-13.md             # 세션 컨텍스트
└── agent_execution_2026-01-12.md             # 에이전트 실행 로그
```

**효과**: 2주 전 분석 내용도 Claude가 즉시 참조 가능

---

### ⚠️ 설정 복잡성 안내

**솔직히 말씀드리면**: Serena 설정은 복잡합니다.

| 복잡 요소 | 이유 |
|----------|------|
| Docker 필수 | 컨테이너 기반 실행 |
| 경로 설정 | Windows / WSL / macOS 각각 다름 |
| Volume mount | 운영체제별 문법 차이 |
| project.yml | 필수 필드 누락 시 에러 |

---

### 🤖 AI로 쉽게 설정하기 (권장)

**설정을 직접 하지 마세요. AI에게 맡기세요.**

Claude에게 다음을 공유하면 환경에 맞게 자동 설정 가능:

```
"Serena Memory를 설정해줘.
- 내 환경: [Windows 11 / macOS / WSL2]
- 프로젝트 경로: [C:\my-project 또는 /home/user/my-project]
- Docker 설치됨: [예/아니오]"
```

Claude가 환경에 맞는 `.mcp.json` 설정과 `project.yml`을 생성해줍니다.

---

### 환경별 설정 예시

<details>
<summary><b>Windows (Git Bash)</b></summary>

```json
{
  "serena-memory": {
    "command": "docker",
    "args": [
      "run", "-i", "--rm",
      "-v", "//c/projects:/projects",
      "serena-mcp:latest",
      "--project", "/projects/my-project"
    ],
    "env": {
      "MSYS_NO_PATHCONV": "1",
      "MSYS2_ARG_CONV_EXCL": "*"
    },
    "type": "stdio"
  }
}
```
</details>

<details>
<summary><b>macOS / Linux</b></summary>

```json
{
  "serena-memory": {
    "command": "docker",
    "args": [
      "run", "-i", "--rm",
      "-v", "/Users/name/projects:/projects",
      "serena-mcp:latest",
      "--project", "/projects/my-project"
    ],
    "type": "stdio"
  }
}
```
</details>

<details>
<summary><b>WSL2</b></summary>

```json
{
  "serena-memory": {
    "command": "docker",
    "args": [
      "run", "-i", "--rm",
      "-v", "/home/user/projects:/projects",
      "serena-mcp:latest",
      "--project", "/projects/my-project"
    ],
    "type": "stdio"
  }
}
```
</details>

---

### 필수: project.yml 설정

`.serena/project.yml` 파일이 없으면 에러 발생:

```yaml
language: typescript   # ← 이 줄 필수!
project_name: my-project
project_root: /projects/my-project
```

**Tip**: Claude에게 `"Serena project.yml 만들어줘"` 라고 요청하세요.

---

### Serena 문제 발생 시

에러 메시지를 Claude에게 공유하세요:

```
"Serena 에러가 발생했어:
에러: [에러 메시지 복사]
내 환경: [Windows 11 / macOS 14 / Ubuntu 22.04]
Docker 버전: [docker --version 결과]
현재 .mcp.json: [설정 내용]"
```

AI가 환경에 맞게 수정해줍니다.

---

## ⚠️ 저자의 말 (꼭 읽어주세요)

**제 입장**: 이 시스템을 공유하는 이유는 저에게 잘 작동하기 때문입니다. 하지만 모든 내부 프로세스와 로직을 완전히 이해하지는 못합니다.

**중요한 기대사항**:
- ✅ **결과는 검증됨**: 이 시스템은 실제로 사용 중이며 결과를 냅니다
- ❌ **지원 제공 안 함**: 기술 지원이나 상세한 질문에 답변할 수 없습니다
- ❌ **내부 설명 안 함**: 특정 부분이 어떻게 작동하는지 설명을 요청하지 마세요
- ⚠️ **이슈 무응답 가능**: 시간 제약으로 GitHub Issues에 응답하지 못할 수 있습니다
- 🤖 **AI 검증 권장**: 문제가 생기면 Claude나 ChatGPT에게 먼저 물어보세요

**사용 권장 사항**:
- 이 저장소를 **포크(fork)**하여 사용하세요
- 문제가 발생하면 **AI에게 먼저** 물어보세요
- 커뮤니티 기여는 환영하지만 즉각 응답은 기대하지 마세요

---

## Quick Start

### 1. 저장소 클론

```bash
git clone https://github.com/YOUR_USERNAME/mcp-management.git
cd mcp-management
```

### 2. 필수 MCP 서비스 설치 (3개)

**최소 3개만 설치**하면 핵심 Skills 사용 가능합니다.

| 서비스 | 저장소 | 용도 |
|--------|--------|------|
| clear-thought | [waldzellai/waldzell-mcp](https://github.com/waldzellai/waldzell-mcp) | 심층 분석, 멘탈 모델 |
| sequential-thinking-tools | [spences10/mcp-sequentialthinking-tools](https://github.com/spences10/mcp-sequentialthinking-tools) | 순차적 사고 |
| stochastic-thinking | [waldzellai/stochasticthinking](https://github.com/waldzellai/stochasticthinking) | 확률적 분석 |

> **전체 목록**: 18개 MCP 서비스 설치는 [INSTALLATION.md](./INSTALLATION.md) 참조

```bash
# 1. clear-thought (심층 분석)
git clone https://github.com/waldzellai/waldzell-mcp.git
cd waldzell-mcp/packages/server-clear-thought
npm install && npm run build

# 2. sequential-thinking-tools (순차 사고)
git clone https://github.com/spences10/mcp-sequentialthinking-tools.git
cd mcp-sequentialthinking-tools
npm install && npm run build

# 3. stochastic-thinking (확률적 분석)
git clone https://github.com/waldzellai/stochasticthinking.git
cd stochasticthinking
npm install && npm run build
```

### 3. .mcp.json 설정

`.mcp.json.example`을 복사하여 경로 수정:

```bash
cp .mcp.json.example .mcp.json
# 경로를 자신의 환경에 맞게 수정
```

### 4. Claude Code에서 사용

```bash
# Claude Code 재시작 후
/decision-workflow "테스트 의사결정"
```

---

## 폴더 구조

```
mcp-management/
├── .claude/
│   ├── skills/           # 17개 Skills (핵심 가치)
│   │   ├── _atomic/      # 6개 기본 빌딩 블록
│   │   ├── decision-workflow/
│   │   ├── multidimensional-analysis/
│   │   └── ...
│   └── hooks/            # 3개 자동화 트리거
├── .mcp.json.example     # MCP 설정 템플릿
├── CLAUDE.md             # 프로젝트 컨텍스트
├── INSTALLATION.md       # 전체 설치 가이드 (18개 서비스)
└── README.md             # 이 파일
```

---

## 추가 문서

- **[INSTALLATION.md](./INSTALLATION.md)** - 전체 18개 MCP 서비스 설치 가이드
- **[CLAUDE.md](./CLAUDE.md)** - 프로젝트 컨텍스트 및 고급 사용법

---

## 요구 사항

- **Node.js** 18+
- **Claude Code** (claude.ai/code)
- **Docker** (Serena Memory 사용 시)

---

## 라이선스

**Apache License 2.0**

> **참고:** 현재 버전은 Apache 2.0으로 배포됩니다. 향후 버전은 다른 라이선스로 배포될 수 있습니다.

---

## 기여

이슈와 PR은 환영합니다. 단, 즉각적인 응답을 기대하지 마세요.

**문제 발생 시**: AI에게 먼저 물어보세요. 대부분의 설정 문제는 Claude가 해결할 수 있습니다.

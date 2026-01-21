# MCP Management System 설치 가이드

## 📋 목차

1. [Quick Start (10분)](#-quick-start-10분)
2. [전체 설치 (30분)](#-전체-설치-30분)
3. [MCP 서비스 상세](#-mcp-서비스-상세)
4. [.mcp.json 설정](#-mcpjson-설정)
5. [문제 해결](#-문제-해결)

---

## ⚡ Quick Start (10분)

**최소 3개 서비스**만 설치하면 핵심 Skills 사용 가능합니다.

### 필수 서비스 (3개)

| 서비스 | 용도 | Skills |
|--------|------|--------|
| clear-thought | 심층 분석, 멘탈 모델 | decision-workflow, multidimensional |
| sequential-thinking | 순차적 사고 | 모든 Skills |
| stochastic-thinking | 확률적 분석 | decision-workflow, multidimensional |

### 설치 명령어

```bash
# 1. clear-thought
git clone https://github.com/waldzellai/waldzell-mcp.git
cd waldzell-mcp/packages/server-clear-thought
npm install && npm run build

# 2. sequential-thinking-tools
git clone https://github.com/spences10/mcp-sequentialthinking-tools.git
cd mcp-sequentialthinking-tools
npm install && npm run build

# 3. stochastic-thinking
git clone https://github.com/waldzellai/stochasticthinking.git
cd stochasticthinking
npm install && npm run build
```

### .mcp.json 설정

```json
{
  "mcpServers": {
    "clear-thought": {
      "command": "node",
      "args": ["/your/path/to/server-clear-thought/dist/index.js"],
      "type": "stdio"
    },
    "sequential-thinking-tools": {
      "command": "node",
      "args": ["/your/path/to/mcp-sequentialthinking-tools/dist/index.js"],
      "type": "stdio"
    },
    "stochastic-thinking": {
      "command": "node",
      "args": ["/your/path/to/stochasticthinking/dist/index.js"],
      "type": "stdio"
    }
  }
}
```

### 검증

```bash
# Claude Code 재시작 후
/decision-workflow "테스트 의사결정"
```

---

## 📦 전체 설치 (30분)

### MCP 서비스 전체 목록 (18개)

#### 분석 도구 (7개)

| 서비스 | 설치 방법 | GitHub |
|--------|----------|--------|
| clear-thought | git clone + npm | [waldzellai/waldzell-mcp](https://github.com/waldzellai/waldzell-mcp) |
| clear-thought-1.5 | git clone + npm | [waldzellai/clear-thought-onepointfive](https://github.com/waldzellai/clear-thought-onepointfive) |
| sequential-thinking-tools | git clone + npm | [spences10/mcp-sequentialthinking-tools](https://github.com/spences10/mcp-sequentialthinking-tools) |
| stochastic-thinking | git clone + npm | [waldzellai/stochasticthinking](https://github.com/waldzellai/stochasticthinking) |
| model-enhancement-servers | git clone + npm | [waldzellai/model-enhancement-servers](https://github.com/waldzellai/model-enhancement-servers) |
| context7 | git clone + npm | (별도 설정 필요) |
| code-context-provider | git clone + npm | (별도 설정 필요) |

#### 개발 도구 (4개)

| 서비스 | 설치 방법 | GitHub |
|--------|----------|--------|
| github-mcp | git clone + npm | [github/github-mcp-server](https://github.com/github/github-mcp-server) |
| npm-sentinel-mcp | git clone + npm | (커뮤니티) |
| node-omnibus-mcp | git clone + npm | (커뮤니티) |
| python-toolbox-mcp | pip install | (Python 기반) |

#### 자동화 도구 (3개)

| 서비스 | 설치 방법 | 공식 사이트 |
|--------|----------|------------|
| playwright-mcp | npm install | [playwright.dev](https://playwright.dev) |
| magic-mcp | npm install | [21st.dev/magic](https://21st.dev/magic) |
| mobile-mcp | npm install | [mobile-next](https://github.com/mobile-next/mobile-mcp) |

#### 백엔드/메모리 (2개)

| 서비스 | 설치 방법 | 비고 |
|--------|----------|------|
| supabase-mcp | Supabase CLI | Supabase 계정 필요 |
| serena-memory | Docker | Docker 빌드 필요 |

---

## 🔧 MCP 서비스 상세

### clear-thought (필수)

심층 분석, 멘탈 모델, 디버깅 접근법 제공

```bash
git clone https://github.com/waldzellai/waldzell-mcp.git
cd waldzell-mcp/packages/server-clear-thought
npm install
npm run build
```

**제공 도구**: mentalmodel, sequentialthinking, debuggingapproach 등 26개

### clear-thought-1.5 (권장)

통합 인지 도구 (30+ operations)

```bash
git clone https://github.com/waldzellai/clear-thought-onepointfive.git
cd clear-thought-onepointfive
npm install
npm run build
```

**제공 도구**: clear_thought (통합 도구, operation 파라미터로 선택)

### sequential-thinking-tools (필수)

순차적 문제 해결

```bash
git clone https://github.com/spences10/mcp-sequentialthinking-tools.git
cd mcp-sequentialthinking-tools
npm install
npm run build
```

### stochastic-thinking (필수)

확률적 의사결정 (Monte Carlo, MDP, MCTS, Bayesian, HMM)

```bash
git clone https://github.com/waldzellai/stochasticthinking.git
cd stochasticthinking
npm install
npm run build
```

### model-enhancement-servers (권장)

인지 강화 모듈 (bias-detection 등 13개)

```bash
git clone https://github.com/waldzellai/model-enhancement-servers.git
cd model-enhancement-servers
npm install
npm run build
```

### serena-memory (선택)

세션 간 메모리 유지 (Docker 필요)

```bash
git clone https://github.com/oramasearch/serena.git
cd serena
docker build -t serena-mcp:latest .
```

**.mcp.json 설정**:
```json
{
  "serena-memory": {
    "command": "docker",
    "args": [
      "run", "-i", "--rm",
      "-v", "/your/projects:/projects",
      "serena-mcp:latest",
      "--project", "/projects/your-project"
    ],
    "type": "stdio"
  }
}
```

---

## ⚙️ .mcp.json 설정

### 경로 설정 (OS별)

#### Windows
```json
{
  "args": ["C:\\Users\\username\\mcp-services\\clear-thought\\dist\\index.js"]
}
```

#### macOS / Linux
```json
{
  "args": ["/Users/username/mcp-services/clear-thought/dist/index.js"]
}
```

### 환경 변수

```json
{
  "env": {
    "MAX_OUTPUT_TOKENS": "64000",
    "DEBUG": "true"
  }
}
```

### 전체 예시

`.mcp.json.example` 파일을 참조하세요.

---

## 🔍 문제 해결

### "MCP 서비스를 찾을 수 없음"

1. 경로 확인: `node /your/path/to/dist/index.js` 실행
2. 빌드 확인: `npm run build` 재실행
3. 권한 확인: 파일 읽기 권한

### "No active project" (Serena)

`.serena/project.yml` 파일 생성:

```yaml
language: typescript
project_name: your-project
project_root: /projects/your-project
```

### "Tool not found"

1. Claude Code 재시작
2. `.mcp.json` 문법 확인 (JSON 유효성)
3. 서비스 로그 확인

### Skills가 작동하지 않음

1. 필수 MCP 서비스 3개 설치 확인
2. `.claude/skills/` 폴더 존재 확인
3. `CLAUDE.md` 파일 존재 확인

---

## 📞 도움 받기

1. **AI에게 물어보기**: Claude, ChatGPT에 오류 메시지 공유
2. **GitHub Issues**: 응답이 늦을 수 있음
3. **커뮤니티**: MCP Discord, Reddit

---

## ✅ 설치 체크리스트

- [ ] Node.js 18+ 설치
- [ ] 필수 MCP 서비스 3개 설치 (clear-thought, sequential, stochastic)
- [ ] `.mcp.json` 설정 완료
- [ ] Claude Code 재시작
- [ ] `/decision-workflow "테스트"` 실행 확인

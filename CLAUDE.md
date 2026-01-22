# . - Claude를 위한 프로젝트 컨텍스트
## 🎯 프로젝트 개요

**프로젝트명: .**
**설명: [프로젝트 설명을 여기에 작성하세요]**
**프레임워크: TypeScript**
**프로젝트 경로: .**
**MCP 통합: 15개 서비스 활성화**
**MCP 버전: v2.1 (.mcp.local.json 병합 지원)**

> 💡 **참고**: 프로젝트 설명과 프레임워크 정보는 해당 프로젝트 세션에서 직접 수정해주세요.

이 문서는 . 프로젝트의 개발 컨텍스트와 MCP 서비스 사용법을 정의합니다.

---

## 🚨 SKILL-FIRST POLICY (필독)

**Skill이 등록되어 있으면 MCP 직접 호출 금지** - 반드시 Skill() 도구 사용

### 등록된 Skills
17개 Skills (v3.0 - 2026-01-01 Atomic/Composite 아키텍처) - 상세: `.claude/skills/` 폴더

**🔷 Atomic Skills (9개)** - 독립 실행 가능한 기본 단위:

`_atomic/` 폴더 (6개):
- core-analysis (v1.0.0): 순차 분석 + 멘탈 모델 + First Principles
- decision-engine (v1.0.0): 확률 분석 + 편향 검출 + 의사결정 프레임워크
- implementation-3wave (v1.0.0): 3-Wave 병렬 구현 패턴
- session-memory (v1.0.0): Serena Memory 상태 저장/복원
- prd-tracker (v1.0.0): PRD 파싱 + TodoWrite 통합 ⭐NEW
- git-safety (v1.0.0): Git checkpoint + rollback 로직 ⭐NEW

Main 폴더 (3개):
- mcp-selector (v1.1.0): MCP 선택 가이드 (정적 참조)
- session-continuity (v2.2.0): 세션 핸드오프 템플릿
- frontend-design (v1.1.0): UI/UX 설계 가이드라인

**🔶 Composite Skills (8개)** - Atomic 조합으로 구성:

| Skill | Version | Dependencies |
|-------|---------|--------------|
| multidimensional-analysis | v3.5.0 | core-analysis, decision-engine, session-memory |
| decision-workflow | v2.9.0 | decision-engine, session-memory |
| implementation-workflow | v3.0.0 | implementation-3wave, session-memory |
| research-workflow | v3.0.0 | core-analysis, decision-engine, session-memory |
| prd-auto-executor | v2.0.0 | prd-tracker, git-safety, session-memory |
| prd-implementation-tracker | v3.0.0 | prd-tracker, session-memory |
| deployment-checklist | v2.0.0 | session-memory, git-safety |
| mcp-management-workflow | v3.0.0 | core-analysis, decision-engine |

**Archived Skills** (`.claude/skills/_archived/`):
- debugging-workflow, health-check-workflow (Hybrid B+ 중복)
- phase0-analysis (multidimensional-analysis W0에 포함됨)
- mcp-skills-health-check (미사용)

**호출 방법**: `/skill-name` 또는 `Skill({ skill: "name" })`

**결정 트리**:
```
작업 요청 → Skill 있음? → YES: Skill() 사용 | NO: MCP 직접 호출
```

---

## ✅ Skill 안전 장치 (v2.6.0 개선)

**2025-12-26 긴급 개선 완료**:

**문제**: multidimensional-analysis Skill 자동 실행으로 세션 2개 소진 (90-95k tokens)

**해결**:
1. ✅ **사용자 승인 필수**: 모든 Skill 실행 전 명시적 승인 + 토큰 예상치 안내
2. ✅ **단계별 중단**: W1 → [사용자 확인] → W2 → [사용자 확인] → W3
3. ✅ **출력 요약**: 100k+ tokens → 1800 tokens (-98% 절감)
4. ✅ **토큰 예산 체크**: 실행 전 예산 확인 (W1 최소 40k, 전체 80k)
5. ✅ **자동 트리거 차단**: 키워드 기반 자동 실행 완전 금지

**개선 효과**:
- Before: 자동 실행 90-95k tokens (사용자 개입 0%)
- After: 40-70k tokens (사용자 제어 100%, 단계별 선택 가능)

**상세**: `.serena/SKILL_ISSUE_ANALYSIS.md` 참조

---

## 🏗️ Architecture Quick Mode (v2.2)

`multidimensional-analysis` Skill의 **아키텍처 전용 경로**
- 토큰: 200-300 (Deep Mode 400-600 대비 33% 절감)
- **트리거**: ❌ 자동 트리거 금지 - 사용자 명시적 호출만 허용
- 4단계: A1(구조) → A2(의존성) → A3(권고) → A4(Exit Decision)

**자동 전환**: 복잡도 ≥5 → Deep Mode (W1-W3)

**상세 내역**: `.claude/skills/multidimensional-analysis/prompt.md` 참조

---

## 🎯 decision-workflow 성능 우선 모드 (v2.3)

**핵심 변화**: 토큰 효율 < **의사결정 신뢰도 95%+**

| 항목 | v2.1 | v2.3 | 개선 |
|------|------|------|------|
| 토큰 | 200-300 | 150-250 (기본)<br>300-450 (고위험) | -25-50 (최적화) |
| 신뢰도 | 72% | **95%+** | **+23%p** |
| 편향 제거 | ❌ | ✅ Bias Detection | 신규 |
| 확률 분석 | ❌ | ✅ Stochastic (조건부) | 신규 |

**v2.3 최적화** (2025-12-27):
- model-enhancement-servers 제거 (템플릿 시스템으로 확인)
- 실제 작동 MCP만 사용: sequential-thinking + stochastic-thinking
- 토큰 절감: -150-250 tokens/실행

**Architecture Preset**: MSA/모노리스 의사결정 시 자동 활성화 (토큰 250-350)

**상세 내역**: `.claude/skills/decision-workflow/prompt.md` 참조

---

## 🔍 프로젝트 구조

- **루트**: `.`
- **MCP 설정**: `.mcp.json` (15개 서비스), `.mcp.local.json` (프로젝트별 override)
- **브리지**: `mcp-bridge-config.json` (간접 호출용)
- **서비스 위치**: `./services/` (MCP 서비스 설치 시 생성)

### MCP 연동 방법
1. **직접 호출**: Claude Code의 MCP 도구
2. **간접 호출**: `mcp-bridge.cjs` 명령행

---

## ⚠️ MCP 서비스 아키텍처 구분 (필독)

**CRITICAL**: clear-thought와 clear-thought-1.5는 완전히 다른 아키텍처를 가집니다.

### clear-thought
- **아키텍처**: 26개 **개별 도구** (Individual Tools)
- **도구 목록**: mentalmodel, sequentialthinking, debuggingapproach, collaborativereasoning, decisionframework, socraticmethod, creativethinking, systemsthinking, scientificmethod, structuredargumentation, visualreasoning, metacognitivemonitoring, 등 26개
- **호출 방식**: `mcp__clear-thought__TOOL_NAME()`
- **예시**: `mcp__clear-thought__mentalmodel({ modelName: "first_principles", ... })`

### clear-thought-1.5
- **아키텍처**: 1개 **통합 도구** (Unified Tool) + 38개 operations
- **도구 이름**: clear_thought (단일 도구)
- **호출 방식**: `mcp__clear-thought-1_5__clear_thought({ operation: "OPERATION_NAME" })`
- **예시**: `mcp__clear-thought-1_5__clear_thought({ operation: "mental_model", prompt: "...", parameters: { model: "first_principles" } })`

### 흔한 실수 (Common Mistakes)
1. ❌ `mcp__clear-thought__clear_thought()` - clear-thought에는 통합 도구가 없음
2. ❌ `mcp__clear-thought-1_5__mentalmodel()` - clear-thought-1.5는 개별 도구가 아닌 operation 파라미터 사용

### 빠른 참조
**상세 가이드**: `MCP_TOOL_QUICK_REFERENCE.md` - 모든 MCP 서비스의 아키텍처와 사용법

### 사용 전 검증 (Pre-Flight Check)
```
1. 서비스 이름 확인: clear-thought vs clear-thought-1.5
2. 아키텍처 확인: 개별 도구 vs 통합 도구
3. 도구 이름 확인: MCP_TOOL_QUICK_REFERENCE.md 참조
4. 파라미터 확인: README.md 또는 skill 예시 참조
```

**검증 시간**: 2분 투자 → 30분 디버깅 절약

---

## ⭐ .mcp.local.json 병합 (v2.1)

프로젝트별 MCP 커스터마이징:
```json
{
  "mcpServers": {
    "clear-thought": {
      "env": { "MAX_OUTPUT_TOKENS": "128000" }
    }
  }
}
```

**병합 규칙**: Base + Local 병합, 실패 시 Circuit Breaker

**템플릿**: `.mcp.local.json.example` 복사 후 사용

**6가지 시나리오**:
1. 경량 프로젝트: 컨텍스트 28k → 12k (-57%)
2. Frontend (React/Next.js): 9개 서비스
3. Backend (Node.js API): 8개 서비스
4. 분석/연구 (AI/ML): 8개 서비스
5. 환경 변수 Override
6. 프로젝트 전용 MCP 추가

---

## 🎣 Claude Code Hooks (v2.0.42+)

**3가지 Hooks**:
1. **PermissionRequest** (`.claude/hooks/permission-request.js`)
   - MCP 사용 전 권한 검증
   - 자동 승인/거부 규칙
   - 사용량 로깅 (.serena/mcp_usage_log.jsonl)

2. **PreToolUse** (`.claude/hooks/pre-tool-use.js`)
   - 입력값 전처리 (5000자 제한, 위험 경로 차단)

3. **SubagentStop** (`.claude/hooks/subagent-stop.js`) **v2.0.0**
   - 서브에이전트 실행 기록 Serena Memory 자동 저장
   - `agent_transcript_path` 활용 (Claude Code v2.0.42+)
   - 추적 대상: prd-auto-executor, general-purpose, Explore, Plan
   - 저장 위치: `.serena/memories/{agent}_execution_{date}_{time}.md`

**사용량 분석**: `node scripts/analyze-mcp-usage.js`

---

## 🔧 MCP Management System (15개 서비스)

### 직접 호출
```javascript
Task("분석 작업", {
  subagent_type: "general-purpose",
  prompt: "프로젝트 분석"
});
```

### 간접 호출
```bash
node "./mcp-bridge.cjs" clear-thought analyze
```

### 세션 중 MCP 토글 (v2.0.60+)

세션 중 불필요한 MCP 서비스를 끄면 컨텍스트 사용량을 줄일 수 있습니다:

```bash
# 서비스 비활성화
/mcp disable mobile-mcp
/mcp disable playwright-mcp
/mcp disable supabase-mcp

# 서비스 재활성화
/mcp enable mobile-mcp
```

**활용 시나리오**:
| 작업 유형 | 끌 수 있는 서비스 | 예상 절감 |
|----------|------------------|----------|
| 분석/연구 | mobile-mcp, playwright-mcp, supabase-mcp | ~15% |
| 프론트엔드 | python-toolbox-mcp, supabase-mcp | ~10% |
| 백엔드 API | mobile-mcp, playwright-mcp | ~10% |

**주의**: 비활성화된 서비스는 세션 종료 시 자동 복원됩니다.

### 서비스 목록

**분석 도구 (7개)**:
1. clear-thought: 심층 순차 분석
2. clear-thought-1.5: 시스템 사고
3. sequential-thinking-tools: 순차적 문제 해결
4. stochastic-thinking: 확률적 의사결정
5. context7: 코드 컨텍스트 분석
6. code-context-provider-mcp: 코드 컨텍스트 제공
7. model-enhancement-servers: ~~인지 강화~~ **템플릿 시스템** (2025-12-27 확인, skills에서 제거됨)

**개발 도구 (4개)**:
8. github-mcp: GitHub 통합
9. npm-sentinel-mcp: NPM 모니터링
10. node-omnibus-mcp: Node.js 유틸리티
11. python-toolbox-mcp: Python 도구

**자동화 도구 (3개)**:
12. playwright-mcp: 브라우저 자동화
13. magic-mcp: 범용 자동화
14. mobile-mcp: 모바일 개발

**백엔드 (1개)**:
15. supabase-mcp: Supabase 통합

**상세 사용법**: 각 서비스 README.md 참조

---

## 🔧 Serena MCP Troubleshooting

### "No active project" 에러 해결

**증상**: Serena Memory 도구 사용 시 "No active project. Available projects: []" 에러

**ROOT CAUSE** (2026-01-14 확인):
`.serena/project.yml`에 **필수 필드 `language` 누락**
```
ERROR: KeyError: 'language'
```

**영구 수정 방안** (v1.1.0 - 자동화):
```bash
# 새 프로젝트 추가 시 자동으로 language 필드 포함
node scripts/apply-full-mcp-services.js

# 자동 생성됨:
# - .mcp.json (Git Bash 호환 경로)
# - .serena/project.yml (language: typescript 포함)
```

**Quick Fix** (기존 프로젝트):
```bash
# 1. project.yml에 language 필드 추가
echo "language: typescript" | cat - .serena/project.yml > temp && mv temp .serena/project.yml

# 또는 스크립트 사용 (자동 수정)
node scripts/apply-full-mcp-services.js

# 2. Claude Code 재시작

# 3. 테스트
# Claude: "list_dir 도구로 현재 디렉토리 확인"
```

**수동 Fix** (.serena/project.yml 수정):
```yaml
language: typescript  # ← 이 줄 추가 필수!
project_name: your-project
project_root: /projects/your-project
created_at: 2026-01-14T02:40:35.047Z
```

**.mcp.json 권장 설정** (Git Bash 호환):
```json
{
  "serena-memory": {
    "args": [
      "run", "-i", "--rm",
      "-v", "//c/claude-development:/projects",
      "serena-mcp:latest",
      "--project", "/projects/your-project"
    ],
    "env": {
      "MSYS_NO_PATHCONV": "1",
      "MSYS2_ARG_CONV_EXCL": "*"
    },
    "type": "stdio"
  }
}
```

**체크리스트**:
1. [ ] ✅ .serena/project.yml에 `language: typescript` 필드 존재 (최우선!)
2. [ ] .mcp.json의 volume mount 경로: `//c/` 형식 (Git Bash 호환)
3. [ ] .serena 폴더 존재
4. [ ] project_name 충돌 확인 (프로젝트별 고유)
5. [ ] Claude Code 재시작

**검증된 해결 과정** (2026-01-14):
- Level 3 multidimensional-analysis로 근본 원인 규명
- 신뢰도: 94% → 100% (실제 테스트로 검증)
- 5개 프로젝트 모두 수정 후 정상 작동 확인

---

## 📋 Quick Start

```javascript
// 즉시 테스트
Task("프로젝트 분석", {
  subagent_type: "general-purpose",
  prompt: "Clear Thought로 현재 프로젝트 상태 분석"
});
```

---

**시스템 버전**: MCP Management System v3.0 (Atomic/Composite Architecture)
**최종 업데이트**: 2026-01-01
**구성 서비스**: 15개
**브릿지 지원**: ✅ 간접 호출 활성화
**새 기능**: ✅ .mcp.local.json 병합

> 📄 **팀 커스터마이징 섹션**: `CLAUDE_EXTENDED.md` 파일 참조 (배포 절차, 협업 규칙 등)

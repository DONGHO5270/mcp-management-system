---
name: frontend-design
version: 3.0.0
type: atomic
description: 고품질 UI 디자인 + 프로덕션 통합. 디자인 100% 유지 원칙.
auto_load: true
subagent_compatible: true
permission_mode: "allow"
tags:
  - frontend
  - design
  - ui-ux
  - page-integration
triggers:
  - frontend
  - UI design
  - UI 통합
  - 페이지 통합
  - page integration
  - component integration
capabilities:
  - component_integration
  - page_integration
  - feature_integration
  - design_fidelity_verification
  - data_binding_separation
mcp_dependencies: []  # 외부 MCP 의존성 없음
---

# Frontend Design Skill v3.0.0

**고품질 UI 디자인 + Production 통합 워크플로우**

## v3.0.0 핵심 변경 (from v2.x)

| 항목 | v2.x | v3.0.0 |
|------|------|--------|
| v0-mcp 의존성 | 필수 (유료) | **제거** |
| UI 소스 | v0-mcp 전용 | **다양화** (v0.dev 웹, Figma, 직접 작성) |
| 메인 워크플로우 | Mode 0 (v0-mcp) | **Mode 1 (UI 통합)** |
| 폴백 | 수동 가이드 | **불필요** (MCP 의존 없음) |

---

## UI 소스 옵션

| 소스 | 설명 |
|------|------|
| v0.dev 웹사이트 | 브라우저에서 직접 생성 후 코드 복사 |
| Figma → 코드 | Figma 플러그인 또는 수동 변환 |
| 직접 작성 | Tailwind + shadcn/ui로 직접 코딩 |
| 기타 도구 | Builder.io, Locofy 등 |

---

## 통합 타입 분류

### Type A: 컴포넌트 통합
```
v0 생성물: Button, Card, Input 등 개별 UI 컴포넌트
대상 경로: components/ui/
영향 범위: 해당 컴포넌트 사용하는 모든 페이지
```

### Type B: 페이지 통합 ⭐ NEW
```
v0 생성물: Board View, Dashboard, Settings 등 전체 페이지
대상 경로: app/[page]/page.tsx
영향 범위: 해당 페이지만
```

### Type C: Feature 통합 ⭐ NEW
```
v0 생성물: Progress Widget, Task Card, Sidebar 등 기능 단위
대상 경로: components/features/ 또는 해당 페이지
영향 범위: Feature 사용 영역
```

---

## 8원칙 (P0-P7) - 확장 버전

| 우선순위 | 원칙 | 설명 | 적용 타입 |
|---------|------|------|----------|
| **P0** | v0 생성 | v0.dev에서 적절한 단위로 생성 | All |
| **P1** | 디자인 100% 유지 | className, 스타일 절대 수정 금지 | All |
| **P2** | 데이터/로직 분리 | v0 UI + 기존 데이터 바인딩 분리 | B, C |
| **P3** | 백업 필수 | 통합 전 원본 보존 | All |
| **P4** | 변경 추적 | Git diff로 검증 | All |
| **P5** | 점진적 통합 | 한 번에 하나씩 | All |
| **P6** | 롤백 준비 | 언제든 복구 가능 | All |
| **P7** | 문서화 | 통합 기록 유지 | All |

### P2 상세: 데이터/로직 분리 (NEW)

v0 생성 페이지는 **더미 데이터**를 포함합니다. 실제 통합 시:

```tsx
// v0 생성 코드 (더미 데이터)
const tasks = [
  { id: 1, title: "Fix auth bug", quadrant: "Q1" },
  { id: 2, title: "Review PRs", quadrant: "Q2" },
]

// 프로덕션 통합 (실제 데이터 바인딩)
const { tasks } = useTaskStore()  // 기존 상태 관리 연결
```

**분리 원칙**:
1. v0 UI 구조/스타일 → 100% 유지 (P1)
2. 더미 데이터 → 실제 데이터 소스로 교체 (P2)
3. 이벤트 핸들러 → 기존 로직 연결 (P2)

---

## 통합 워크플로우

### Type A: 컴포넌트 통합

```
Step 1: 백업 → .design-backup/
Step 2: v0 코드 분석 (P1 검증)
Step 3: import 조정만 수행
Step 4: git diff 검증
Step 5: 사용자 승인 → 커밋
```

### Type B: 페이지 통합 (NEW)

```
Step 1: 백업
  └─ cp app/board/page.tsx .design-backup/board_page_[timestamp].tsx

Step 2: v0 페이지 분석
  ├─ UI 구조 파악
  ├─ 더미 데이터 위치 확인
  └─ 이벤트 핸들러 목록화

Step 3: 데이터 바인딩 매핑
  ├─ v0 더미 데이터 → 실제 데이터 소스 매핑
  ├─ v0 이벤트 → 기존 핸들러 매핑
  └─ 매핑 테이블 생성

Step 4: 통합 실행
  ├─ v0 페이지 코드 복사
  ├─ 더미 데이터 → 실제 바인딩 교체
  ├─ 이벤트 핸들러 연결
  └─ **className/스타일 절대 수정 금지** (P1)

Step 5: 검증
  ├─ 브라우저 시각 확인
  ├─ 기능 테스트
  └─ git diff (스타일 변경 없음 확인)

Step 6: 사용자 승인 → 커밋
```

### Type C: Feature 통합 (NEW)

```
Type B와 동일하나 범위가 Feature 단위
예: Progress Widget, Task List, Sidebar 등
```

---

## UI 생성 프롬프트 가이드 (v0.dev 등)

### 컴포넌트 생성 (Type A)
```
Create a [Component Name] with:
- [specific requirements]
- Use Tailwind CSS
- Include dark mode support
- Make it accessible (ARIA)
```

### 페이지 생성 (Type B) ⭐ RECOMMENDED
```
Create a complete [Page Name] page with:
- [Layout description]
- [Feature list]
- Use dummy data for now (will be replaced)
- Include all interactive states
- Use Tailwind CSS + shadcn/ui patterns
- Support dark mode
```

### Feature 생성 (Type C)
```
Create a [Feature Name] component that:
- [Feature description]
- Shows [specific UI elements]
- Accepts props for data binding
- Use Tailwind CSS
```

---

## 예시: Board 페이지 통합

### Step 1: UI 생성 (v0.dev 등)
```
프롬프트: "Create a Quadro board page with 4 quadrants (Q1-Q4),
task cards with priority badges, progress widgets sidebar,
and weekly progress chart. Use shadcn/ui and Tailwind."
```

### Step 2: 데이터 매핑 테이블
```markdown
| v0 더미 데이터 | 실제 소스 |
|---------------|----------|
| tasks[] | useTaskStore().tasks |
| projects[] | useProjectStore().projects |
| completedCount | computed from tasks |
| onTaskClick | handleTaskOpen() |
| onAddTask | handleAddTask() |
```

### Step 3: 통합 코드
```tsx
// app/board/page.tsx
import { BoardView } from "@/components/features/board-view" // v0 생성
import { useTaskStore } from "@/stores/task-store" // 기존

export default function BoardPage() {
  const { tasks, addTask, updateTask } = useTaskStore()

  return (
    <BoardView
      tasks={tasks}           // v0 더미 → 실제 데이터
      onAddTask={addTask}     // v0 핸들러 → 실제 로직
      onUpdateTask={updateTask}
    />
  )
}
```

---

## P1 위반 패턴 (자동 검출)

```
❌ 조건부 className: className={isActive ? "..." : "..."}
❌ 동적 스타일: style={{...dynamicStyles}}
❌ dark: 클래스 제거
❌ transition/hover 효과 제거
❌ focus:ring 접근성 스타일 제거
❌ 레이아웃 구조 변경 (grid → flex 등)
❌ spacing 값 수정 (p-4 → p-3 등)
```

---

## 성공 기준

- [ ] 원본 UI 디자인이 프로덕션에서 100% 동일하게 보임
- [ ] 기존 데이터/로직이 정상 연결됨
- [ ] P1 위반 없음 (className 변경 없음)
- [ ] 롤백 가능 상태 유지

---

**Source**: Extended from [Anthropic's frontend-design plugin](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design)

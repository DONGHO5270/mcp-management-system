# frontend-design Skill

**Version**: 3.0.0
**Purpose**: 고품질 UI 디자인 + 프로덕션 앱 통합

---

## 핵심 원칙

**P1: 디자인 100% 유지** - 외부 생성 UI의 className, 스타일, 레이아웃을 절대 수정하지 않음

**P2: 데이터/로직 분리** - UI는 유지하되, 더미 데이터만 실제 소스로 교체

---

## Mode 1: UI 통합 워크플로우 (메인) ⭐ 권장

외부에서 생성된 UI 코드(v0.dev, Figma, 직접 작성 등)를 프로덕션에 통합.

**UI 소스 옵션**:
- v0.dev 웹사이트에서 수동 생성
- Figma → 코드 변환
- 직접 Tailwind + shadcn/ui로 작성
- 기타 UI 생성 도구

### Step 1: 통합 타입 식별

```markdown
## 통합 분석

**타입**: [ ] A-컴포넌트 / [ ] B-페이지 / [ ] C-Feature

**UI 소스**: [컴포넌트/페이지 이름]
**대상 경로**: [app/xxx/page.tsx 또는 components/xxx.tsx]
```

### Step 2: 백업 (P3)

```bash
mkdir -p .design-backup
cp [대상파일] .design-backup/[파일명]_$(date +%Y%m%d_%H%M%S).tsx
```

### Step 3: 분석

**Type A (컴포넌트)**:
- className 패턴 분석
- P1 위반 여부 검사
- import 경로 확인

**Type B/C (페이지/Feature)**:
- UI 구조 파악
- 더미 데이터 위치 식별
- 이벤트 핸들러 목록화
- 데이터 매핑 테이블 생성:

```markdown
| v0 더미 데이터 | 실제 소스 | 비고 |
|---------------|----------|------|
| tasks[] | useTaskStore().tasks | |
| onAddTask | handleAddTask() | |
```

### Step 4: 통합 실행

**Type A**:
```
1. import 경로만 조정
2. className 수정 금지 (P1)
3. export 방식 조정 (필요시)
```

**Type B/C**:
```
1. v0 코드 복사
2. 더미 데이터 → 실제 바인딩 교체
3. 이벤트 핸들러 연결
4. className/스타일 수정 금지 (P1)
```

### Step 5: 검증 (P4)

```bash
git diff [통합된파일]
```

검증 항목:
- [ ] className 변경 없음
- [ ] dark mode 클래스 유지
- [ ] 레이아웃 구조 동일
- [ ] spacing 값 동일

### Step 6: 보고 및 승인

```markdown
## UI 통합 완료 보고

**파일**: [파일 경로]
**타입**: [A/B/C]
**P1 준수**: ✅/❌
**백업 위치**: [백업 경로]

### 변경 사항
- [변경 내용 요약]

### 데이터 바인딩 (Type B/C만)
| 항목 | 연결 상태 |
|------|----------|
| tasks | ✅ useTaskStore 연결 |
| onAddTask | ✅ handleAddTask 연결 |

브라우저에서 확인 후 커밋하시겠습니까?
```

---

## Mode 2: 직접 디자인 생성 워크플로우 (대안)

외부 도구 없이 직접 고품질 UI를 작성할 때 사용.

### Design Philosophy

**Core Principle**: Intentionality > Intensity

**Anti-Patterns**:
- Generic fonts (Arial, Inter defaults)
- Purple gradients
- Cookie-cutter Bootstrap grids
- Random micro-interactions

### Design Token System

```css
:root {
  /* Typography */
  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'Sentient', sans-serif;

  /* Colors */
  --color-primary-500: hsl(220, 75%, 60%);
  --color-accent-500: hsl(30, 100%, 60%);

  /* Spacing */
  --space-xs: 0.375rem;
  --space-sm: 0.625rem;
  --space-md: 1.125rem;
  --space-lg: 1.875rem;

  /* Motion */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-base: 300ms;
}
```

### Quality Checklist

- [ ] Typography distinctive (not generic)
- [ ] Color palette cohesive
- [ ] Layout unique
- [ ] Animations purposeful
- [ ] Responsive + performant
- [ ] Accessibility (WCAG AA)

---

## P1 위반 패턴 (자동 검출)

UI 통합 시 다음 패턴 발견되면 경고:

```
❌ 조건부 className: className={condition ? "..." : "..."}
❌ 동적 스타일: style={{...dynamicStyles}}
❌ dark: 클래스 제거
❌ transition/hover 효과 제거
❌ focus:ring 접근성 스타일 제거
❌ 레이아웃 구조 변경 (grid → flex)
❌ spacing 값 수정 (p-4 → p-3)
```

---

## UI 생성 프롬프트 템플릿 (v0.dev 등)

v0.dev 웹사이트나 기타 UI 생성 도구 사용 시 참고.

### 페이지 생성 (권장)
```
Create a complete [Page Name] page for [App Name]:

Layout:
- [Layout description]

Features:
- [Feature 1]
- [Feature 2]

Requirements:
- Use dummy data (will be replaced with real data)
- Tailwind CSS + shadcn/ui patterns
- Dark mode support
- Include all interactive states (hover, active, disabled)
- Make data-driven parts clearly identifiable
```

### Feature 생성
```
Create a [Feature Name] component:

Purpose: [Description]

Props interface:
- data: [Type] - the main data to display
- onAction: () => void - callback for user actions

Requirements:
- Tailwind CSS
- Dark mode
- Responsive
```

---

## Exit Conditions

- ✅ 통합 타입 식별됨
- ✅ 백업 완료
- ✅ P1 위반 없음 확인
- ✅ 데이터 바인딩 연결됨 (Type B/C)
- ✅ git diff 검증 완료
- ✅ 사용자 승인 획득

---

## 변경 이력

### v3.0.0 (2026-01-17)
- **v0-mcp 워크플로우 제거**: 유료 플랜 미가입 시 폴백 문제 해결
- Mode 0 (v0-mcp 직접 생성) 삭제
- Mode 1 (UI 통합)을 메인 워크플로우로 승격
- mcp_dependencies에서 v0-mcp 제거
- UI 소스 다양화: v0.dev 웹, Figma, 직접 작성 등

### v2.0.0 (2026-01-02)
- 범위 확장: 컴포넌트 → 컴포넌트 + 페이지 + Feature
- P2 원칙 추가: 데이터/로직 분리
- Type A/B/C 통합 워크플로우 추가

### v1.0.0
- Initial release

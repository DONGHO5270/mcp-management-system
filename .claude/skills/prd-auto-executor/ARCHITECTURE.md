# prd-auto-executor Architecture

**Version**: 1.0.0
**Last Updated**: 2025-11-14
**Status**: Day 1 Design Phase

---

## 🎯 System Overview

prd-auto-executor는 PRD 기반 체크리스트를 자동으로 실행하는 Semi-Auto 시스템입니다.

### Core Philosophy
- **Semi-Auto**: 기계가 실행, 사람이 승인
- **Safety-First**: Git 체크포인트 + 자동 롤백
- **Stateless-Resilient**: execution_state.json으로 세션 재개
- **SDD-Verified**: 테스트/빌드/린트 검증 후 커밋

---

## 🏗️ 3-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Tier 1: Planning Layer                    │
│           (Existing: prd-implementation-tracker)             │
│  - PRD 문서 분석                                              │
│  - 작업 추출 및 우선순위 지정                                 │
│  - checklist.json 생성                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    checklist.json
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Tier 2: Execution Engine                    │
│                (New: prd-auto-executor)                       │
│  - 체크리스트 자동 실행                                       │
│  - Git 체크포인트 생성                                        │
│  - 사용자 승인 요청 (AskUserQuestion)                         │
│  - 상태 영속화 (execution_state.json)                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    code changes
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Tier 3: Validation & Rollback                   │
│                (New: prd-auto-executor)                       │
│  - npm test 실행                                              │
│  - npm run build 실행                                         │
│  - npm run lint 실행 (optional)                               │
│  - ✅ 성공 → Git commit                                       │
│  - ❌ 실패 → Git rollback to checkpoint                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Component Architecture

### 6 Core Components

```
prd-auto-executor/
├── StateManager      # 상태 영속화
├── GitManager        # Git 조작
├── Executor          # 실행 엔진
├── Validator         # 검증 로직
├── UserInterface     # 사용자 승인
└── ErrorHandler      # 에러 처리
```

---

## 🔧 Component Details

### 1. StateManager

**책임**: execution_state.json CRUD

**Interface**:
```typescript
class StateManager {
  // 상태 로드
  loadState(projectPath: string): ExecutionState | null

  // 상태 저장
  saveState(state: ExecutionState): void

  // 작업 상태 업데이트
  updateTaskStatus(taskIndex: number, status: TaskStatus): void

  // 재시도 카운트 증가
  incrementRetry(taskIndex: number): number

  // 상태 초기화
  resetState(projectPath: string): void

  // 재개 가능 여부
  canResume(): boolean
}
```

**State Schema**:
```typescript
interface ExecutionState {
  projectPath: string;        // 프로젝트 경로
  currentPhase: string;       // "Phase 1", "Phase 2", etc.
  currentTask: string;        // "Hero Section 구현"
  taskIndex: number;          // 0-based index
  status: TaskStatus;         // pending/in_progress/completed/failed
  retryCount: number;         // 0-3
  maxRetries: number;         // 3
  lastCheckpoint: string;     // "checkpoint-4"
  timestamp: string;          // ISO 8601
}

type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
```

**File Location**: `{projectPath}/execution_state.json`

---

### 2. GitManager

**책임**: Git 체크포인트 및 롤백

**Interface**:
```typescript
class GitManager {
  // 체크포인트 생성 (git tag)
  createCheckpoint(taskIndex: number): Promise<string>

  // 작업 커밋
  commitTask(taskName: string, message?: string): Promise<void>

  // 롤백
  rollbackToCheckpoint(checkpointTag: string): Promise<void>

  // 현재 브랜치 확인
  getCurrentBranch(): Promise<string>

  // 미커밋 변경사항 확인
  hasUncommittedChanges(): Promise<boolean>

  // 체크포인트 목록
  listCheckpoints(): Promise<string[]>

  // 체크포인트 삭제
  deleteCheckpoint(checkpointTag: string): Promise<void>
}
```

**Git Strategy**:
```bash
# 작업 시작 전
git tag checkpoint-0

# 작업 실행 중
[Task 0 수행]

# 검증 실패 시
git reset --hard checkpoint-0
git clean -fd  # 추적되지 않은 파일 삭제

# 검증 성공 시
git add .
git commit -m "✅ Task 0: Hero Section 구현 완료

- 테스트 통과: npm test
- 빌드 성공: npm run build
- 린트 통과: npm run lint

🤖 Generated with prd-auto-executor
"
```

**Dependencies**: `simple-git`

---

### 3. Executor

**책임**: 체크리스트 실행 로직

**Interface**:
```typescript
class Executor {
  constructor(
    private stateManager: StateManager,
    private gitManager: GitManager,
    private validator: Validator,
    private userInterface: UserInterface
  ) {}

  // 체크리스트 전체 실행
  async executeChecklist(
    checklistPath: string,
    projectPath: string
  ): Promise<ExecutionResult>

  // 단일 작업 실행
  async executeTask(
    task: Task,
    taskIndex: number
  ): Promise<'success' | 'failed' | 'skipped'>

  // 작업 수행 (내부)
  private async performTask(task: Task): Promise<void>

  // 성공 처리
  private async handleSuccess(task: Task, taskIndex: number): Promise<void>

  // 실패 처리
  private async handleFailure(
    task: Task,
    taskIndex: number,
    error: Error
  ): Promise<void>
}
```

**Execution Flow**:
```
1. loadState() → 이전 상태 확인
2. FOR EACH task:
   a. createCheckpoint(taskIndex)
   b. requestApproval(task)
      - 승인 → 계속
      - 건너뛰기 → 다음 작업
      - 중단 → 전체 중단
   c. performTask(task)
   d. validateAll()
      - ✅ 성공 → commitTask()
      - ❌ 실패 → rollbackToCheckpoint()
   e. saveState()
3. RETURN ExecutionResult
```

---

### 4. Validator

**책임**: 테스트/빌드/린트 검증

**Interface**:
```typescript
class Validator {
  // 테스트 실행
  async runTests(): Promise<ValidationResult>

  // 빌드 실행
  async runBuild(): Promise<ValidationResult>

  // 린트 실행 (optional)
  async runLint(): Promise<ValidationResult>

  // 전체 검증
  async validateAll(): Promise<{
    passed: boolean;
    results: Record<string, ValidationResult>;
  }>

  // 명령어 실행 (internal)
  private async runCommand(command: string): Promise<ValidationResult>
}

interface ValidationResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
}
```

**Validation Order** (Fail-Fast):
```
1. npm test         (실패 시 즉시 중단)
2. npm run build    (실패 시 즉시 중단)
3. npm run lint     (선택사항, 실패해도 경고만)
```

**Dependencies**: Node.js `child_process.exec`

---

### 5. UserInterface

**책임**: AskUserQuestion 호출

**Interface**:
```typescript
class UserInterface {
  // 작업 승인 요청
  async requestApproval(task: Task): Promise<ApprovalResult>

  // 진행률 표시
  displayProgress(current: number, total: number): void
}

type ApprovalResult = 'approved' | 'skipped' | 'aborted';
```

**AskUserQuestion Pattern**:
```typescript
const response = await AskUserQuestion({
  questions: [{
    question: `작업을 진행하시겠습니까?\n\n**${task.name}**\n${task.description}`,
    header: "작업 승인",
    options: [
      { label: "승인", description: "테스트/빌드 후 자동 커밋" },
      { label: "건너뛰기", description: "다음 작업으로 이동" },
      { label: "중단", description: "전체 실행 중단" }
    ],
    multiSelect: false
  }]
});
```

---

### 6. ErrorHandler

**책임**: 에러 처리 및 복구

**Interface**:
```typescript
class ErrorHandler {
  // 에러 처리
  handleError(error: Error, context: ErrorContext): ErrorResolution

  // 복구 가능 여부
  isRecoverable(error: Error): boolean

  // 재시도 로직
  shouldRetry(error: Error, retryCount: number): boolean
}

interface ErrorContext {
  task: Task;
  taskIndex: number;
  retryCount: number;
  lastCheckpoint: string;
}

interface ErrorResolution {
  action: 'retry' | 'skip' | 'abort';
  message: string;
}
```

---

## 🔄 Data Flow

### 1. 정상 흐름 (Happy Path)

```
User: "/prd-auto-executor"
  ↓
Executor.executeChecklist()
  ↓
StateManager.loadState()
  ↓
FOR task IN checklist:
  ↓
  GitManager.createCheckpoint(taskIndex)
  ↓
  UserInterface.requestApproval(task)  → User: "승인"
  ↓
  Executor.performTask(task)
  ↓
  Validator.validateAll()
    → runTests() ✅
    → runBuild() ✅
    → runLint() ✅
  ↓
  GitManager.commitTask(task.name)
  ↓
  StateManager.updateTaskStatus(taskIndex, 'completed')
  ↓
  StateManager.saveState()
  ↓
NEXT task
```

### 2. 실패 흐름 (Failure Path)

```
Validator.validateAll()
  → runTests() ❌ (exitCode: 1)
  ↓
Executor.handleFailure(task, taskIndex, error)
  ↓
GitManager.rollbackToCheckpoint(`checkpoint-${taskIndex}`)
  ↓
StateManager.incrementRetry(taskIndex)
  ↓
IF retryCount < maxRetries:
  ↓
  UserInterface.requestApproval(task)  → User: "승인" (재시도)
  ↓
  RETRY task
ELSE:
  ↓
  ErrorHandler.handleError() → "abort"
  ↓
  StateManager.updateTaskStatus(taskIndex, 'failed')
  ↓
  StateManager.saveState()
  ↓
  THROW Error("Task failed after 3 retries")
```

### 3. 세션 재개 흐름 (Resume Path)

```
User: "/prd-auto-executor" (다음 세션)
  ↓
StateManager.loadState()
  ↓
IF state.status === 'in_progress':
  ↓
  UserInterface.displayMessage("이전 세션 발견")
  ↓
  UserInterface.requestApproval("재개하시겠습니까?")
  ↓
  User: "승인"
  ↓
  Executor.executeChecklist(fromIndex: state.taskIndex)
```

---

## 📁 File Structure

```
.claude/skills/prd-auto-executor/
├── README.md                    # 사용법, 설치 가이드
├── ARCHITECTURE.md              # 현재 문서
├── prompt.md                    # Skill 프롬프트 (진입점)
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript 설정
└── src/
    ├── types.ts                 # TypeScript 타입 정의
    ├── state-manager.ts         # 상태 관리
    ├── git-manager.ts           # Git 조작
    ├── executor.ts              # 실행 엔진
    ├── validator.ts             # 검증 로직
    ├── user-interface.ts        # 사용자 승인
    ├── error-handler.ts         # 에러 처리
    └── index.ts                 # 진입점
```

---

## 🔐 Security Considerations

### 1. Git 조작
- ✅ `--hard reset` 사용 시 사용자 승인 필요
- ✅ 롤백 전 현재 브랜치 확인
- ✅ main/master 브랜치에서 실행 방지

### 2. 명령어 실행
- ✅ 화이트리스트: `npm test`, `npm run build`, `npm run lint`만 허용
- ❌ 임의 shell 명령어 실행 금지
- ✅ Timeout 설정 (5분)

### 3. 파일 시스템
- ✅ execution_state.json은 프로젝트 루트에만 저장
- ✅ 상대 경로 검증 (path traversal 방지)

---

## 📊 Performance Considerations

### 1. 상태 저장 빈도
- 작업 시작 전: saveState()
- 작업 완료 후: saveState()
- 검증 실패 후: saveState()
- **Total**: 작업당 3회 (최소)

### 2. Git 조작 빈도
- 작업 시작 전: createCheckpoint()
- 검증 성공 시: commitTask()
- 검증 실패 시: rollbackToCheckpoint()
- **Total**: 작업당 2회 (평균)

### 3. 검증 시간
- npm test: 5-30초 (프로젝트 크기 의존)
- npm run build: 10-60초
- npm run lint: 3-10초
- **Total**: 18-100초 (작업당)

---

## 🧪 Testing Strategy

### 1. Unit Tests (80%+ coverage)
- ✅ StateManager: CRUD 테스트
- ✅ GitManager: checkpoint/commit/rollback 테스트
- ✅ Validator: runCommand 테스트
- ✅ ErrorHandler: 에러 처리 테스트

### 2. Integration Tests
- ✅ Executor + StateManager + GitManager 통합
- ✅ 정상 흐름 (Happy Path)
- ✅ 실패 흐름 (Failure Path)
- ✅ 재시도 흐름 (Retry Path)

### 3. E2E Tests
- ✅ k-food-mvp 프로젝트에서 실전 테스트
- ✅ 3-task 체크리스트 실행
- ✅ 의도적 실패 시나리오
- ✅ 세션 재개 시나리오

---

## 📈 Success Metrics

### Day 1 Goals (Architecture Design)
- ✅ ARCHITECTURE.md 완성
- ✅ types.ts 정의
- ✅ README.md 초안
- ✅ prompt.md 초안

**Expected Time**: 6-8 hours
**Success Probability**: 70%

---

## 🔗 References

### Serena Memory
- `.serena/memories/sequential_implementation_prd_auto_executor.md` - 5일 계획
- `.serena/memories/first_principles_implementation_prd_auto_executor.md` - 근본 원리
- `.serena/memories/systems_implementation_prd_auto_executor.md` - 시스템 설계
- `.serena/memories/stochastic_implementation_prd_auto_executor.md` - 리스크 분석
- `.serena/memories/implementation_patterns_prd_auto_executor.md` - 재사용 패턴

### Existing Skills
- `.claude/skills/prd-implementation-tracker/skill.md` - 패턴 소스

---

**Architecture Version**: 1.0.0
**Status**: ✅ Day 1 Design Phase
**Next**: types.ts 작성

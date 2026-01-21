/**
 * prd-auto-executor Type Definitions
 *
 * Version: 1.0.0
 * Last Updated: 2025-11-14
 */

// ============================================================================
// Core Types
// ============================================================================

/**
 * Task status enum
 */
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

/**
 * Approval result from user
 */
export type ApprovalResult = 'approved' | 'skipped' | 'aborted';

/**
 * Error resolution action
 */
export type ErrorAction = 'retry' | 'skip' | 'abort';

// ============================================================================
// State Management
// ============================================================================

/**
 * Execution state persisted to execution_state.json
 *
 * Location: {projectPath}/execution_state.json
 */
export interface ExecutionState {
  /** Project root path */
  projectPath: string;

  /** Current phase (e.g., "Phase 1", "Phase 2") */
  currentPhase: string;

  /** Current task name */
  currentTask: string;

  /** Current task index (0-based) */
  taskIndex: number;

  /** Current status */
  status: TaskStatus;

  /** Current retry count (0-3) */
  retryCount: number;

  /** Maximum retries allowed */
  maxRetries: number;

  /** Last checkpoint tag (e.g., "checkpoint-4") */
  lastCheckpoint: string;

  /** Last update timestamp (ISO 8601) */
  timestamp: string;
}

// ============================================================================
// Phase 0 Integration (v1.1)
// ============================================================================

/**
 * Task type for intelligent MCP selection
 *
 * Used by MCPSelectorIntegration to select appropriate Phase 0 frameworks
 * based on task nature (not just complexity).
 */
export type TaskType =
  | 'api_design'
  | 'algorithm_optimization'
  | 'ui_ux'
  | 'debugging'
  | 'security'
  | 'refactoring'
  | 'testing'
  | 'documentation'
  | 'data_processing'
  | 'integration'
  | 'general';

/**
 * Phase 0 framework enum
 */
export type Phase0Framework =
  | 'Sequential Thinking'
  | 'First Principles'
  | 'Systems Thinking'
  | 'Stochastic Analysis'
  | 'Decision Framework'
  | 'Analogical Reasoning'
  | 'Causal Analysis'
  | 'Visual Reasoning'
  | 'Bias Detection'
  | 'Metacognitive Monitoring'
  | 'Scientific Method'
  | 'Collaborative Reasoning'
  | 'Structured Argumentation';

/**
 * Phase 0 configuration (recommended by mcp-selector skill)
 */
export interface Phase0Config {
  /** Recommended frameworks (3-6) in priority order */
  frameworks: Phase0Framework[];

  /** Estimated execution time in seconds */
  estimated_time: number;

  /** Selection reasoning (from mcp-selector) */
  reasoning: string;

  /** Task type used for selection */
  task_type: TaskType;
}

/**
 * Phase 0 execution insights
 */
export interface Phase0Insights {
  /** Framework-specific insights */
  [framework: string]: string | number | undefined;

  /** Execution timestamp */
  executed_at?: string;

  /** Total execution time */
  execution_time?: number;
}

// ============================================================================
// Task Definition
// ============================================================================

/**
 * Task from checklist.json
 */
export interface Task {
  /** Task unique ID */
  id: string;

  /** Task name */
  name: string;

  /** Task description */
  description: string;

  /** Task priority */
  priority: 'easy' | 'core' | 'medium' | 'hard';

  /** Estimated time (e.g., "2 hours") */
  estimatedTime: string;

  /** Dependencies (task IDs) */
  dependencies: string[];

  /** Task metadata */
  metadata?: TaskMetadata;
}

/**
 * Task metadata (optional, from prd-tracker pattern)
 */
export interface TaskMetadata {
  /** Checklist file path */
  checklist_file?: string;

  /** Task index in checklist */
  task_index?: number;

  /** Test command (e.g., "npm test") */
  test_command?: string;

  /** Build command (e.g., "npm run build") */
  build_command?: string;

  /** Lint command (e.g., "npm run lint") */
  lint_command?: string;

  /** Acceptance criteria */
  acceptance_criteria?: string[];

  // ===== Phase 0 Integration (v1.1) =====

  /** Task type for intelligent MCP selection */
  task_type?: TaskType;

  /** Phase 0 configuration (from mcp-selector) */
  phase0_config?: Phase0Config;

  /** Phase 0 execution insights */
  phase0_insights?: Phase0Insights;

  // ===== Git & Verification =====

  /** Git checkpoint tag */
  checkpoint_tag?: string;

  /** Whether committed to Git */
  committed?: boolean;

  /** Verification result */
  verified?: boolean;

  /** Verification timestamp */
  verified_at?: string;
}

/**
 * Checklist from checklist.json
 */
export interface Checklist {
  /** Project name */
  project: string;

  /** Project path */
  projectPath: string;

  /** Tasks */
  tasks: Task[];

  /** Total task count */
  totalTasks: number;

  /** Created timestamp */
  createdAt: string;
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validation result from running a command
 */
export interface ValidationResult {
  /** Whether command succeeded (exitCode === 0) */
  success: boolean;

  /** stdout output */
  stdout: string;

  /** stderr output */
  stderr: string;

  /** Exit code */
  exitCode: number;

  /** Command that was run */
  command?: string;

  /** Duration in milliseconds */
  duration?: number;
}

/**
 * Comprehensive validation result
 */
export interface ValidationResults {
  /** Whether all validations passed */
  passed: boolean;

  /** Individual validation results */
  results: {
    test?: ValidationResult;
    build?: ValidationResult;
    lint?: ValidationResult;
  };

  /** Total duration in milliseconds */
  totalDuration: number;
}

// ============================================================================
// Execution Results
// ============================================================================

/**
 * Result of task execution
 */
export type TaskExecutionResult = 'success' | 'failed' | 'skipped';

/**
 * Result of checklist execution
 */
export interface ExecutionResult {
  /** Whether execution completed successfully */
  success: boolean;

  /** Completed tasks count */
  completedTasks: number;

  /** Failed tasks count */
  failedTasks: number;

  /** Skipped tasks count */
  skippedTasks: number;

  /** Total tasks count */
  totalTasks: number;

  /** Total duration in milliseconds */
  totalDuration: number;

  /** Error message (if failed) */
  error?: string;

  /** Task results */
  taskResults: Array<{
    task: Task;
    result: TaskExecutionResult;
    duration: number;
    error?: string;
  }>;
}

// ============================================================================
// Error Handling
// ============================================================================

/**
 * Error context for error handler
 */
export interface ErrorContext {
  /** Task that failed */
  task: Task;

  /** Task index */
  taskIndex: number;

  /** Current retry count */
  retryCount: number;

  /** Last checkpoint tag */
  lastCheckpoint: string;

  /** Project path */
  projectPath: string;
}

/**
 * Error resolution decision
 */
export interface ErrorResolution {
  /** Action to take */
  action: ErrorAction;

  /** Message to display */
  message: string;

  /** Whether to save state */
  saveState?: boolean;
}

/**
 * Custom error class for prd-auto-executor
 */
export class ExecutorError extends Error {
  constructor(
    message: string,
    public readonly context?: ErrorContext,
    public override readonly cause?: Error
  ) {
    super(message);
    this.name = 'ExecutorError';
  }
}

// ============================================================================
// Git Operations
// ============================================================================

/**
 * Git checkpoint info
 */
export interface GitCheckpoint {
  /** Checkpoint tag (e.g., "checkpoint-4") */
  tag: string;

  /** Task index */
  taskIndex: number;

  /** Commit SHA (if committed) */
  commitSha?: string;

  /** Created timestamp */
  createdAt: string;
}

/**
 * Git commit info
 */
export interface GitCommitInfo {
  /** Commit SHA */
  sha: string;

  /** Commit message */
  message: string;

  /** Author */
  author: string;

  /** Timestamp */
  timestamp: string;
}

// ============================================================================
// Configuration
// ============================================================================

/**
 * Executor configuration
 */
export interface ExecutorConfig {
  /** Project path */
  projectPath: string;

  /** Checklist path */
  checklistPath: string;

  /** Max retries per task */
  maxRetries?: number;

  /** Command timeout in milliseconds */
  commandTimeout?: number;

  /** Whether to run lint (optional) */
  runLint?: boolean;

  /** Whether to auto-commit on success */
  autoCommit?: boolean;

  /** Whether to auto-rollback on failure */
  autoRollback?: boolean;

  /** Whether to use interactive mode (MCP AskUserQuestion) */
  interactiveMode?: boolean;

  /** Git commit message template */
  commitMessageTemplate?: string;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Partial<ExecutorConfig> = {
  maxRetries: 3,
  commandTimeout: 300000, // 5 minutes
  runLint: true,
  autoCommit: true,
  autoRollback: true,
  interactiveMode: process.env['INTERACTIVE_MODE'] === 'true',
  commitMessageTemplate: `✅ {taskName}

{taskDescription}

- 테스트 통과: npm test
- 빌드 성공: npm run build
- 린트 통과: npm run lint

🤖 Generated with prd-auto-executor
`
};

// ============================================================================
// User Interface
// ============================================================================

/**
 * User approval question options
 */
export interface ApprovalOptions {
  /** Task to approve */
  task: Task;

  /** Current progress (e.g., "Task 3/10") */
  progress?: string;

  /** Previous failures (if retry) */
  previousFailures?: number;
}

/**
 * Progress info
 */
export interface ProgressInfo {
  /** Current task index (0-based) */
  current: number;

  /** Total tasks */
  total: number;

  /** Percentage (0-100) */
  percentage: number;

  /** Completed tasks */
  completed: number;

  /** Failed tasks */
  failed: number;

  /** Skipped tasks */
  skipped: number;
}

// ============================================================================
// Serena Memory Integration (Optional)
// ============================================================================

/**
 * Serena memory state (optional)
 */
export interface SerenaMemoryState {
  /** Memory name */
  memory_name: string;

  /** Project path */
  project_path: string;

  /** Current phase */
  current_phase: string;

  /** Current task */
  current_task: string;

  /** Task index */
  task_index: number;

  /** Retry count */
  retry_count: number;

  /** Last checkpoint */
  last_checkpoint: string;

  /** Status */
  status: TaskStatus;

  /** Last updated */
  last_updated: string;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Deep partial (makes all properties optional recursively)
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Type guard for ExecutionState
 */
export function isExecutionState(obj: any): obj is ExecutionState {
  return (
    typeof obj === 'object' &&
    typeof obj.projectPath === 'string' &&
    typeof obj.currentPhase === 'string' &&
    typeof obj.currentTask === 'string' &&
    typeof obj.taskIndex === 'number' &&
    ['pending', 'in_progress', 'completed', 'failed'].includes(obj.status) &&
    typeof obj.retryCount === 'number' &&
    typeof obj.maxRetries === 'number' &&
    typeof obj.lastCheckpoint === 'string' &&
    typeof obj.timestamp === 'string'
  );
}

/**
 * Type guard for Task
 */
export function isTask(obj: any): obj is Task {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.description === 'string' &&
    ['easy', 'core', 'medium', 'hard'].includes(obj.priority) &&
    typeof obj.estimatedTime === 'string' &&
    Array.isArray(obj.dependencies)
  );
}

/**
 * Type guard for Checklist
 */
export function isChecklist(obj: any): obj is Checklist {
  return (
    typeof obj === 'object' &&
    typeof obj.project === 'string' &&
    typeof obj.projectPath === 'string' &&
    Array.isArray(obj.tasks) &&
    obj.tasks.every(isTask) &&
    typeof obj.totalTasks === 'number' &&
    typeof obj.createdAt === 'string'
  );
}

// ============================================================================
// Note: All types and functions are already exported inline above
// No need for additional export block
// ============================================================================

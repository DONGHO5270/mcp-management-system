/**
 * Executor
 *
 * Main execution engine that orchestrates all components
 *
 * Pattern Source: Orchestrator pattern
 * Dependencies: state-manager, git-manager, validator, user-interface, error-handler
 */

import * as fs from 'fs/promises';
import { StateManager } from './state-manager';
import { GitManager } from './git-manager';
import { Validator } from './validator';
import { UserInterface } from './user-interface';
import { ErrorHandler } from './error-handler';
import { MCPSelectorIntegration } from './mcp-selector-integration';
import {
  Checklist,
  Task,
  ExecutionResult,
  TaskExecutionResult,
  ExecutorConfig,
  ApprovalOptions,
  ErrorContext,
  ErrorAction,
  ProgressInfo,
  DEFAULT_CONFIG,
} from './types';

/**
 * Type declaration for Claude Code's AskUserQuestion function
 * This is a global function provided by Claude Code environment
 */
declare function AskUserQuestion(options: {
  questions: Array<{
    question: string;
    header: string;
    multiSelect: boolean;
    options: Array<{
      label: string;
      description: string;
    }>;
  }>;
}): Promise<{
  answers?: Record<string, string>;
}>;

/**
 * Executor class
 *
 * Responsibilities:
 * - Load checklist and execute tasks sequentially
 * - Integrate StateManager, GitManager, Validator, UserInterface, ErrorHandler
 * - Handle task approval workflow
 * - Handle error recovery
 * - Track execution progress
 */
export class Executor {
  private config: Required<ExecutorConfig>;
  private stateManager: StateManager;
  private gitManager: GitManager;
  private validator: Validator;
  private userInterface: UserInterface;
  private errorHandler: ErrorHandler;
  private lastErrorAction: ErrorAction | null = null;

  /**
   * Constructor
   *
   * @param config - Executor configuration
   */
  constructor(config: ExecutorConfig) {
    // Merge with defaults
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    } as Required<ExecutorConfig>;

    // Initialize components
    this.stateManager = new StateManager();
    this.gitManager = new GitManager(this.config.projectPath);
    this.validator = new Validator(
      this.config.projectPath,
      this.config.commandTimeout
    );
    this.userInterface = new UserInterface();
    this.errorHandler = new ErrorHandler(this.config.maxRetries);
  }

  /**
   * Execute checklist
   *
   * @returns ExecutionResult
   */
  async execute(): Promise<ExecutionResult> {
    const startTime = Date.now();

    try {
      // Load checklist
      const checklist = await this.loadChecklist();

      // Show welcome
      this.userInterface.showWelcome(checklist.project, checklist.totalTasks);

      // Validate Git repository
      await this.gitManager.validateGitRepo();

      // Load or create execution state
      let state = await this.stateManager.loadState(this.config.projectPath);

      if (!state) {
        state = this.stateManager.createInitialState(
          this.config.projectPath,
          this.config.checklistPath,
          this.config.maxRetries
        );
      }

      // Execute tasks
      const result = await this.executeChecklist(checklist, state);

      // Show completion
      this.userInterface.showCompletion(
        result.completedTasks,
        result.failedTasks,
        result.skippedTasks,
        Date.now() - startTime
      );

      return result;
    } catch (error) {
      console.error(`❌ Execution failed: ${(error as Error).message}`);

      return {
        success: false,
        completedTasks: 0,
        failedTasks: 0,
        skippedTasks: 0,
        totalTasks: 0,
        totalDuration: Date.now() - startTime,
        error: (error as Error).message,
        taskResults: [],
      };
    }
  }

  /**
   * Load checklist from file
   *
   * @returns Checklist
   */
  private async loadChecklist(): Promise<Checklist> {
    try {
      const content = await fs.readFile(this.config.checklistPath, 'utf-8');
      const checklist = JSON.parse(content) as Checklist;

      console.log(`✅ Checklist loaded: ${checklist.totalTasks} tasks`);

      return checklist;
    } catch (error) {
      throw new Error(
        `Failed to load checklist: ${(error as Error).message}`
      );
    }
  }

  /**
   * Execute all tasks in checklist
   *
   * @param checklist - Checklist to execute
   * @param state - Current execution state
   * @returns ExecutionResult
   */
  private async executeChecklist(
    checklist: Checklist,
    state: any
  ): Promise<ExecutionResult> {
    const result: ExecutionResult = {
      success: true,
      completedTasks: 0,
      failedTasks: 0,
      skippedTasks: 0,
      totalTasks: checklist.totalTasks,
      totalDuration: 0,
      taskResults: [],
    };

    // Resume from saved state if applicable
    const startIndex = state.taskIndex || 0;
    let shouldAbort = false;
    this.lastErrorAction = null; // Reset error action tracking

    for (let i = startIndex; i < checklist.tasks.length; i++) {
      const task = checklist.tasks[i];

      if (!task) {
        console.warn(`⚠️ Task at index ${i} is undefined, skipping`);
        continue;
      }

      // Show progress
      this.showProgress(result, i, checklist.totalTasks);

      // Execute task
      const taskResult = await this.executeTask(task, i);

      // Update result
      result.taskResults.push({
        task,
        result: taskResult,
        duration: 0,
      });

      switch (taskResult) {
        case 'success':
          result.completedTasks++;
          break;
        case 'failed':
          result.failedTasks++;
          result.success = false;
          // Check if this was an abort
          if (this.lastErrorAction === 'abort') {
            shouldAbort = true;
          }
          break;
        case 'skipped':
          result.skippedTasks++;
          break;
      }

      // If aborted, stop execution
      if (shouldAbort) {
        console.log('⏹️ Execution stopped due to abort');
        break;
      }
    }

    return result;
  }

  /**
   * Execute single task
   *
   * @param task - Task to execute
   * @param taskIndex - Task index
   * @returns TaskExecutionResult
   */
  private async executeTask(
    task: Task,
    taskIndex: number
  ): Promise<TaskExecutionResult> {
    try {
      // Ask user approval
      const approval = await this.askUserApproval(task, taskIndex);

      if (approval === 'aborted') {
        console.log(`⏹️ Execution aborted by user`);
        this.lastErrorAction = 'abort'; // Track abort for loop breaking
        return 'failed';
      }

      if (approval === 'skipped') {
        console.log(`⏭️ Task skipped: ${task.name}`);
        return 'skipped';
      }

      // Run Phase 0 analysis (if needed based on priority and type)
      await this.runPhase0IfNeeded(task, taskIndex);

      // Create checkpoint
      await this.gitManager.createCheckpoint(taskIndex);

      // Run validation if metadata exists
      if (task.metadata) {
        const validation = await this.validator.validateTask(task.metadata);

        if (!validation.passed) {
          throw new Error('Validation failed');
        }
      }

      // Commit on success (if autoCommit enabled)
      if (this.config.autoCommit) {
        await this.gitManager.commitTask(task.name);
      }

      console.log(`✅ Task completed: ${task.name}`);
      return 'success';
    } catch (error) {
      console.error(`❌ Task failed: ${task.name}`);

      // Handle error
      const context: ErrorContext = {
        task,
        taskIndex,
        retryCount: 0,
        lastCheckpoint: `checkpoint-${taskIndex}`,
        projectPath: this.config.projectPath,
      };

      const resolution = await this.errorHandler.handleError(
        error as Error,
        context,
        this.getUserErrorAction.bind(this)
      );

      // Track the error action for abort handling
      this.lastErrorAction = resolution.action;

      if (resolution.action === 'abort') {
        return 'failed';
      }

      if (resolution.action === 'skip') {
        return 'skipped';
      }

      // Retry
      if (this.config.autoRollback) {
        await this.gitManager.rollbackToCheckpoint(context.lastCheckpoint);
      }

      return 'failed';
    }
  }

  /**
   * Run Phase 0 analysis if needed
   *
   * Uses MCPSelectorIntegration to intelligently select frameworks based on:
   * - Task priority (easy → skip, core/medium/hard → analyze)
   * - Task type (api_design, algorithm, ui_ux, etc.)
   *
   * Results are saved to task.metadata.phase0_insights for reference.
   *
   * @param task - Task to analyze
   * @param taskIndex - Task index
   * @private
   */
  private async runPhase0IfNeeded(
    task: Task,
    _taskIndex: number // Reserved for future use (e.g., progress tracking)
  ): Promise<void> {
    try {
      // Use MCPSelectorIntegration for intelligent framework selection
      const frameworks = await MCPSelectorIntegration.selectFrameworks(task);

      if (frameworks.length === 0) {
        console.log(`⏭️  [Phase 0] Skipped for task: ${task.name}`);
        return;
      }

      console.log(`\n🧠 [Phase 0] Running ${frameworks.length} frameworks for task: ${task.name}`);
      console.log(`   Priority: ${task.priority}`);
      console.log(`   Type: ${task.metadata?.task_type || 'general'}`);
      console.log(`   Frameworks: ${frameworks.join(', ')}`);
      console.log(`   Estimated time: ${task.metadata?.phase0_config?.estimated_time || 'N/A'}s\n`);

      // TODO: Integrate with Phase0Engine to actually execute frameworks
      // For now, just log that Phase 0 would run
      //
      // Example future implementation:
      // const insights = await Phase0Engine.run({
      //   frameworks,
      //   task,
      //   memoryPath: `${this.config.projectPath}/.serena/memories/${task.id}`
      // });
      //
      // task.metadata = {
      //   ...task.metadata,
      //   phase0_insights: {
      //     ...insights,
      //     executed_at: new Date().toISOString(),
      //     execution_time: 50
      //   }
      // };

      console.log(`✅ [Phase 0] Analysis completed (placeholder - actual execution TBD)\n`);
    } catch (error) {
      console.error(`⚠️  [Phase 0] Error during analysis:`, error);
      console.log(`   Continuing with task execution...\n`);
      // Don't fail the task if Phase 0 fails - it's an enhancement, not a requirement
    }
  }

  /**
   * Ask user for task approval
   *
   * @param task - Task to approve
   * @param taskIndex - Task index
   * @returns ApprovalResult
   */
  private async askUserApproval(
    task: Task,
    taskIndex: number
  ): Promise<'approved' | 'skipped' | 'aborted'> {
    const options: ApprovalOptions = {
      task,
      progress: `${taskIndex + 1}/${this.config.checklistPath}`,
    };

    const prompt = this.userInterface.formatTaskPrompt(options);

    console.log(prompt);

    // Check interactive mode
    if (!this.config.interactiveMode) {
      console.log(`ℹ️ Auto-approving task (interactive mode: OFF)`);
      return 'approved';
    }

    // MCP call (Interactive Mode ON)
    const answer = await AskUserQuestion({
      questions: [{
        question: `Proceed with task: ${task.name}?`,
        header: "Task Approval",
        multiSelect: false,
        options: [
          {
            label: "Approve",
            description: "Execute this task"
          },
          {
            label: "Skip",
            description: "Skip this task and continue with next"
          },
          {
            label: "Abort",
            description: "Stop execution completely"
          }
        ]
      }]
    });

    const choice = answer.answers?.['0']?.toLowerCase() || 'approved';

    if (choice.includes('skip')) return 'skipped';
    if (choice.includes('abort')) return 'aborted';
    return 'approved';
  }

  /**
   * Get user's error action choice
   *
   * @param error - Error that occurred
   * @param context - Error context
   * @returns ErrorAction
   */
  private async getUserErrorAction(
    error: Error,
    context: ErrorContext
  ): Promise<ErrorAction> {
    const prompt = this.userInterface.formatErrorPrompt(error, context);
    const recommended = this.errorHandler.getRecommendedAction(context);

    console.log(prompt);

    // Check interactive mode
    if (!this.config.interactiveMode) {
      console.log(`ℹ️ Auto-selecting: ${recommended} (interactive mode: OFF)`);
      return recommended;
    }

    // MCP call (Interactive Mode ON)
    const answer = await AskUserQuestion({
      questions: [{
        question: `Task failed: ${error.message}. What would you like to do?`,
        header: "Error Action",
        multiSelect: false,
        options: [
          {
            label: "Retry",
            description: `Retry this task (Recommended: ${recommended === 'retry' ? 'Yes' : 'No'})`
          },
          {
            label: "Skip",
            description: `Skip this task and continue (Recommended: ${recommended === 'skip' ? 'Yes' : 'No'})`
          },
          {
            label: "Abort",
            description: `Stop execution completely (Recommended: ${recommended === 'abort' ? 'Yes' : 'No'})`
          }
        ]
      }]
    });

    const choice = answer.answers?.['0']?.toLowerCase() || recommended;

    if (choice.includes('retry')) return 'retry';
    if (choice.includes('skip')) return 'skip';
    if (choice.includes('abort')) return 'abort';

    // Fallback to recommended action
    return recommended;
  }

  /**
   * Show progress
   *
   * @param result - Current result
   * @param current - Current task index
   * @param total - Total tasks
   */
  private showProgress(
    result: ExecutionResult,
    current: number,
    total: number
  ): void {
    const progress: ProgressInfo = {
      current,
      total,
      percentage: Math.round((current / total) * 100),
      completed: result.completedTasks,
      failed: result.failedTasks,
      skipped: result.skippedTasks,
    };

    this.userInterface.showProgress(progress);
  }
}

/**
 * Create Executor instance (factory)
 *
 * @param config - Executor configuration
 * @returns Executor instance
 */
export function createExecutor(config: ExecutorConfig): Executor {
  return new Executor(config);
}

/**
 * Default export
 */
export default Executor;

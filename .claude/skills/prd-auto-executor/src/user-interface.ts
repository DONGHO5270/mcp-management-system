/**
 * User Interface
 *
 * Handles user approval and error action prompts
 *
 * Pattern Source: AskUserQuestion integration
 * Note: Actual AskUserQuestion calls are in executor.ts
 */

import {
  ApprovalOptions,
  ApprovalResult,
  ErrorContext,
  ErrorAction,
  ProgressInfo,
} from './types';

/**
 * UserInterface class
 *
 * Responsibilities:
 * - Format approval prompts
 * - Format error action prompts
 * - Display progress information
 * - Parse user responses
 *
 * Note: This class only handles formatting/parsing.
 * Actual user interaction (AskUserQuestion) is in executor.ts
 */
export class UserInterface {
  /**
   * Format task approval prompt
   *
   * @param options - Approval options with task and progress info
   * @returns Formatted prompt string
   */
  formatTaskPrompt(options: ApprovalOptions): string {
    const { task, progress, previousFailures } = options;

    let prompt = `\n${'='.repeat(60)}\n`;
    prompt += `📋 Task: ${task.name}\n`;
    prompt += `${'='.repeat(60)}\n\n`;

    if (progress) {
      prompt += `Progress: ${progress}\n`;
    }

    prompt += `Priority: ${this.formatPriority(task.priority)}\n`;
    prompt += `Estimated Time: ${task.estimatedTime}\n\n`;

    prompt += `Description:\n${task.description}\n\n`;

    if (task.dependencies.length > 0) {
      prompt += `Dependencies: ${task.dependencies.join(', ')}\n\n`;
    }

    if (previousFailures && previousFailures > 0) {
      prompt += `⚠️ Retry #${previousFailures}\n\n`;
    }

    prompt += `Would you like to execute this task?\n`;
    prompt += `- Approve: Run this task\n`;
    prompt += `- Skip: Skip this task and continue\n`;
    prompt += `- Abort: Stop execution and save state\n`;

    return prompt;
  }

  /**
   * Format error action prompt
   *
   * @param error - Error that occurred
   * @param context - Error context
   * @returns Formatted prompt string
   */
  formatErrorPrompt(error: Error, context: ErrorContext): string {
    const { task, retryCount, lastCheckpoint } = context;

    let prompt = `\n${'='.repeat(60)}\n`;
    prompt += `❌ Task Failed: ${task.name}\n`;
    prompt += `${'='.repeat(60)}\n\n`;

    prompt += `Error Message:\n${error.message}\n\n`;

    if (error.stack) {
      const stackLines = error.stack.split('\n').slice(0, 3);
      prompt += `Stack Trace:\n${stackLines.join('\n')}\n\n`;
    }

    prompt += `Retry Count: ${retryCount}\n`;

    if (lastCheckpoint) {
      prompt += `Last Checkpoint: ${lastCheckpoint}\n`;
    }

    prompt += `\nWhat would you like to do?\n`;
    prompt += `- Retry: Retry this task (rollback to checkpoint)\n`;
    prompt += `- Skip: Skip this task and continue\n`;
    prompt += `- Abort: Stop execution and save state\n`;

    if (retryCount >= 3) {
      prompt += `\n⚠️ Warning: Max retries approaching. Consider skip or abort.\n`;
    }

    return prompt;
  }

  /**
   * Format progress information
   *
   * @param progress - Progress info
   * @returns Formatted progress string
   */
  formatProgressInfo(progress: ProgressInfo): string {
    const { current, total, percentage, completed, failed, skipped } = progress;

    let info = `\n${'─'.repeat(60)}\n`;
    info += `📊 Progress: ${current + 1}/${total} (${percentage}%)\n`;
    info += `${'─'.repeat(60)}\n`;

    info += `✅ Completed: ${completed}\n`;
    info += `❌ Failed: ${failed}\n`;
    info += `⏭️  Skipped: ${skipped}\n`;

    const remaining = total - (completed + failed + skipped);
    info += `⏳ Remaining: ${remaining}\n`;

    return info;
  }

  /**
   * Display progress (console output)
   *
   * @param progress - Progress info
   */
  showProgress(progress: ProgressInfo): void {
    const formatted = this.formatProgressInfo(progress);
    console.log(formatted);
  }

  /**
   * Format priority with emoji
   *
   * @param priority - Task priority
   * @returns Formatted priority string
   */
  private formatPriority(priority: string): string {
    switch (priority) {
      case 'easy':
        return '🟢 Easy';
      case 'core':
        return '🔴 Core';
      case 'medium':
        return '🟡 Medium';
      case 'hard':
        return '🔴 Hard';
      default:
        return priority;
    }
  }

  /**
   * Parse approval result from user response
   *
   * @param response - User response string
   * @returns ApprovalResult
   */
  parseApprovalResult(response: string): ApprovalResult {
    const normalized = response.toLowerCase().trim();

    if (normalized === 'approve' || normalized === 'yes' || normalized === 'y') {
      return 'approved';
    }

    if (normalized === 'skip') {
      return 'skipped';
    }

    // Default to abort for safety
    return 'aborted';
  }

  /**
   * Parse error action from user response
   *
   * @param response - User response string
   * @returns ErrorAction
   */
  parseErrorAction(response: string): ErrorAction {
    const normalized = response.toLowerCase().trim();

    if (normalized === 'retry' || normalized === 'r') {
      return 'retry';
    }

    if (normalized === 'skip' || normalized === 's') {
      return 'skip';
    }

    // Default to abort for safety
    return 'abort';
  }

  /**
   * Show welcome message
   */
  showWelcome(checklistName: string, totalTasks: number): void {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 prd-auto-executor`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Checklist: ${checklistName}`);
    console.log(`Total Tasks: ${totalTasks}`);
    console.log(`${'='.repeat(60)}\n`);
  }

  /**
   * Show completion message
   */
  showCompletion(
    completedTasks: number,
    failedTasks: number,
    skippedTasks: number,
    totalDuration: number
  ): void {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🎉 Execution Complete`);
    console.log(`${'='.repeat(60)}`);
    console.log(`✅ Completed: ${completedTasks}`);
    console.log(`❌ Failed: ${failedTasks}`);
    console.log(`⏭️  Skipped: ${skippedTasks}`);
    console.log(`⏱️  Total Duration: ${(totalDuration / 1000).toFixed(1)}s`);
    console.log(`${'='.repeat(60)}\n`);
  }

  /**
   * Show error message
   */
  showError(message: string): void {
    console.error(`\n❌ Error: ${message}\n`);
  }
}

/**
 * Create UserInterface instance (factory)
 *
 * @returns UserInterface instance
 */
export function createUserInterface(): UserInterface {
  return new UserInterface();
}

/**
 * Default export
 */
export default UserInterface;

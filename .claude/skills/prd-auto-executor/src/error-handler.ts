/**
 * Error Handler
 *
 * Handles task execution errors and recovery strategies
 *
 * Pattern Source: Error recovery with retry/skip/abort
 * Dependencies: types
 */

import {
  ErrorContext,
  ErrorResolution,
  ErrorAction,
  ExecutorError,
} from './types';

/**
 * ErrorHandler class
 *
 * Responsibilities:
 * - Determine if task should be retried
 * - Create error resolution decisions
 * - Format error messages
 * - Recommend recovery actions
 */
export class ErrorHandler {
  private maxRetries: number;

  /**
   * Constructor
   *
   * @param maxRetries - Maximum retry attempts per task (default: 3)
   */
  constructor(maxRetries = 3) {
    this.maxRetries = maxRetries;
  }

  /**
   * Check if task should be retried
   *
   * @param context - Error context
   * @returns True if retry is allowed
   */
  shouldRetry(context: ErrorContext): boolean {
    return context.retryCount < this.maxRetries;
  }

  /**
   * Create error resolution based on action
   *
   * @param action - User selected action
   * @param context - Error context
   * @returns ErrorResolution
   */
  createErrorResolution(
    action: ErrorAction,
    context: ErrorContext
  ): ErrorResolution {
    const { task, taskIndex, retryCount, lastCheckpoint } = context;

    switch (action) {
      case 'retry':
        return {
          action: 'retry',
          message: `Retrying task: ${task.name} (Attempt ${retryCount + 1}/${this.maxRetries})${
            lastCheckpoint
              ? `\nRolling back to: ${lastCheckpoint}`
              : ''
          }`,
          saveState: true,
        };

      case 'skip':
        return {
          action: 'skip',
          message: `Skipping task: ${task.name} (Task #${taskIndex})`,
          saveState: true,
        };

      case 'abort':
        return {
          action: 'abort',
          message: `Aborting execution at task: ${task.name} (Task #${taskIndex})`,
          saveState: true,
        };
    }
  }

  /**
   * Handle error and get resolution
   *
   * @param error - Error that occurred
   * @param context - Error context
   * @param getUserAction - Function to get user's action choice
   * @returns ErrorResolution
   */
  async handleError(
    error: Error,
    context: ErrorContext,
    getUserAction: (
      error: Error,
      context: ErrorContext
    ) => Promise<ErrorAction>
  ): Promise<ErrorResolution> {
    // Log error details
    console.error(`\n❌ Task Failed: ${context.task.name}`);
    console.error(`Error: ${error.message}`);

    if (error.stack) {
      console.error(`Stack trace:\n${error.stack.split('\n').slice(0, 5).join('\n')}`);
    }

    console.error(`Retry Count: ${context.retryCount}/${this.maxRetries}`);

    // Check if retries exhausted
    if (!this.shouldRetry(context)) {
      console.warn(
        `\n⚠️ Max retries (${this.maxRetries}) reached. Forcing skip.`
      );

      return this.createErrorResolution('skip', context);
    }

    // Get user's action choice
    const action = await getUserAction(error, context);

    // Create resolution
    const resolution = this.createErrorResolution(action, context);

    console.log(`\n📝 Resolution: ${resolution.message}`);

    return resolution;
  }

  /**
   * Format error message for display
   *
   * @param error - Error to format
   * @param includeStack - Whether to include stack trace
   * @returns Formatted error message
   */
  formatErrorMessage(error: Error, includeStack = false): string {
    let message = `Error: ${error.message}`;

    // Add context for ExecutorError
    if (error instanceof ExecutorError && error.context) {
      const { task, taskIndex, retryCount } = error.context;
      message += `\n\nContext:`;
      message += `\n  Task: ${task.name}`;
      message += `\n  Task #${taskIndex}`;
      message += `\n  Retry: ${retryCount}`;
    }

    // Add stack trace if requested
    if (includeStack && error.stack) {
      message += `\n\nStack Trace:\n${error.stack}`;
    }

    return message;
  }

  /**
   * Get recommended action based on context
   *
   * @param context - Error context
   * @returns Recommended ErrorAction
   */
  getRecommendedAction(context: ErrorContext): ErrorAction {
    // If max retries reached, recommend skip
    if (context.retryCount >= this.maxRetries) {
      return 'skip';
    }

    // For first or second failure, recommend retry
    if (context.retryCount < 2) {
      return 'retry';
    }

    // For third failure, still allow retry
    return 'retry';
  }

  /**
   * Check if error is retryable
   *
   * Some errors are not worth retrying (e.g., syntax errors)
   *
   * @param error - Error to check
   * @returns True if error might be fixed by retry
   */
  isRetryableError(error: Error): boolean {
    const message = error.message.toLowerCase();

    // Non-retryable errors (syntax, type errors)
    const nonRetryablePatterns = [
      'syntaxerror',
      'referenceerror',
      'typeerror',
      'module not found',
      'cannot find module',
    ];

    for (const pattern of nonRetryablePatterns) {
      if (message.includes(pattern)) {
        return false;
      }
    }

    // Default to retryable
    return true;
  }

  /**
   * Log error summary (for debugging)
   *
   * @param error - Error that occurred
   * @param context - Error context
   */
  logErrorSummary(error: Error, context: ErrorContext): void {
    console.error(`\n${'='.repeat(60)}`);
    console.error(`ERROR SUMMARY`);
    console.error(`${'='.repeat(60)}`);
    console.error(`Task: ${context.task.name} (ID: ${context.task.id})`);
    console.error(`Task Index: ${context.taskIndex}`);
    console.error(`Retry Count: ${context.retryCount}/${this.maxRetries}`);
    console.error(`Error Type: ${error.constructor.name}`);
    console.error(`Error Message: ${error.message}`);
    console.error(`Retryable: ${this.isRetryableError(error) ? 'Yes' : 'No'}`);
    console.error(`Recommendation: ${this.getRecommendedAction(context)}`);
    console.error(`${'='.repeat(60)}\n`);
  }
}

/**
 * Create ErrorHandler instance (factory)
 *
 * @param maxRetries - Optional max retries
 * @returns ErrorHandler instance
 */
export function createErrorHandler(maxRetries?: number): ErrorHandler {
  return new ErrorHandler(maxRetries);
}

/**
 * Default export
 */
export default ErrorHandler;

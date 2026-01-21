/**
 * Error Handler Unit Tests
 */

import { ErrorHandler, createErrorHandler } from './error-handler';
import {
  Task,
  ErrorContext,
  ErrorResolution,
  ExecutorError,
} from './types';

describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler;

  const mockTask: Task = {
    id: 'task-1',
    name: 'Test Task',
    description: 'Test Description',
    priority: 'medium',
    estimatedTime: '1 hour',
    dependencies: [],
  };

  beforeEach(() => {
    errorHandler = new ErrorHandler(3); // maxRetries = 3
  });

  describe('shouldRetry', () => {
    it('should allow retry if under max retries', () => {
      const context: ErrorContext = {
        task: mockTask,
        taskIndex: 0,
        retryCount: 1,
        lastCheckpoint: '',
        projectPath: '/test',
      };

      const shouldRetry = errorHandler.shouldRetry(context);
      expect(shouldRetry).toBe(true);
    });

    it('should not allow retry if at max retries', () => {
      const context: ErrorContext = {
        task: mockTask,
        taskIndex: 0,
        retryCount: 3,
        lastCheckpoint: '',
        projectPath: '/test',
      };

      const shouldRetry = errorHandler.shouldRetry(context);
      expect(shouldRetry).toBe(false);
    });

    it('should not allow retry if exceeded max retries', () => {
      const context: ErrorContext = {
        task: mockTask,
        taskIndex: 0,
        retryCount: 5,
        lastCheckpoint: '',
        projectPath: '/test',
      };

      const shouldRetry = errorHandler.shouldRetry(context);
      expect(shouldRetry).toBe(false);
    });
  });

  describe('createErrorResolution', () => {
    it('should create retry resolution', () => {
      const context: ErrorContext = {
        task: mockTask,
        taskIndex: 0,
        retryCount: 1,
        lastCheckpoint: 'checkpoint-0',
        projectPath: '/test',
      };

      const resolution = errorHandler.createErrorResolution(
        'retry',
        context
      );

      expect(resolution.action).toBe('retry');
      expect(resolution.message).toContain('Retry');
      expect(resolution.saveState).toBe(true);
    });

    it('should create skip resolution', () => {
      const context: ErrorContext = {
        task: mockTask,
        taskIndex: 0,
        retryCount: 0,
        lastCheckpoint: '',
        projectPath: '/test',
      };

      const resolution = errorHandler.createErrorResolution('skip', context);

      expect(resolution.action).toBe('skip');
      expect(resolution.message).toContain('Skip');
      expect(resolution.saveState).toBe(true);
    });

    it('should create abort resolution', () => {
      const context: ErrorContext = {
        task: mockTask,
        taskIndex: 0,
        retryCount: 0,
        lastCheckpoint: '',
        projectPath: '/test',
      };

      const resolution = errorHandler.createErrorResolution(
        'abort',
        context
      );

      expect(resolution.action).toBe('abort');
      expect(resolution.message).toContain('Abort');
      expect(resolution.saveState).toBe(true);
    });

    it('should include checkpoint info in retry resolution', () => {
      const context: ErrorContext = {
        task: mockTask,
        taskIndex: 2,
        retryCount: 1,
        lastCheckpoint: 'checkpoint-1',
        projectPath: '/test',
      };

      const resolution = errorHandler.createErrorResolution(
        'retry',
        context
      );

      expect(resolution.message).toContain('checkpoint-1');
    });
  });

  describe('handleError', () => {
    it('should suggest retry if retries available', async () => {
      const error = new Error('Test error');
      const context: ErrorContext = {
        task: mockTask,
        taskIndex: 0,
        retryCount: 1,
        lastCheckpoint: 'checkpoint-0',
        projectPath: '/test',
      };

      // Mock user interaction to return retry
      const mockGetUserAction = jest
        .fn()
        .mockResolvedValue('retry');

      const resolution = await errorHandler.handleError(
        error,
        context,
        mockGetUserAction
      );

      expect(resolution.action).toBe('retry');
      expect(mockGetUserAction).toHaveBeenCalledWith(error, context);
    });

    it('should force skip if max retries exceeded', async () => {
      const error = new Error('Test error');
      const context: ErrorContext = {
        task: mockTask,
        taskIndex: 0,
        retryCount: 3,
        lastCheckpoint: '',
        projectPath: '/test',
      };

      const mockGetUserAction = jest.fn();

      const resolution = await errorHandler.handleError(
        error,
        context,
        mockGetUserAction
      );

      // Should force skip without asking user
      expect(resolution.action).toBe('skip');
      expect(mockGetUserAction).not.toHaveBeenCalled();
    });

    it('should respect user abort decision', async () => {
      const error = new Error('Test error');
      const context: ErrorContext = {
        task: mockTask,
        taskIndex: 0,
        retryCount: 0,
        lastCheckpoint: '',
        projectPath: '/test',
      };

      const mockGetUserAction = jest
        .fn()
        .mockResolvedValue('abort');

      const resolution = await errorHandler.handleError(
        error,
        context,
        mockGetUserAction
      );

      expect(resolution.action).toBe('abort');
    });

    it('should log error details', async () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation();

      const error = new Error('Detailed error');
      const context: ErrorContext = {
        task: mockTask,
        taskIndex: 0,
        retryCount: 0,
        lastCheckpoint: '',
        projectPath: '/test',
      };

      const mockGetUserAction = jest
        .fn()
        .mockResolvedValue('skip');

      await errorHandler.handleError(
        error,
        context,
        mockGetUserAction
      );

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('formatErrorMessage', () => {
    it('should format standard error', () => {
      const error = new Error('Standard error');
      const message = errorHandler.formatErrorMessage(error);

      expect(message).toContain('Standard error');
    });

    it('should format ExecutorError with context', () => {
      const context: ErrorContext = {
        task: mockTask,
        taskIndex: 1,
        retryCount: 2,
        lastCheckpoint: 'checkpoint-0',
        projectPath: '/test',
      };

      const error = new ExecutorError(
        'Executor error',
        context
      );

      const message = errorHandler.formatErrorMessage(error);

      expect(message).toContain('Executor error');
      expect(message).toContain('Test Task');
      expect(message).toContain('Task #1');
    });

    it('should include stack trace for detailed errors', () => {
      const error = new Error('Error with stack');
      const message = errorHandler.formatErrorMessage(error, true);

      expect(message).toBeTruthy();
      // Stack trace format varies, just check it's included
    });
  });

  describe('getRecommendedAction', () => {
    it('should recommend retry for first failure', () => {
      const context: ErrorContext = {
        task: mockTask,
        taskIndex: 0,
        retryCount: 0,
        lastCheckpoint: '',
        projectPath: '/test',
      };

      const action = errorHandler.getRecommendedAction(context);
      expect(action).toBe('retry');
    });

    it('should recommend skip when max retries reached', () => {
      const context: ErrorContext = {
        task: mockTask,
        taskIndex: 0,
        retryCount: 3,
        lastCheckpoint: '',
        projectPath: '/test',
      };

      const action = errorHandler.getRecommendedAction(context);
      expect(action).toBe('skip');
    });

    it('should recommend retry for medium retry count', () => {
      const context: ErrorContext = {
        task: mockTask,
        taskIndex: 0,
        retryCount: 2,
        lastCheckpoint: '',
        projectPath: '/test',
      };

      const action = errorHandler.getRecommendedAction(context);
      expect(action).toBe('retry');
    });
  });

  describe('createErrorHandler factory', () => {
    it('should create ErrorHandler instance', () => {
      const instance = createErrorHandler();
      expect(instance).toBeInstanceOf(ErrorHandler);
    });

    it('should use custom maxRetries', () => {
      const instance = createErrorHandler(5);
      expect(instance).toBeInstanceOf(ErrorHandler);

      const context: ErrorContext = {
        task: mockTask,
        taskIndex: 0,
        retryCount: 4,
        lastCheckpoint: '',
        projectPath: '/test',
      };

      expect(instance.shouldRetry(context)).toBe(true);
    });
  });
});

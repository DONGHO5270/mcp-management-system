/**
 * User Interface Unit Tests
 */

import { UserInterface, createUserInterface } from './user-interface';
import {
  Task,
  ApprovalOptions,
  ApprovalResult,
  ErrorContext,
  ErrorAction,
  ProgressInfo,
} from './types';

describe('UserInterface', () => {
  let userInterface: UserInterface;

  beforeEach(() => {
    userInterface = new UserInterface();
  });

  describe('formatTaskPrompt', () => {
    it('should format task approval prompt', () => {
      const task: Task = {
        id: 'task-1',
        name: 'Implement feature X',
        description: 'Add new feature to the system',
        priority: 'core',
        estimatedTime: '2 hours',
        dependencies: [],
      };

      const options: ApprovalOptions = {
        task,
        progress: '3/10',
        previousFailures: 0,
      };

      const prompt = userInterface.formatTaskPrompt(options);

      expect(prompt).toContain('Implement feature X');
      expect(prompt).toContain('3/10');
      expect(prompt).toContain('Core'); // Formatted with emoji
      expect(prompt).toContain('2 hours');
    });

    it('should include retry information if previous failures', () => {
      const task: Task = {
        id: 'task-1',
        name: 'Test task',
        description: 'Test description',
        priority: 'medium',
        estimatedTime: '1 hour',
        dependencies: [],
      };

      const options: ApprovalOptions = {
        task,
        progress: '1/5',
        previousFailures: 2,
      };

      const prompt = userInterface.formatTaskPrompt(options);

      expect(prompt).toContain('Retry #2');
    });
  });

  describe('formatErrorPrompt', () => {
    it('should format error prompt with retry option', () => {
      const task: Task = {
        id: 'task-1',
        name: 'Failing task',
        description: 'This task failed',
        priority: 'high',
        estimatedTime: '30 min',
        dependencies: [],
      };

      const context: ErrorContext = {
        task,
        taskIndex: 3,
        retryCount: 1,
        lastCheckpoint: 'checkpoint-2',
        projectPath: '/test/project',
      };

      const error = new Error('Test failed');

      const prompt = userInterface.formatErrorPrompt(error, context);

      expect(prompt).toContain('Failing task');
      expect(prompt).toContain('Test failed');
      expect(prompt).toContain('Retry Count: 1');
      expect(prompt).toContain('checkpoint-2');
    });

    it('should warn when max retries reached', () => {
      const task: Task = {
        id: 'task-1',
        name: 'Task',
        description: 'Desc',
        priority: 'low',
        estimatedTime: '1h',
        dependencies: [],
      };

      const context: ErrorContext = {
        task,
        taskIndex: 0,
        retryCount: 3,
        lastCheckpoint: '',
        projectPath: '/test',
      };

      const prompt = userInterface.formatErrorPrompt(
        new Error('Max retries'),
        context
      );

      expect(prompt).toContain('Max retries');
    });
  });

  describe('formatProgressInfo', () => {
    it('should format progress information', () => {
      const progress: ProgressInfo = {
        current: 5,
        total: 10,
        percentage: 50,
        completed: 4,
        failed: 1,
        skipped: 0,
      };

      const formatted = userInterface.formatProgressInfo(progress);

      expect(formatted).toContain('50%');
      expect(formatted).toContain('6/10'); // current+1 / total
      expect(formatted).toContain('Completed: 4');
      expect(formatted).toContain('Failed: 1');
    });

    it('should handle zero progress', () => {
      const progress: ProgressInfo = {
        current: 0,
        total: 5,
        percentage: 0,
        completed: 0,
        failed: 0,
        skipped: 0,
      };

      const formatted = userInterface.formatProgressInfo(progress);

      expect(formatted).toContain('0%');
      expect(formatted).toContain('1/5');
    });
  });

  describe('showProgress', () => {
    it('should display progress (console)', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const progress: ProgressInfo = {
        current: 2,
        total: 5,
        percentage: 40,
        completed: 2,
        failed: 0,
        skipped: 0,
      };

      userInterface.showProgress(progress);

      expect(consoleSpy).toHaveBeenCalled();
      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain('40%');

      consoleSpy.mockRestore();
    });
  });

  describe('parseApprovalResult', () => {
    it('should parse approved result', () => {
      const result = userInterface.parseApprovalResult('approve');
      expect(result).toBe('approved');
    });

    it('should parse skipped result', () => {
      const result = userInterface.parseApprovalResult('skip');
      expect(result).toBe('skipped');
    });

    it('should parse aborted result', () => {
      const result = userInterface.parseApprovalResult('abort');
      expect(result).toBe('aborted');
    });

    it('should handle case-insensitive input', () => {
      expect(userInterface.parseApprovalResult('APPROVE')).toBe('approved');
      expect(userInterface.parseApprovalResult('Skip')).toBe('skipped');
      expect(userInterface.parseApprovalResult('ABORT')).toBe('aborted');
    });

    it('should default to aborted for unknown input', () => {
      const result = userInterface.parseApprovalResult('unknown');
      expect(result).toBe('aborted');
    });
  });

  describe('parseErrorAction', () => {
    it('should parse retry action', () => {
      const action = userInterface.parseErrorAction('retry');
      expect(action).toBe('retry');
    });

    it('should parse skip action', () => {
      const action = userInterface.parseErrorAction('skip');
      expect(action).toBe('skip');
    });

    it('should parse abort action', () => {
      const action = userInterface.parseErrorAction('abort');
      expect(action).toBe('abort');
    });

    it('should handle case-insensitive input', () => {
      expect(userInterface.parseErrorAction('RETRY')).toBe('retry');
      expect(userInterface.parseErrorAction('Skip')).toBe('skip');
    });

    it('should default to abort for unknown input', () => {
      const action = userInterface.parseErrorAction('invalid');
      expect(action).toBe('abort');
    });
  });

  describe('createUserInterface factory', () => {
    it('should create UserInterface instance', () => {
      const instance = createUserInterface();
      expect(instance).toBeInstanceOf(UserInterface);
    });
  });
});

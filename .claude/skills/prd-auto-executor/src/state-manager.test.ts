/**
 * State Manager Unit Tests
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { StateManager } from './state-manager';
import { ExecutionState, TaskStatus } from './types';

// Test project path (temporary)
const TEST_PROJECT_PATH = path.join(__dirname, '../test-data/state-manager-test');
const STATE_FILE_PATH = path.join(TEST_PROJECT_PATH, 'execution_state.json');

describe('StateManager', () => {
  let stateManager: StateManager;

  beforeEach(async () => {
    stateManager = new StateManager();

    // Create test directory
    await fs.mkdir(TEST_PROJECT_PATH, { recursive: true });
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(TEST_PROJECT_PATH, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('loadState', () => {
    it('should return null if state file does not exist', async () => {
      const state = await stateManager.loadState(TEST_PROJECT_PATH);
      expect(state).toBeNull();
    });

    it('should load state from file if it exists', async () => {
      const mockState: ExecutionState = {
        projectPath: TEST_PROJECT_PATH,
        currentPhase: 'Phase 1',
        currentTask: 'Test Task',
        taskIndex: 0,
        status: 'in_progress',
        retryCount: 0,
        maxRetries: 3,
        lastCheckpoint: 'checkpoint-0',
        timestamp: new Date().toISOString(),
      };

      // Write mock state file
      await fs.writeFile(STATE_FILE_PATH, JSON.stringify(mockState, null, 2));

      const loadedState = await stateManager.loadState(TEST_PROJECT_PATH);
      expect(loadedState).not.toBeNull();
      expect(loadedState?.projectPath).toBe(TEST_PROJECT_PATH);
      expect(loadedState?.currentTask).toBe('Test Task');
      expect(loadedState?.taskIndex).toBe(0);
    });

    it('should return null if state file is corrupted', async () => {
      // Write invalid JSON
      await fs.writeFile(STATE_FILE_PATH, 'invalid json');

      const state = await stateManager.loadState(TEST_PROJECT_PATH);
      expect(state).toBeNull();
    });

    it('should return null if state file has invalid structure', async () => {
      // Write incomplete state (missing required fields)
      await fs.writeFile(
        STATE_FILE_PATH,
        JSON.stringify({ projectPath: TEST_PROJECT_PATH })
      );

      const state = await stateManager.loadState(TEST_PROJECT_PATH);
      expect(state).toBeNull();
    });
  });

  describe('saveState', () => {
    it('should save state to file', async () => {
      const mockState: ExecutionState = {
        projectPath: TEST_PROJECT_PATH,
        currentPhase: 'Phase 1',
        currentTask: 'Test Task',
        taskIndex: 0,
        status: 'in_progress',
        retryCount: 0,
        maxRetries: 3,
        lastCheckpoint: 'checkpoint-0',
        timestamp: new Date().toISOString(),
      };

      await stateManager.saveState(mockState);

      // Verify file exists
      const fileContent = await fs.readFile(STATE_FILE_PATH, 'utf-8');
      const savedState = JSON.parse(fileContent) as ExecutionState;

      expect(savedState.projectPath).toBe(TEST_PROJECT_PATH);
      expect(savedState.currentTask).toBe('Test Task');
      expect(savedState.taskIndex).toBe(0);
    });

    it('should update timestamp when saving', async () => {
      const oldTimestamp = '2024-01-01T00:00:00.000Z';
      const mockState: ExecutionState = {
        projectPath: TEST_PROJECT_PATH,
        currentPhase: 'Phase 1',
        currentTask: 'Test Task',
        taskIndex: 0,
        status: 'in_progress',
        retryCount: 0,
        maxRetries: 3,
        lastCheckpoint: 'checkpoint-0',
        timestamp: oldTimestamp,
      };

      await stateManager.saveState(mockState);

      const fileContent = await fs.readFile(STATE_FILE_PATH, 'utf-8');
      const savedState = JSON.parse(fileContent) as ExecutionState;

      expect(savedState.timestamp).not.toBe(oldTimestamp);
    });

    it('should create directory if it does not exist', async () => {
      const nestedPath = path.join(TEST_PROJECT_PATH, 'nested/path');
      const mockState: ExecutionState = {
        projectPath: nestedPath,
        currentPhase: 'Phase 1',
        currentTask: 'Test Task',
        taskIndex: 0,
        status: 'in_progress',
        retryCount: 0,
        maxRetries: 3,
        lastCheckpoint: 'checkpoint-0',
        timestamp: new Date().toISOString(),
      };

      await stateManager.saveState(mockState);

      const stateFilePath = path.join(nestedPath, 'execution_state.json');
      const fileExists = await fs
        .access(stateFilePath)
        .then(() => true)
        .catch(() => false);

      expect(fileExists).toBe(true);

      // Clean up nested directory
      await fs.rm(path.join(TEST_PROJECT_PATH, 'nested'), {
        recursive: true,
        force: true,
      });
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status', () => {
      const mockState: ExecutionState = {
        projectPath: TEST_PROJECT_PATH,
        currentPhase: 'Phase 1',
        currentTask: 'Test Task',
        taskIndex: 0,
        status: 'pending',
        retryCount: 0,
        maxRetries: 3,
        lastCheckpoint: 'checkpoint-0',
        timestamp: new Date().toISOString(),
      };

      const updatedState = stateManager.updateTaskStatus(
        mockState,
        1,
        'in_progress'
      );

      expect(updatedState.taskIndex).toBe(1);
      expect(updatedState.status).toBe('in_progress');
    });

    it('should update timestamp when updating status', () => {
      const oldTimestamp = '2024-01-01T00:00:00.000Z';
      const mockState: ExecutionState = {
        projectPath: TEST_PROJECT_PATH,
        currentPhase: 'Phase 1',
        currentTask: 'Test Task',
        taskIndex: 0,
        status: 'pending',
        retryCount: 0,
        maxRetries: 3,
        lastCheckpoint: 'checkpoint-0',
        timestamp: oldTimestamp,
      };

      const updatedState = stateManager.updateTaskStatus(
        mockState,
        0,
        'completed'
      );

      expect(updatedState.timestamp).not.toBe(oldTimestamp);
    });
  });

  describe('incrementRetry', () => {
    it('should increment retry count', () => {
      const mockState: ExecutionState = {
        projectPath: TEST_PROJECT_PATH,
        currentPhase: 'Phase 1',
        currentTask: 'Test Task',
        taskIndex: 0,
        status: 'in_progress',
        retryCount: 0,
        maxRetries: 3,
        lastCheckpoint: 'checkpoint-0',
        timestamp: new Date().toISOString(),
      };

      const updatedState = stateManager.incrementRetry(mockState);

      expect(updatedState.retryCount).toBe(1);
    });

    it('should preserve other fields when incrementing retry', () => {
      const mockState: ExecutionState = {
        projectPath: TEST_PROJECT_PATH,
        currentPhase: 'Phase 1',
        currentTask: 'Test Task',
        taskIndex: 0,
        status: 'in_progress',
        retryCount: 1,
        maxRetries: 3,
        lastCheckpoint: 'checkpoint-0',
        timestamp: new Date().toISOString(),
      };

      const updatedState = stateManager.incrementRetry(mockState);

      expect(updatedState.retryCount).toBe(2);
      expect(updatedState.taskIndex).toBe(0);
      expect(updatedState.currentTask).toBe('Test Task');
    });
  });

  describe('resetRetry', () => {
    it('should reset retry count to 0', () => {
      const mockState: ExecutionState = {
        projectPath: TEST_PROJECT_PATH,
        currentPhase: 'Phase 1',
        currentTask: 'Test Task',
        taskIndex: 0,
        status: 'in_progress',
        retryCount: 2,
        maxRetries: 3,
        lastCheckpoint: 'checkpoint-0',
        timestamp: new Date().toISOString(),
      };

      const updatedState = stateManager.resetRetry(mockState);

      expect(updatedState.retryCount).toBe(0);
    });
  });

  describe('resetState', () => {
    it('should delete state file if it exists', async () => {
      const mockState: ExecutionState = {
        projectPath: TEST_PROJECT_PATH,
        currentPhase: 'Phase 1',
        currentTask: 'Test Task',
        taskIndex: 0,
        status: 'in_progress',
        retryCount: 0,
        maxRetries: 3,
        lastCheckpoint: 'checkpoint-0',
        timestamp: new Date().toISOString(),
      };

      // Save state first
      await stateManager.saveState(mockState);

      // Verify file exists
      let fileExists = await fs
        .access(STATE_FILE_PATH)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(true);

      // Reset state
      await stateManager.resetState(TEST_PROJECT_PATH);

      // Verify file is deleted
      fileExists = await fs
        .access(STATE_FILE_PATH)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(false);
    });

    it('should not throw error if state file does not exist', async () => {
      await expect(
        stateManager.resetState(TEST_PROJECT_PATH)
      ).resolves.not.toThrow();
    });
  });

  describe('canResume', () => {
    it('should return false if state is null', () => {
      const canResume = stateManager.canResume(null);
      expect(canResume).toBe(false);
    });

    it('should return true if status is in_progress', () => {
      const mockState: ExecutionState = {
        projectPath: TEST_PROJECT_PATH,
        currentPhase: 'Phase 1',
        currentTask: 'Test Task',
        taskIndex: 0,
        status: 'in_progress',
        retryCount: 0,
        maxRetries: 3,
        lastCheckpoint: 'checkpoint-0',
        timestamp: new Date().toISOString(),
      };

      const canResume = stateManager.canResume(mockState);
      expect(canResume).toBe(true);
    });

    it('should return true if status is failed', () => {
      const mockState: ExecutionState = {
        projectPath: TEST_PROJECT_PATH,
        currentPhase: 'Phase 1',
        currentTask: 'Test Task',
        taskIndex: 0,
        status: 'failed',
        retryCount: 3,
        maxRetries: 3,
        lastCheckpoint: 'checkpoint-0',
        timestamp: new Date().toISOString(),
      };

      const canResume = stateManager.canResume(mockState);
      expect(canResume).toBe(true);
    });

    it('should return false if status is pending', () => {
      const mockState: ExecutionState = {
        projectPath: TEST_PROJECT_PATH,
        currentPhase: 'Phase 1',
        currentTask: 'Test Task',
        taskIndex: 0,
        status: 'pending',
        retryCount: 0,
        maxRetries: 3,
        lastCheckpoint: 'checkpoint-0',
        timestamp: new Date().toISOString(),
      };

      const canResume = stateManager.canResume(mockState);
      expect(canResume).toBe(false);
    });

    it('should return false if status is completed', () => {
      const mockState: ExecutionState = {
        projectPath: TEST_PROJECT_PATH,
        currentPhase: 'Phase 1',
        currentTask: 'Test Task',
        taskIndex: 0,
        status: 'completed',
        retryCount: 0,
        maxRetries: 3,
        lastCheckpoint: 'checkpoint-0',
        timestamp: new Date().toISOString(),
      };

      const canResume = stateManager.canResume(mockState);
      expect(canResume).toBe(false);
    });
  });

  describe('createInitialState', () => {
    it('should create initial state with default values', () => {
      const initialState = stateManager.createInitialState(
        TEST_PROJECT_PATH,
        './checklist.json'
      );

      expect(initialState.projectPath).toBe(TEST_PROJECT_PATH);
      expect(initialState.currentPhase).toBe('Phase 1');
      expect(initialState.currentTask).toBe('');
      expect(initialState.taskIndex).toBe(0);
      expect(initialState.status).toBe('pending');
      expect(initialState.retryCount).toBe(0);
      expect(initialState.maxRetries).toBe(3);
      expect(initialState.lastCheckpoint).toBe('');
      expect(initialState.timestamp).toBeTruthy();
    });

    it('should create initial state with custom maxRetries', () => {
      const initialState = stateManager.createInitialState(
        TEST_PROJECT_PATH,
        './checklist.json',
        5
      );

      expect(initialState.maxRetries).toBe(5);
    });
  });

  describe('getStateFileInfo', () => {
    it('should return exists: false if file does not exist', async () => {
      const info = await stateManager.getStateFileInfo(TEST_PROJECT_PATH);

      expect(info.exists).toBe(false);
      expect(info.path).toBe(STATE_FILE_PATH);
      expect(info.size).toBeUndefined();
      expect(info.modified).toBeUndefined();
    });

    it('should return file info if file exists', async () => {
      const mockState: ExecutionState = {
        projectPath: TEST_PROJECT_PATH,
        currentPhase: 'Phase 1',
        currentTask: 'Test Task',
        taskIndex: 0,
        status: 'in_progress',
        retryCount: 0,
        maxRetries: 3,
        lastCheckpoint: 'checkpoint-0',
        timestamp: new Date().toISOString(),
      };

      await stateManager.saveState(mockState);

      const info = await stateManager.getStateFileInfo(TEST_PROJECT_PATH);

      expect(info.exists).toBe(true);
      expect(info.path).toBe(STATE_FILE_PATH);
      expect(info.size).toBeGreaterThan(0);
      expect(info.modified).toBeDefined();
      // Check that it's a Date object by verifying it has getTime method
      expect(typeof info.modified?.getTime).toBe('function');
    });
  });
});

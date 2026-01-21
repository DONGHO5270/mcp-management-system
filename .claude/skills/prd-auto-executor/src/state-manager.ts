/**
 * State Manager
 *
 * Manages execution state persistence via execution_state.json
 *
 * Pattern Source: prd-implementation-tracker (Pattern 2)
 * Location: {projectPath}/execution_state.json
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import {
  ExecutionState,
  TaskStatus,
  isExecutionState,
  SerenaMemoryState,
} from './types';

/**
 * StateManager class
 *
 * Responsibilities:
 * - Load/save execution state from/to JSON file
 * - Update task status and retry count
 * - Validate state integrity
 * - Optionally sync with Serena Memory
 */
export class StateManager {
  private readonly stateFileName = 'execution_state.json';

  /**
   * Get state file path
   */
  private getStateFilePath(projectPath: string): string {
    return path.join(projectPath, this.stateFileName);
  }

  /**
   * Load execution state from file
   *
   * @param projectPath - Project root directory
   * @returns ExecutionState or null if not found
   */
  async loadState(projectPath: string): Promise<ExecutionState | null> {
    const stateFilePath = this.getStateFilePath(projectPath);

    try {
      const content = await fs.readFile(stateFilePath, 'utf-8');
      const state = JSON.parse(content) as unknown;

      // Validate state structure
      if (!isExecutionState(state)) {
        console.warn(`⚠️ Invalid state file: ${stateFilePath}`);
        return null;
      }

      console.log(`✅ State loaded from: ${stateFilePath}`);
      return state;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // File not found - normal on first run
        console.log(`ℹ️ No state file found (first run): ${stateFilePath}`);
        return null;
      }

      // Other errors
      console.error(`❌ Failed to load state: ${(error as Error).message}`);
      return null;
    }
  }

  /**
   * Save execution state to file
   *
   * @param state - Execution state to save
   */
  async saveState(state: ExecutionState): Promise<void> {
    const stateFilePath = this.getStateFilePath(state.projectPath);

    // Update timestamp
    const stateWithTimestamp: ExecutionState = {
      ...state,
      timestamp: new Date().toISOString(),
    };

    try {
      // Ensure directory exists
      await fs.mkdir(path.dirname(stateFilePath), { recursive: true });

      // Write state file
      await fs.writeFile(
        stateFilePath,
        JSON.stringify(stateWithTimestamp, null, 2),
        'utf-8'
      );

      console.log(`✅ State saved to: ${stateFilePath}`);
    } catch (error) {
      console.error(`❌ Failed to save state: ${(error as Error).message}`);
      throw new Error(`State save failed: ${(error as Error).message}`);
    }
  }

  /**
   * Update task status
   *
   * @param state - Current execution state
   * @param taskIndex - Task index to update
   * @param status - New status
   * @returns Updated state
   */
  updateTaskStatus(
    state: ExecutionState,
    taskIndex: number,
    status: TaskStatus
  ): ExecutionState {
    const updatedState: ExecutionState = {
      ...state,
      taskIndex,
      status,
      timestamp: new Date().toISOString(),
    };

    console.log(`📝 Task ${taskIndex} status updated: ${status}`);
    return updatedState;
  }

  /**
   * Increment retry count for current task
   *
   * @param state - Current execution state
   * @returns Updated state with incremented retry count
   */
  incrementRetry(state: ExecutionState): ExecutionState {
    const newRetryCount = state.retryCount + 1;

    const updatedState: ExecutionState = {
      ...state,
      retryCount: newRetryCount,
      timestamp: new Date().toISOString(),
    };

    console.log(
      `🔄 Retry count incremented: ${newRetryCount}/${state.maxRetries}`
    );
    return updatedState;
  }

  /**
   * Reset retry count (when moving to next task)
   *
   * @param state - Current execution state
   * @returns Updated state with retry count reset to 0
   */
  resetRetry(state: ExecutionState): ExecutionState {
    return {
      ...state,
      retryCount: 0,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Reset state completely (delete state file)
   *
   * @param projectPath - Project root directory
   */
  async resetState(projectPath: string): Promise<void> {
    const stateFilePath = this.getStateFilePath(projectPath);

    try {
      await fs.unlink(stateFilePath);
      console.log(`✅ State file deleted: ${stateFilePath}`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // File doesn't exist - no action needed
        console.log(`ℹ️ No state file to delete: ${stateFilePath}`);
        return;
      }

      console.error(`❌ Failed to delete state: ${(error as Error).message}`);
      throw new Error(`State reset failed: ${(error as Error).message}`);
    }
  }

  /**
   * Check if execution can be resumed
   *
   * @param state - Execution state (or null)
   * @returns True if state exists and is resumable
   */
  canResume(state: ExecutionState | null): boolean {
    if (!state) {
      return false;
    }

    // Only resume if status is in_progress or failed
    return state.status === 'in_progress' || state.status === 'failed';
  }

  /**
   * Create initial state for new execution
   *
   * @param projectPath - Project root directory
   * @param checklistPath - Path to checklist.json
   * @param maxRetries - Maximum retries per task
   * @returns Initial execution state
   */
  createInitialState(
    projectPath: string,
    _checklistPath: string,
    maxRetries = 3
  ): ExecutionState {
    const initialState: ExecutionState = {
      projectPath,
      currentPhase: 'Phase 1',
      currentTask: '',
      taskIndex: 0,
      status: 'pending',
      retryCount: 0,
      maxRetries,
      lastCheckpoint: '',
      timestamp: new Date().toISOString(),
    };

    console.log(`✅ Initial state created for: ${projectPath}`);
    return initialState;
  }

  /**
   * Optional: Save to Serena Memory (for session continuity)
   *
   * Pattern Source: prd-implementation-tracker:871-925
   *
   * NOTE: This is optional and requires Serena Memory MCP integration
   *
   * @param state - Execution state to save
   */
  async saveToSerena(state: ExecutionState): Promise<void> {
    try {
      const memoryContent: SerenaMemoryState = {
        memory_name: `prd_executor_${state.projectPath.replace(/[/\\]/g, '_')}`,
        project_path: state.projectPath,
        current_phase: state.currentPhase,
        current_task: state.currentTask,
        task_index: state.taskIndex,
        retry_count: state.retryCount,
        last_checkpoint: state.lastCheckpoint,
        status: state.status,
        last_updated: new Date().toISOString(),
      };

      // TODO: Integrate with Serena Memory MCP
      // await writeMemory({
      //   memory_name: memoryContent.memory_name,
      //   content: memoryContent
      // });

      console.log(
        `📝 [Optional] Serena Memory save prepared: ${memoryContent.memory_name}`
      );
      console.log(`   (Serena MCP integration required for actual save)`);
    } catch (error) {
      console.warn(
        `⚠️ Serena Memory save failed: ${(error as Error).message}`
      );
      // Don't throw - Serena is optional
    }
  }

  /**
   * Optional: Load from Serena Memory
   *
   * @param projectPath - Project root directory
   * @returns ExecutionState from Serena Memory or null
   */
  async loadFromSerena(projectPath: string): Promise<ExecutionState | null> {
    try {
      const memoryName = `prd_executor_${projectPath.replace(/[/\\]/g, '_')}`;

      // TODO: Integrate with Serena Memory MCP
      // const memory = await readMemory({ memory_name: memoryName });
      // return memory as ExecutionState;

      console.log(`📝 [Optional] Serena Memory load attempted: ${memoryName}`);
      console.log(`   (Serena MCP integration required)`);
      return null;
    } catch (error) {
      console.warn(
        `⚠️ Serena Memory load failed: ${(error as Error).message}`
      );
      return null;
    }
  }

  /**
   * Get state file info (for debugging)
   *
   * @param projectPath - Project root directory
   * @returns File info or null if not found
   */
  async getStateFileInfo(projectPath: string): Promise<{
    exists: boolean;
    path: string;
    size?: number;
    modified?: Date;
  }> {
    const stateFilePath = this.getStateFilePath(projectPath);

    try {
      const stats = await fs.stat(stateFilePath);
      return {
        exists: true,
        path: stateFilePath,
        size: stats.size,
        modified: stats.mtime,
      };
    } catch (error) {
      return {
        exists: false,
        path: stateFilePath,
      };
    }
  }
}

/**
 * Create StateManager instance (factory)
 */
export function createStateManager(): StateManager {
  return new StateManager();
}

/**
 * Default export
 */
export default StateManager;

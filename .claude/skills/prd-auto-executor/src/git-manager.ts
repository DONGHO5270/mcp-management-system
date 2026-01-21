/**
 * Git Manager
 *
 * Manages Git operations for checkpoint/rollback safety
 *
 * Pattern Source: ARCHITECTURE.md Git Strategy
 * Dependencies: simple-git
 */

import simpleGit, { SimpleGit, StatusResult } from 'simple-git';
import { GitCheckpoint, GitCommitInfo } from './types';

/**
 * GitManager class
 *
 * Responsibilities:
 * - Create Git checkpoints (tags) before each task
 * - Commit changes on task success
 * - Rollback to checkpoints on task failure
 * - Validate Git repository state
 */
export class GitManager {
  private git: SimpleGit;
  private projectPath: string;

  /**
   * Constructor
   *
   * @param projectPath - Project root directory (must be a Git repo)
   */
  constructor(projectPath: string) {
    this.projectPath = projectPath;
    this.git = simpleGit(projectPath);
  }

  /**
   * Validate that project is a Git repository
   *
   * @throws Error if not a Git repo
   */
  async validateGitRepo(): Promise<void> {
    try {
      await this.git.status();
      console.log(`✅ Git repository validated: ${this.projectPath}`);
    } catch (error) {
      throw new Error(
        `Not a Git repository: ${this.projectPath}\n` +
          `Please run 'git init' first.\n` +
          `Error: ${(error as Error).message}`
      );
    }
  }

  /**
   * Create a Git checkpoint (tag)
   *
   * @param taskIndex - Task index (0-based)
   * @returns Checkpoint info
   */
  async createCheckpoint(taskIndex: number): Promise<GitCheckpoint> {
    const checkpointTag = `checkpoint-${taskIndex}`;

    try {
      // Check if tag already exists
      const existingTags = await this.git.tags();
      if (existingTags.all.includes(checkpointTag)) {
        console.warn(`⚠️ Checkpoint already exists: ${checkpointTag}`);
        // Delete existing tag
        await this.git.tag(['-d', checkpointTag]);
        console.log(`🗑️ Deleted existing checkpoint: ${checkpointTag}`);
      }

      // Create new tag
      await this.git.tag([checkpointTag]);

      // Get current commit SHA
      const log = await this.git.log({ maxCount: 1 });
      const commitSha = log.latest?.hash || '';

      const checkpoint: GitCheckpoint = {
        tag: checkpointTag,
        taskIndex,
        commitSha,
        createdAt: new Date().toISOString(),
      };

      console.log(`✅ Checkpoint created: ${checkpointTag} (${commitSha.substring(0, 7)})`);
      return checkpoint;
    } catch (error) {
      throw new Error(
        `Failed to create checkpoint: ${checkpointTag}\n` +
          `Error: ${(error as Error).message}`
      );
    }
  }

  /**
   * Commit task changes
   *
   * @param taskName - Task name
   * @param customMessage - Optional custom commit message
   * @returns Commit info
   */
  async commitTask(
    taskName: string,
    customMessage?: string
  ): Promise<GitCommitInfo> {
    try {
      // Check if there are changes to commit
      const status = await this.git.status();
      if (status.isClean()) {
        console.log(`ℹ️ No changes to commit for: ${taskName}`);
        // Return latest commit info
        const log = await this.git.log({ maxCount: 1 });
        return {
          sha: log.latest?.hash || '',
          message: log.latest?.message || '',
          author: log.latest?.author_name || '',
          timestamp: log.latest?.date || '',
        };
      }

      // Add all changes
      await this.git.add('.');

      // Create commit message
      const message =
        customMessage ||
        `✅ ${taskName}\n\n` +
          `- 테스트 통과: npm test\n` +
          `- 빌드 성공: npm run build\n` +
          `- 린트 통과: npm run lint\n\n` +
          `🤖 Generated with prd-auto-executor`;

      // Commit
      const result = await this.git.commit(message);

      const commitInfo: GitCommitInfo = {
        sha: result.commit,
        message,
        author: '', // Will be filled by Git config
        timestamp: new Date().toISOString(),
      };

      console.log(`✅ Committed: ${taskName} (${result.commit.substring(0, 7)})`);
      return commitInfo;
    } catch (error) {
      throw new Error(
        `Failed to commit task: ${taskName}\n` +
          `Error: ${(error as Error).message}`
      );
    }
  }

  /**
   * Rollback to a checkpoint
   *
   * WARNING: This is a destructive operation!
   * All uncommitted changes will be lost.
   *
   * @param checkpointTag - Checkpoint tag to rollback to
   */
  async rollbackToCheckpoint(checkpointTag: string): Promise<void> {
    try {
      // Verify checkpoint exists
      const tags = await this.git.tags();
      if (!tags.all.includes(checkpointTag)) {
        throw new Error(`Checkpoint not found: ${checkpointTag}`);
      }

      // Reset to checkpoint (--hard)
      await this.git.reset(['--hard', checkpointTag]);

      // Clean untracked files and directories
      await this.git.clean('f', ['-d']);

      console.log(`✅ Rolled back to: ${checkpointTag}`);
    } catch (error) {
      throw new Error(
        `Failed to rollback to checkpoint: ${checkpointTag}\n` +
          `Error: ${(error as Error).message}`
      );
    }
  }

  /**
   * Get current branch name
   *
   * @returns Branch name
   */
  async getCurrentBranch(): Promise<string> {
    try {
      const status = await this.git.status();
      return status.current || 'unknown';
    } catch (error) {
      throw new Error(
        `Failed to get current branch\n` + `Error: ${(error as Error).message}`
      );
    }
  }

  /**
   * Check if there are uncommitted changes
   *
   * @returns True if there are uncommitted changes
   */
  async hasUncommittedChanges(): Promise<boolean> {
    try {
      const status = await this.git.status();
      return !status.isClean();
    } catch (error) {
      throw new Error(
        `Failed to check uncommitted changes\n` +
          `Error: ${(error as Error).message}`
      );
    }
  }

  /**
   * List all checkpoints (tags matching 'checkpoint-*')
   *
   * @returns Array of checkpoint tags
   */
  async listCheckpoints(): Promise<string[]> {
    try {
      const tags = await this.git.tags();
      const checkpoints = tags.all.filter((tag) =>
        tag.startsWith('checkpoint-')
      );
      return checkpoints.sort();
    } catch (error) {
      throw new Error(
        `Failed to list checkpoints\n` + `Error: ${(error as Error).message}`
      );
    }
  }

  /**
   * Delete a checkpoint (tag)
   *
   * @param checkpointTag - Checkpoint tag to delete
   */
  async deleteCheckpoint(checkpointTag: string): Promise<void> {
    try {
      // Verify checkpoint exists
      const tags = await this.git.tags();
      if (!tags.all.includes(checkpointTag)) {
        console.warn(`⚠️ Checkpoint not found (skip delete): ${checkpointTag}`);
        return;
      }

      // Delete tag
      await this.git.tag(['-d', checkpointTag]);
      console.log(`🗑️ Checkpoint deleted: ${checkpointTag}`);
    } catch (error) {
      throw new Error(
        `Failed to delete checkpoint: ${checkpointTag}\n` +
          `Error: ${(error as Error).message}`
      );
    }
  }

  /**
   * Delete all checkpoints (cleanup)
   */
  async deleteAllCheckpoints(): Promise<void> {
    try {
      const checkpoints = await this.listCheckpoints();
      if (checkpoints.length === 0) {
        console.log(`ℹ️ No checkpoints to delete`);
        return;
      }

      for (const checkpoint of checkpoints) {
        await this.deleteCheckpoint(checkpoint);
      }

      console.log(`✅ All checkpoints deleted (${checkpoints.length} total)`);
    } catch (error) {
      throw new Error(
        `Failed to delete all checkpoints\n` +
          `Error: ${(error as Error).message}`
      );
    }
  }

  /**
   * Get Git status (for debugging)
   *
   * @returns Status result
   */
  async getStatus(): Promise<StatusResult> {
    try {
      return await this.git.status();
    } catch (error) {
      throw new Error(
        `Failed to get Git status\n` + `Error: ${(error as Error).message}`
      );
    }
  }

  /**
   * Get commit log
   *
   * @param maxCount - Maximum number of commits to retrieve
   * @returns Commit log
   */
  async getLog(maxCount = 10): Promise<GitCommitInfo[]> {
    try {
      const log = await this.git.log({ maxCount });
      return log.all.map((commit) => ({
        sha: commit.hash,
        message: commit.message,
        author: commit.author_name,
        timestamp: commit.date,
      }));
    } catch (error) {
      throw new Error(
        `Failed to get Git log\n` + `Error: ${(error as Error).message}`
      );
    }
  }

  /**
   * Check if branch is main or master (for safety)
   *
   * @returns True if on main/master branch
   */
  async isOnMainBranch(): Promise<boolean> {
    try {
      const branch = await this.getCurrentBranch();
      return branch === 'main' || branch === 'master';
    } catch (error) {
      return false;
    }
  }

  /**
   * Safety check before destructive operations
   *
   * @throws Error if on main/master branch or has uncommitted changes
   */
  async safetyCheck(): Promise<void> {
    // Check if on main/master
    if (await this.isOnMainBranch()) {
      const branch = await this.getCurrentBranch();
      console.warn(
        `⚠️ WARNING: You are on '${branch}' branch.\n` +
          `   It's recommended to use a feature branch for prd-auto-executor.`
      );
      // Don't throw - just warn
    }

    // Check for uncommitted changes (before first checkpoint)
    if (await this.hasUncommittedChanges()) {
      throw new Error(
        `❌ Uncommitted changes detected.\n` +
          `   Please commit or stash your changes before running prd-auto-executor.\n` +
          `   Run 'git status' to see uncommitted changes.`
      );
    }

    console.log(`✅ Safety check passed`);
  }
}

/**
 * Create GitManager instance (factory)
 *
 * @param projectPath - Project root directory
 * @returns GitManager instance
 */
export async function createGitManager(
  projectPath: string
): Promise<GitManager> {
  const manager = new GitManager(projectPath);
  await manager.validateGitRepo();
  return manager;
}

/**
 * Default export
 */
export default GitManager;

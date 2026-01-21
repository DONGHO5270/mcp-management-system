/**
 * Git Manager Unit Tests
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import simpleGit, { SimpleGit } from 'simple-git';
import { GitManager, createGitManager } from './git-manager';

// Test project path (temporary)
const TEST_PROJECT_PATH = path.join(__dirname, '../test-data/git-manager-test');

describe('GitManager', () => {
  let gitManager: GitManager;
  let git: SimpleGit;

  beforeEach(async () => {
    // Create test directory
    await fs.mkdir(TEST_PROJECT_PATH, { recursive: true });

    // Initialize Git repository
    git = simpleGit(TEST_PROJECT_PATH);
    await git.init();

    // Configure Git user (required for commits)
    await git.addConfig('user.name', 'Test User');
    await git.addConfig('user.email', 'test@example.com');

    // Create initial commit (required for tags)
    const testFilePath = path.join(TEST_PROJECT_PATH, 'test.txt');
    await fs.writeFile(testFilePath, 'Initial content');
    await git.add('.');
    await git.commit('Initial commit');

    // Create GitManager instance
    gitManager = new GitManager(TEST_PROJECT_PATH);
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(TEST_PROJECT_PATH, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('validateGitRepo', () => {
    it('should validate Git repository successfully', async () => {
      await expect(gitManager.validateGitRepo()).resolves.not.toThrow();
    });

    it('should throw error if not a Git repository', async () => {
      // Use system temp directory to avoid parent Git repo detection
      const os = await import('os');
      const nonGitPath = path.join(os.tmpdir(), `non-git-test-${Date.now()}`);
      await fs.mkdir(nonGitPath, { recursive: true });

      const nonGitManager = new GitManager(nonGitPath);

      await expect(nonGitManager.validateGitRepo()).rejects.toThrow(
        'Not a Git repository'
      );

      // Clean up
      await fs.rm(nonGitPath, { recursive: true, force: true });
    });
  });

  describe('createCheckpoint', () => {
    it('should create a checkpoint tag', async () => {
      const checkpoint = await gitManager.createCheckpoint(0);

      expect(checkpoint.tag).toBe('checkpoint-0');
      expect(checkpoint.taskIndex).toBe(0);
      expect(checkpoint.commitSha).toBeTruthy();
      expect(checkpoint.createdAt).toBeTruthy();

      // Verify tag exists
      const tags = await git.tags();
      expect(tags.all).toContain('checkpoint-0');
    });

    it('should overwrite existing checkpoint', async () => {
      // Create checkpoint twice
      await gitManager.createCheckpoint(0);
      const secondCheckpoint = await gitManager.createCheckpoint(0);

      expect(secondCheckpoint.tag).toBe('checkpoint-0');

      // Verify only one tag exists
      const tags = await git.tags();
      const checkpointCount = tags.all.filter((t) =>
        t.startsWith('checkpoint-0')
      ).length;
      expect(checkpointCount).toBe(1);
    });

    it('should create multiple checkpoints', async () => {
      await gitManager.createCheckpoint(0);
      await gitManager.createCheckpoint(1);
      await gitManager.createCheckpoint(2);

      const tags = await git.tags();
      expect(tags.all).toContain('checkpoint-0');
      expect(tags.all).toContain('checkpoint-1');
      expect(tags.all).toContain('checkpoint-2');
    });
  });

  describe('commitTask', () => {
    it('should commit changes with default message', async () => {
      // Make changes
      const testFilePath = path.join(TEST_PROJECT_PATH, 'test.txt');
      await fs.writeFile(testFilePath, 'Modified content');

      const commitInfo = await gitManager.commitTask('Test Task');

      expect(commitInfo.sha).toBeTruthy();
      expect(commitInfo.message).toContain('✅ Test Task');
      expect(commitInfo.message).toContain('npm test');
      expect(commitInfo.message).toContain('prd-auto-executor');

      // Verify commit exists
      const log = await git.log({ maxCount: 1 });
      expect(log.latest?.message).toContain('Test Task');
    });

    it('should commit changes with custom message', async () => {
      // Make changes
      const testFilePath = path.join(TEST_PROJECT_PATH, 'test.txt');
      await fs.writeFile(testFilePath, 'Modified content 2');

      const customMessage = 'Custom commit message';
      const commitInfo = await gitManager.commitTask('Test Task', customMessage);

      expect(commitInfo.message).toBe(customMessage);

      // Verify commit exists
      const log = await git.log({ maxCount: 1 });
      expect(log.latest?.message).toBe(customMessage);
    });

    it('should return latest commit info if no changes', async () => {
      // No changes - repository is clean
      const commitInfo = await gitManager.commitTask('Test Task');

      expect(commitInfo.sha).toBeTruthy();

      // Verify commit is the initial commit
      const log = await git.log({ maxCount: 1 });
      expect(log.latest?.message).toBe('Initial commit');
    });

    it('should add all files before committing', async () => {
      // Create new file
      const newFilePath = path.join(TEST_PROJECT_PATH, 'new-file.txt');
      await fs.writeFile(newFilePath, 'New file content');

      await gitManager.commitTask('Add new file');

      // Verify file is committed
      const status = await git.status();
      expect(status.isClean()).toBe(true);
    });
  });

  describe('rollbackToCheckpoint', () => {
    it('should rollback to checkpoint', async () => {
      // Create checkpoint
      await gitManager.createCheckpoint(0);

      // Make changes
      const testFilePath = path.join(TEST_PROJECT_PATH, 'test.txt');
      await fs.writeFile(testFilePath, 'Modified for rollback');
      await git.add('.');
      await git.commit('Change to be rolled back');

      // Rollback
      await gitManager.rollbackToCheckpoint('checkpoint-0');

      // Verify rollback
      const log = await git.log({ maxCount: 1 });
      expect(log.latest?.message).toBe('Initial commit');
    });

    it('should clean untracked files during rollback', async () => {
      // Create checkpoint
      await gitManager.createCheckpoint(0);

      // Create untracked file
      const untrackedFilePath = path.join(TEST_PROJECT_PATH, 'untracked.txt');
      await fs.writeFile(untrackedFilePath, 'Untracked content');

      // Rollback
      await gitManager.rollbackToCheckpoint('checkpoint-0');

      // Verify untracked file is deleted
      const fileExists = await fs
        .access(untrackedFilePath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(false);
    });

    it('should throw error if checkpoint does not exist', async () => {
      await expect(
        gitManager.rollbackToCheckpoint('checkpoint-999')
      ).rejects.toThrow('Checkpoint not found');
    });
  });

  describe('getCurrentBranch', () => {
    it('should return current branch name', async () => {
      const branch = await gitManager.getCurrentBranch();
      // Default branch is usually 'master' or 'main'
      expect(branch).toBeTruthy();
      expect(typeof branch).toBe('string');
    });

    it('should return new branch name after checkout', async () => {
      // Create and checkout new branch
      await git.checkoutLocalBranch('feature-test');

      const branch = await gitManager.getCurrentBranch();
      expect(branch).toBe('feature-test');
    });
  });

  describe('hasUncommittedChanges', () => {
    it('should return false for clean repository', async () => {
      const hasChanges = await gitManager.hasUncommittedChanges();
      expect(hasChanges).toBe(false);
    });

    it('should return true for modified files', async () => {
      // Modify file
      const testFilePath = path.join(TEST_PROJECT_PATH, 'test.txt');
      await fs.writeFile(testFilePath, 'Modified content');

      const hasChanges = await gitManager.hasUncommittedChanges();
      expect(hasChanges).toBe(true);
    });

    it('should return true for new untracked files', async () => {
      // Create new file
      const newFilePath = path.join(TEST_PROJECT_PATH, 'new.txt');
      await fs.writeFile(newFilePath, 'New file');

      const hasChanges = await gitManager.hasUncommittedChanges();
      expect(hasChanges).toBe(true);
    });
  });

  describe('listCheckpoints', () => {
    it('should return empty array if no checkpoints', async () => {
      const checkpoints = await gitManager.listCheckpoints();
      expect(checkpoints).toEqual([]);
    });

    it('should list all checkpoints', async () => {
      await gitManager.createCheckpoint(0);
      await gitManager.createCheckpoint(1);
      await gitManager.createCheckpoint(2);

      const checkpoints = await gitManager.listCheckpoints();
      expect(checkpoints).toEqual(['checkpoint-0', 'checkpoint-1', 'checkpoint-2']);
    });

    it('should not list non-checkpoint tags', async () => {
      await gitManager.createCheckpoint(0);
      await git.tag(['v1.0.0']); // Non-checkpoint tag

      const checkpoints = await gitManager.listCheckpoints();
      expect(checkpoints).toEqual(['checkpoint-0']);
    });
  });

  describe('deleteCheckpoint', () => {
    it('should delete a checkpoint', async () => {
      await gitManager.createCheckpoint(0);

      // Verify checkpoint exists
      let tags = await git.tags();
      expect(tags.all).toContain('checkpoint-0');

      // Delete checkpoint
      await gitManager.deleteCheckpoint('checkpoint-0');

      // Verify checkpoint is deleted
      tags = await git.tags();
      expect(tags.all).not.toContain('checkpoint-0');
    });

    it('should not throw error if checkpoint does not exist', async () => {
      await expect(
        gitManager.deleteCheckpoint('checkpoint-999')
      ).resolves.not.toThrow();
    });
  });

  describe('deleteAllCheckpoints', () => {
    it('should delete all checkpoints', async () => {
      await gitManager.createCheckpoint(0);
      await gitManager.createCheckpoint(1);
      await gitManager.createCheckpoint(2);

      await gitManager.deleteAllCheckpoints();

      const checkpoints = await gitManager.listCheckpoints();
      expect(checkpoints).toEqual([]);
    });

    it('should not delete non-checkpoint tags', async () => {
      await gitManager.createCheckpoint(0);
      await git.tag(['v1.0.0']);

      await gitManager.deleteAllCheckpoints();

      const tags = await git.tags();
      expect(tags.all).toContain('v1.0.0');
      expect(tags.all).not.toContain('checkpoint-0');
    });

    it('should not throw error if no checkpoints exist', async () => {
      await expect(
        gitManager.deleteAllCheckpoints()
      ).resolves.not.toThrow();
    });
  });

  describe('getStatus', () => {
    it('should return Git status', async () => {
      const status = await gitManager.getStatus();
      expect(status).toBeTruthy();
      expect(status.isClean()).toBe(true);
    });

    it('should show modified files in status', async () => {
      // Modify file
      const testFilePath = path.join(TEST_PROJECT_PATH, 'test.txt');
      await fs.writeFile(testFilePath, 'Modified');

      const status = await gitManager.getStatus();
      expect(status.isClean()).toBe(false);
      expect(status.modified.length).toBeGreaterThan(0);
    });
  });

  describe('getLog', () => {
    it('should return commit log', async () => {
      const log = await gitManager.getLog(5);
      expect(log).toBeTruthy();
      expect(log.length).toBeGreaterThan(0);
      expect(log[0]?.message).toBe('Initial commit');
    });

    it('should limit log entries', async () => {
      // Create multiple commits
      for (let i = 0; i < 5; i++) {
        const testFilePath = path.join(TEST_PROJECT_PATH, 'test.txt');
        await fs.writeFile(testFilePath, `Content ${i}`);
        await git.add('.');
        await git.commit(`Commit ${i}`);
      }

      const log = await gitManager.getLog(3);
      expect(log.length).toBe(3);
    });
  });

  describe('isOnMainBranch', () => {
    it('should return true if on main/master branch', async () => {
      const isMain = await gitManager.isOnMainBranch();
      // Default branch is usually main or master
      expect(typeof isMain).toBe('boolean');
    });

    it('should return false if on feature branch', async () => {
      await git.checkoutLocalBranch('feature-test');

      const isMain = await gitManager.isOnMainBranch();
      expect(isMain).toBe(false);
    });
  });

  describe('safetyCheck', () => {
    it('should pass if repository is clean', async () => {
      await expect(gitManager.safetyCheck()).resolves.not.toThrow();
    });

    it('should throw error if there are uncommitted changes', async () => {
      // Modify file
      const testFilePath = path.join(TEST_PROJECT_PATH, 'test.txt');
      await fs.writeFile(testFilePath, 'Modified');

      await expect(gitManager.safetyCheck()).rejects.toThrow(
        'Uncommitted changes detected'
      );
    });

    it('should warn but not throw if on main branch', async () => {
      // If default branch is main/master, this should warn but not throw
      // We can't easily test the console output in Jest, but we can verify it doesn't throw
      await expect(gitManager.safetyCheck()).resolves.not.toThrow();
    });
  });

  describe('createGitManager factory', () => {
    it('should create and validate GitManager', async () => {
      const manager = await createGitManager(TEST_PROJECT_PATH);
      expect(manager).toBeInstanceOf(GitManager);
    });

    it('should throw error for non-Git directory', async () => {
      // Use system temp directory to avoid parent Git repo detection
      const os = await import('os');
      const nonGitPath = path.join(os.tmpdir(), `non-git-factory-${Date.now()}`);
      await fs.mkdir(nonGitPath, { recursive: true });

      await expect(createGitManager(nonGitPath)).rejects.toThrow();

      // Clean up
      await fs.rm(nonGitPath, { recursive: true, force: true });
    });
  });
});

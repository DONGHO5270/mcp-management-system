/**
 * Validator
 *
 * Runs test/build/lint commands and validates task completion
 *
 * Pattern Source: child_process + ValidationResult
 * Dependencies: child_process
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
  ValidationResult,
  ValidationResults,
  TaskMetadata,
} from './types';

const execAsync = promisify(exec);

/**
 * Validator class
 *
 * Responsibilities:
 * - Run test/build/lint commands via npm scripts
 * - Measure execution time
 * - Return structured validation results
 * - Handle timeouts gracefully
 */
export class Validator {
  private projectPath: string;
  private commandTimeout: number;

  /**
   * Constructor
   *
   * @param projectPath - Project root directory
   * @param commandTimeout - Command timeout in milliseconds (default: 300000 = 5 minutes)
   */
  constructor(projectPath: string, commandTimeout = 300000) {
    this.projectPath = projectPath;
    this.commandTimeout = commandTimeout;
  }

  /**
   * Run arbitrary command in project directory
   *
   * @param command - Command to execute
   * @returns ValidationResult
   */
  async runCommand(command: string): Promise<ValidationResult> {
    const startTime = Date.now();

    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: this.projectPath,
        timeout: this.commandTimeout,
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      });

      const duration = Date.now() - startTime;

      return {
        success: true,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode: 0,
        command,
        duration,
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;

      // Handle timeout
      if (error.killed && error.signal === 'SIGTERM') {
        return {
          success: false,
          stdout: error.stdout || '',
          stderr: `Command timeout after ${this.commandTimeout}ms`,
          exitCode: -1,
          command,
          duration,
        };
      }

      // Handle command failure
      return {
        success: false,
        stdout: error.stdout || '',
        stderr: error.stderr || error.message,
        exitCode: error.code || 1,
        command,
        duration,
      };
    }
  }

  /**
   * Run npm test
   *
   * @returns ValidationResult
   */
  async runTest(): Promise<ValidationResult> {
    console.log(`🧪 Running tests...`);

    const result = await this.runCommand('npm test');

    if (result.success) {
      console.log(`✅ Tests passed (${result.duration}ms)`);
    } else {
      console.error(`❌ Tests failed (exit code: ${result.exitCode})`);
    }

    return result;
  }

  /**
   * Run npm run build
   *
   * @returns ValidationResult
   */
  async runBuild(): Promise<ValidationResult> {
    console.log(`🔨 Running build...`);

    const result = await this.runCommand('npm run build');

    if (result.success) {
      console.log(`✅ Build succeeded (${result.duration}ms)`);
    } else {
      console.error(`❌ Build failed (exit code: ${result.exitCode})`);
    }

    return result;
  }

  /**
   * Run npm run lint
   *
   * @returns ValidationResult
   */
  async runLint(): Promise<ValidationResult> {
    console.log(`🔍 Running lint...`);

    // Check if lint script exists
    const hasLint = await this.hasScript('lint');

    if (!hasLint) {
      console.log(`ℹ️ No lint script found, skipping`);
      return {
        success: true,
        stdout: 'No lint script found in package.json',
        stderr: '',
        exitCode: 0,
        command: 'npm run lint',
        duration: 0,
      };
    }

    const result = await this.runCommand('npm run lint');

    if (result.success) {
      console.log(`✅ Lint passed (${result.duration}ms)`);
    } else {
      console.error(`❌ Lint failed (exit code: ${result.exitCode})`);
    }

    return result;
  }

  /**
   * Validate task with test/build/lint
   *
   * @param metadata - Task metadata with command info
   * @returns ValidationResults
   */
  async validateTask(metadata: TaskMetadata): Promise<ValidationResults> {
    const startTime = Date.now();
    const results: ValidationResults = {
      passed: true,
      results: {},
      totalDuration: 0,
    };

    // Run test (required)
    if (metadata.test_command) {
      const testResult = await this.runCommand(metadata.test_command);
      results.results.test = testResult;

      if (!testResult.success) {
        results.passed = false;
      }
    }

    // Run build (optional)
    if (metadata.build_command) {
      const buildResult = await this.runCommand(metadata.build_command);
      results.results.build = buildResult;

      if (!buildResult.success) {
        results.passed = false;
      }
    }

    // Run lint (optional)
    if (metadata.lint_command) {
      const lintResult = await this.runCommand(metadata.lint_command);
      results.results.lint = lintResult;

      // Lint failure is warning only (not blocking)
      // results.passed remains true
    }

    results.totalDuration = Date.now() - startTime;

    console.log(
      `📊 Validation ${results.passed ? 'passed' : 'failed'} (${results.totalDuration}ms)`
    );

    return results;
  }

  /**
   * Check if npm script exists in package.json
   *
   * @param scriptName - Script name to check
   * @returns True if script exists
   */
  private async hasScript(scriptName: string): Promise<boolean> {
    try {
      const packageJsonPath = path.join(this.projectPath, 'package.json');
      const content = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(content);

      return (
        packageJson.scripts &&
        typeof packageJson.scripts[scriptName] === 'string'
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * Get project information (for debugging)
   *
   * @returns Project info
   */
  async getProjectInfo(): Promise<{
    projectPath: string;
    hasPackageJson: boolean;
    hasNodeModules: boolean;
  }> {
    const packageJsonPath = path.join(this.projectPath, 'package.json');
    const nodeModulesPath = path.join(this.projectPath, 'node_modules');

    const hasPackageJson = await fs
      .access(packageJsonPath)
      .then(() => true)
      .catch(() => false);

    const hasNodeModules = await fs
      .access(nodeModulesPath)
      .then(() => true)
      .catch(() => false);

    return {
      projectPath: this.projectPath,
      hasPackageJson,
      hasNodeModules,
    };
  }
}

/**
 * Create Validator instance (factory)
 *
 * @param projectPath - Project root directory
 * @param commandTimeout - Optional timeout in milliseconds
 * @returns Validator instance
 */
export function createValidator(
  projectPath: string,
  commandTimeout?: number
): Validator {
  return new Validator(projectPath, commandTimeout);
}

/**
 * Default export
 */
export default Validator;

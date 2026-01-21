/**
 * Validator Unit Tests
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { Validator, createValidator } from './validator';
import { ValidationResult, TaskMetadata } from './types';

// Test project path (temporary)
const TEST_PROJECT_PATH = path.join(__dirname, '../test-data/validator-test');

describe('Validator', () => {
  let validator: Validator;

  beforeEach(async () => {
    validator = new Validator(TEST_PROJECT_PATH, 5000); // 5 second timeout

    // Create test directory
    await fs.mkdir(TEST_PROJECT_PATH, { recursive: true });

    // Create mock package.json with test scripts
    const packageJson = {
      name: 'test-project',
      version: '1.0.0',
      scripts: {
        test: 'echo "Test passed"',
        build: 'echo "Build passed"',
        lint: 'echo "Lint passed"',
      },
    };
    await fs.writeFile(
      path.join(TEST_PROJECT_PATH, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(TEST_PROJECT_PATH, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('runCommand', () => {
    it('should run command successfully', async () => {
      const result = await validator.runCommand('echo "Hello"');

      expect(result.success).toBe(true);
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Hello');
      expect(result.duration).toBeGreaterThan(0);
    });

    it('should capture command failure', async () => {
      const result = await validator.runCommand('exit 1');

      expect(result.success).toBe(false);
      expect(result.exitCode).toBe(1);
    });

    it('should respect timeout', async () => {
      const shortValidator = new Validator(TEST_PROJECT_PATH, 100); // 100ms timeout

      // Command that sleeps longer than timeout
      const result = await shortValidator.runCommand('sleep 1');

      expect(result.success).toBe(false);
      expect(result.stderr).toContain('timeout');
    }, 10000); // Jest timeout 10s

    it('should measure duration', async () => {
      const result = await validator.runCommand('echo "test"');

      expect(result.duration).toBeDefined();
      expect(result.duration).toBeGreaterThan(0);
    });
  });

  describe('runTest', () => {
    it('should run npm test successfully', async () => {
      const result = await validator.runTest();

      expect(result.success).toBe(true);
      expect(result.command).toBe('npm test');
      expect(result.stdout).toContain('Test passed');
    });

    it('should handle missing test script', async () => {
      // Overwrite package.json without test script
      const packageJson = {
        name: 'test-project',
        version: '1.0.0',
        scripts: {},
      };
      await fs.writeFile(
        path.join(TEST_PROJECT_PATH, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );

      const result = await validator.runTest();

      expect(result.success).toBe(false);
    });
  });

  describe('runBuild', () => {
    it('should run npm run build successfully', async () => {
      const result = await validator.runBuild();

      expect(result.success).toBe(true);
      expect(result.command).toBe('npm run build');
      expect(result.stdout).toContain('Build passed');
    });
  });

  describe('runLint', () => {
    it('should run npm run lint successfully', async () => {
      const result = await validator.runLint();

      expect(result.success).toBe(true);
      expect(result.command).toBe('npm run lint');
      expect(result.stdout).toContain('Lint passed');
    });

    it('should handle missing lint script gracefully', async () => {
      // Overwrite package.json without lint script
      const packageJson = {
        name: 'test-project',
        version: '1.0.0',
        scripts: {
          test: 'echo "Test"',
          build: 'echo "Build"',
        },
      };
      await fs.writeFile(
        path.join(TEST_PROJECT_PATH, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );

      const result = await validator.runLint();

      // Should succeed (lint is optional)
      expect(result.success).toBe(true);
      expect(result.stdout).toContain('No lint script');
    });
  });

  describe('validateTask', () => {
    it('should validate task with all checks', async () => {
      const metadata: TaskMetadata = {
        test_command: 'npm test',
        build_command: 'npm run build',
        lint_command: 'npm run lint',
      };

      const result = await validator.validateTask(metadata);

      expect(result.passed).toBe(true);
      expect(result.results.test).toBeDefined();
      expect(result.results.build).toBeDefined();
      expect(result.results.lint).toBeDefined();
      expect(result.totalDuration).toBeGreaterThan(0);
    });

    it('should skip optional commands if metadata missing', async () => {
      const metadata: TaskMetadata = {
        test_command: 'npm test',
        // No build or lint
      };

      const result = await validator.validateTask(metadata);

      expect(result.passed).toBe(true);
      expect(result.results.test).toBeDefined();
      expect(result.results.build).toBeUndefined();
      expect(result.results.lint).toBeUndefined();
    });

    it('should fail if any required validation fails', async () => {
      // Create failing test script
      const packageJson = {
        name: 'test-project',
        version: '1.0.0',
        scripts: {
          test: 'exit 1',
          build: 'echo "Build"',
        },
      };
      await fs.writeFile(
        path.join(TEST_PROJECT_PATH, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );

      const metadata: TaskMetadata = {
        test_command: 'npm test',
        build_command: 'npm run build',
      };

      const result = await validator.validateTask(metadata);

      expect(result.passed).toBe(false);
      expect(result.results.test?.success).toBe(false);
    });

    it('should handle custom commands', async () => {
      const metadata: TaskMetadata = {
        test_command: 'echo "Custom test"',
        build_command: 'echo "Custom build"',
      };

      const result = await validator.validateTask(metadata);

      expect(result.passed).toBe(true);
      expect(result.results.test?.stdout).toContain('Custom test');
      expect(result.results.build?.stdout).toContain('Custom build');
    });
  });

  describe('getProjectInfo', () => {
    it('should return project information', async () => {
      const info = await validator.getProjectInfo();

      expect(info.projectPath).toBe(TEST_PROJECT_PATH);
      expect(info.hasPackageJson).toBe(true);
      expect(info.hasNodeModules).toBe(false); // No npm install yet
    });

    it('should detect missing package.json', async () => {
      // Delete package.json
      await fs.unlink(path.join(TEST_PROJECT_PATH, 'package.json'));

      const info = await validator.getProjectInfo();

      expect(info.hasPackageJson).toBe(false);
    });
  });

  describe('createValidator factory', () => {
    it('should create Validator instance', () => {
      const instance = createValidator(TEST_PROJECT_PATH);
      expect(instance).toBeInstanceOf(Validator);
    });

    it('should use custom timeout', () => {
      const instance = createValidator(TEST_PROJECT_PATH, 10000);
      expect(instance).toBeInstanceOf(Validator);
    });
  });
});

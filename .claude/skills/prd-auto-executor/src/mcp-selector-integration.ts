/**
 * MCP Selector Integration
 *
 * Intelligent Phase 0 framework selection based on task priority AND type.
 * Uses mcp-selector skill for dynamic recommendations.
 *
 * Version: 1.1.0
 * Decision Doc: .serena/memories/prd_auto_executor_intelligent_mcp_selection_decision_2025_11_18.md
 */

import type { Task, Phase0Framework, TaskType } from './types';

// ============================================================================
// MCP Selector Response (from mcp-selector skill)
// ============================================================================

interface MCPSelectorRecommendation {
  /** Recommended frameworks in priority order */
  frameworks: Phase0Framework[];

  /** Reasoning for each framework (framework name → reason) */
  reasoning: Record<string, string>;

  /** Estimated execution time in seconds */
  estimated_time: number;
}

// ============================================================================
// MCP Selector Integration
// ============================================================================

/**
 * Intelligent MCP framework selector
 *
 * Selects Phase 0 frameworks based on:
 * 1. Priority (easy → skip, core/medium/hard → analyze)
 * 2. Type (api_design → Systems/Decision, algorithm → Stochastic/Causal)
 *
 * Example:
 * ```typescript
 * const frameworks = await MCPSelectorIntegration.selectFrameworks(task);
 * // API Design (hard) → [Systems, Decision, Analogical, First Principles] (4개, 50초)
 * // Algorithm (hard) → [Stochastic, Causal, Metacognitive, Scientific] (4개, 55초)
 * ```
 */
export class MCPSelectorIntegration {
  /**
   * Select Phase 0 frameworks for a task
   *
   * Decision logic:
   * - Easy tasks: Skip Phase 0 (return [])
   * - Has task_type: Dynamic selection via mcp-selector skill
   * - No task_type: Fallback to priority-based selection
   *
   * @param task - Task to analyze
   * @returns Array of recommended frameworks (empty if easy task)
   */
  static async selectFrameworks(task: Task): Promise<Phase0Framework[]> {
    // Easy tasks: Skip Phase 0 (no analysis needed)
    if (task.priority === 'easy') {
      console.log(`⏭️  [Phase 0] Skipped for easy task: ${task.name}`);
      return [];
    }

    // Dynamic selection if task_type exists
    if (task.metadata?.task_type) {
      return await this.dynamicSelection(task);
    }

    // Fallback: Priority-based selection
    console.log(`⚠️  [Phase 0] No task_type specified, using priority-based fallback`);
    return this.fallbackSelection(task.priority);
  }

  /**
   * Dynamic selection using mcp-selector skill
   *
   * Calls mcp-selector skill with task context to get optimal framework recommendations.
   * Saves recommendation to task.metadata.phase0_config for reuse.
   *
   * @private
   */
  private static async dynamicSelection(task: Task): Promise<Phase0Framework[]> {
    const taskType = task.metadata?.task_type || 'general';
    console.log(`🧠 [MCP Selector] Analyzing task type: ${taskType}`);
    console.log(`   Priority: ${task.priority}`);
    console.log(`   Description: ${task.description.substring(0, 60)}...`);

    try {
      // Call mcp-selector skill
      const recommendation = await this.callMCPSelector({
        priority: task.priority,
        task_type: taskType,
        description: task.description,
        acceptance_criteria: task.metadata?.acceptance_criteria || []
      });

      // Save to task metadata for future reference
      task.metadata = {
        ...task.metadata,
        phase0_config: {
          frameworks: recommendation.frameworks,
          estimated_time: recommendation.estimated_time,
          reasoning: JSON.stringify(recommendation.reasoning, null, 2),
          task_type: taskType
        }
      };

      console.log(`✅ [MCP Selector] Recommended ${recommendation.frameworks.length} frameworks`);
      console.log(`   Frameworks: ${recommendation.frameworks.join(', ')}`);
      console.log(`   Estimated time: ${recommendation.estimated_time}s`);

      return recommendation.frameworks;
    } catch (error) {
      console.error(`❌ [MCP Selector] Error:`, error);
      console.log(`   Falling back to priority-based selection`);
      return this.fallbackSelection(task.priority);
    }
  }

  /**
   * Fallback: Priority-based framework selection
   *
   * Used when:
   * - task_type is not specified
   * - mcp-selector skill fails
   *
   * @private
   */
  private static fallbackSelection(priority: Task['priority']): Phase0Framework[] {
    const fallbackMap: Record<Task['priority'], Phase0Framework[]> = {
      easy: [],
      core: [
        'Sequential Thinking',
        'First Principles',
        'Systems Thinking',
        'Decision Framework'
      ],
      medium: [
        'Sequential Thinking',
        'First Principles',
        'Systems Thinking',
        'Decision Framework',
        'Metacognitive Monitoring',
        'Causal Analysis'
      ],
      hard: [
        'Sequential Thinking',
        'First Principles',
        'Systems Thinking',
        'Stochastic Analysis',
        'Decision Framework',
        'Metacognitive Monitoring'
      ]
    };

    return fallbackMap[priority];
  }

  /**
   * Call mcp-selector skill to get framework recommendations
   *
   * @private
   */
  private static async callMCPSelector(context: {
    priority: Task['priority'];
    task_type: TaskType;
    description: string;
    acceptance_criteria: string[];
  }): Promise<MCPSelectorRecommendation> {
    // Build prompt for mcp-selector skill (ready for future use)
    const prompt = this._buildMCPSelectorPrompt(context);

    // TODO: Actual implementation would call mcp-selector skill via Skill() interface
    // When mcp-selector skill is ready, uncomment:
    // const result = await Skill('mcp-selector', prompt);
    // return parseMCPSelectorResponse(result);

    // For now, log prompt (for debugging) and return type-based static mapping
    if (process.env['DEBUG_MCP_SELECTOR']) {
      console.log('[MCP Selector] Generated prompt (static mode):', prompt.substring(0, 100) + '...');
    }

    return this.getStaticRecommendation(context.task_type, context.priority);
  }

  /**
   * Build prompt for mcp-selector skill
   *
   * @private
   */
  private static _buildMCPSelectorPrompt(context: {
    priority: Task['priority'];
    task_type: TaskType;
    description: string;
    acceptance_criteria: string[];
  }): string {
    return `
mcp-selector skill을 사용해서 최적 Phase 0 프레임워크를 추천해주세요:

**작업 정보**:
- 복잡도: ${context.priority}
- 유형: ${context.task_type}
- 설명: ${context.description}
- 기준: ${context.acceptance_criteria.join(', ') || '없음'}

**필요한 정보**:
1. 추천 Phase 0 프레임워크 (우선순위순, 3-6개)
2. 각 프레임워크 선택 이유 (1문장)
3. 예상 소요 시간 (초)

**출력 형식**:
\`\`\`json
{
  "frameworks": ["Systems Thinking", "Decision Framework", "Analogical Reasoning"],
  "reasoning": {
    "Systems Thinking": "API 전체 아키텍처 파악",
    "Decision Framework": "설계 대안 평가",
    "Analogical Reasoning": "검증된 API 패턴 참조"
  },
  "estimated_time": 50
}
\`\`\`
`.trim();
  }

  /**
   * Get static recommendation based on task type
   *
   * This is a temporary implementation until mcp-selector skill integration is complete.
   * Based on the decision document's task type mapping table.
   *
   * @private
   */
  private static getStaticRecommendation(
    taskType: TaskType,
    priority: Task['priority']
  ): MCPSelectorRecommendation {
    // Task type → Framework mapping (from decision document)
    const typeMapping: Record<TaskType, { frameworks: Phase0Framework[]; time: number }> = {
      api_design: {
        frameworks: ['Systems Thinking', 'Decision Framework', 'Analogical Reasoning', 'First Principles'],
        time: 50
      },
      algorithm_optimization: {
        frameworks: ['Stochastic Analysis', 'Causal Analysis', 'Metacognitive Monitoring', 'Scientific Method'],
        time: 55
      },
      ui_ux: {
        frameworks: ['Visual Reasoning', 'Collaborative Reasoning', 'Analogical Reasoning', 'Decision Framework'],
        time: 45
      },
      debugging: {
        frameworks: ['Causal Analysis', 'Scientific Method', 'Metacognitive Monitoring', 'Sequential Thinking'],
        time: 50
      },
      security: {
        frameworks: ['Systems Thinking', 'Structured Argumentation', 'Decision Framework', 'Stochastic Analysis'],
        time: 60
      },
      refactoring: {
        frameworks: ['First Principles', 'Systems Thinking', 'Causal Analysis', 'Metacognitive Monitoring'],
        time: 50
      },
      testing: {
        frameworks: ['Scientific Method', 'Decision Framework', 'Metacognitive Monitoring', 'Stochastic Analysis'],
        time: 45
      },
      documentation: {
        frameworks: ['Collaborative Reasoning', 'Sequential Thinking', 'Decision Framework', 'Analogical Reasoning'],
        time: 35
      },
      data_processing: {
        frameworks: ['Systems Thinking', 'Causal Analysis', 'Stochastic Analysis', 'Decision Framework'],
        time: 55
      },
      integration: {
        frameworks: ['Systems Thinking', 'Decision Framework', 'Analogical Reasoning', 'Scientific Method'],
        time: 50
      },
      general: {
        frameworks: ['Sequential Thinking', 'First Principles', 'Decision Framework', 'Metacognitive Monitoring'],
        time: 40
      }
    };

    const mapping = typeMapping[taskType] || typeMapping.general;

    // Adjust framework count based on priority
    const frameworkCount = priority === 'hard' ? 4 : priority === 'medium' ? 3 : 2;
    const selectedFrameworks = mapping.frameworks.slice(0, frameworkCount);

    // Generate reasoning
    const reasoning: Record<string, string> = {};
    selectedFrameworks.forEach((framework) => {
      reasoning[framework] = `Optimal for ${taskType} tasks (priority: ${priority})`;
    });

    return {
      frameworks: selectedFrameworks as Phase0Framework[],
      reasoning,
      estimated_time: mapping.time
    };
  }
}

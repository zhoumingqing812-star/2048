// AI相关类型定义
import { Direction, GameState } from './game';

export type AIAlgorithm = 'random' | 'greedy' | 'minimax' | 'alphabeta' | 'mcts';

export interface AIDecision {
  direction: Direction;
  confidence: number;
  evaluationScore: number;
  thinkingTime: number;
  details: {
    searchedNodes?: number;
    prunedNodes?: number;
    depth?: number;
    simulations?: number;
    alternativeScores?: Record<Direction, number>;
  };
}

export interface AIConfig {
  searchDepth?: number;
  mctsIterations?: number;
  enablePruning?: boolean;
  timeLimit?: number;
}

export interface TreeNode {
  state: number[][];
  action: Direction | null;
  score: number;
  children: TreeNode[];
  isPruned: boolean;
  depth: number;
}

export interface AIStrategy {
  name: string;
  description: string;
  getBestMove(state: GameState, config?: AIConfig): Promise<AIDecision>;
  evaluate(board: number[][]): number;
}

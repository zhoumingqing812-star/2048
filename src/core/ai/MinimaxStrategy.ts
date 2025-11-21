// Minimax算法
import { AIStrategy, AIDecision, AIConfig } from '../../types/ai';
import { GameState, Direction } from '../../types/game';
import { getAvailableMoves, moveBoard, getEmptyCells } from '../game/BoardUtils';
import { evaluateBoard } from './Evaluator';
import { DEFAULT_AI_CONFIG } from '../../utils/constants';
import { deepClone } from '../../utils/helpers';

export class MinimaxStrategy implements AIStrategy {
  name = 'Minimax算法';
  description = '使用博弈树搜索，考虑未来几步的最优移动';

  private searchedNodes = 0;

  async getBestMove(state: GameState, config?: AIConfig): Promise<AIDecision> {
    const startTime = performance.now();
    const depth = config?.searchDepth ?? DEFAULT_AI_CONFIG.searchDepth;
    this.searchedNodes = 0;

    const availableMoves = getAvailableMoves(state.board);
    if (availableMoves.length === 0) {
      throw new Error('No available moves');
    }

    let bestMove: Direction = availableMoves[0];
    let bestScore = -Infinity;
    const alternativeScores: Record<Direction, number> = {} as Record<Direction, number>;

    for (const move of availableMoves) {
      const result = moveBoard(state.board, move);
      const score = this.minimize(result.board, depth - 1);
      alternativeScores[move] = Math.round(score);

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    const thinkingTime = performance.now() - startTime;

    return {
      direction: bestMove,
      confidence: 0.8,
      evaluationScore: Math.round(bestScore),
      thinkingTime,
      details: {
        searchedNodes: this.searchedNodes,
        depth,
        alternativeScores,
      },
    };
  }

  private maximize(board: number[][], depth: number): number {
    this.searchedNodes++;

    if (depth === 0) {
      return evaluateBoard(board);
    }

    const availableMoves = getAvailableMoves(board);
    if (availableMoves.length === 0) {
      return evaluateBoard(board);
    }

    let maxScore = -Infinity;
    for (const move of availableMoves) {
      const result = moveBoard(board, move);
      const score = this.minimize(result.board, depth - 1);
      maxScore = Math.max(maxScore, score);
    }

    return maxScore;
  }

  private minimize(board: number[][], depth: number): number {
    this.searchedNodes++;

    if (depth === 0) {
      return evaluateBoard(board);
    }

    const emptyCells = getEmptyCells(board);
    if (emptyCells.length === 0) {
      return evaluateBoard(board);
    }

    let minScore = Infinity;

    // 只考虑部分空格位置（优化性能）
    const cellsToCheck = emptyCells.slice(0, Math.min(4, emptyCells.length));

    for (const cell of cellsToCheck) {
      for (const value of [2, 4]) {
        const newBoard = deepClone(board);
        newBoard[cell.row][cell.col] = value;
        const score = this.maximize(newBoard, depth - 1);
        minScore = Math.min(minScore, score);
      }
    }

    return minScore;
  }

  evaluate(board: number[][]): number {
    return evaluateBoard(board);
  }
}

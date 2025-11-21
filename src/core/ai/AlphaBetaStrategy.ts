// Alpha-Beta剪枝算法
import { AIStrategy, AIDecision, AIConfig } from '../../types/ai';
import { GameState, Direction } from '../../types/game';
import { getAvailableMoves, moveBoard, getEmptyCells } from '../game/BoardUtils';
import { evaluateBoard } from './Evaluator';
import { DEFAULT_AI_CONFIG } from '../../utils/constants';
import { deepClone } from '../../utils/helpers';

export class AlphaBetaStrategy implements AIStrategy {
  name = 'Alpha-Beta剪枝';
  description = '在Minimax基础上使用Alpha-Beta剪枝优化搜索效率';

  private searchedNodes = 0;
  private prunedNodes = 0;

  async getBestMove(state: GameState, config?: AIConfig): Promise<AIDecision> {
    const startTime = performance.now();
    const depth = config?.searchDepth ?? DEFAULT_AI_CONFIG.searchDepth;
    this.searchedNodes = 0;
    this.prunedNodes = 0;

    const availableMoves = getAvailableMoves(state.board);
    if (availableMoves.length === 0) {
      throw new Error('No available moves');
    }

    let bestMove: Direction = availableMoves[0];
    let bestScore = -Infinity;
    let alpha = -Infinity;
    const beta = Infinity;
    const alternativeScores: Record<Direction, number> = {} as Record<Direction, number>;

    for (const move of availableMoves) {
      const result = moveBoard(state.board, move);
      const score = this.minimize(result.board, depth - 1, alpha, beta);
      alternativeScores[move] = Math.round(score);

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
      alpha = Math.max(alpha, bestScore);
    }

    const thinkingTime = performance.now() - startTime;

    return {
      direction: bestMove,
      confidence: 0.85,
      evaluationScore: Math.round(bestScore),
      thinkingTime,
      details: {
        searchedNodes: this.searchedNodes,
        prunedNodes: this.prunedNodes,
        depth,
        alternativeScores,
      },
    };
  }

  private maximize(board: number[][], depth: number, alpha: number, beta: number): number {
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
      const score = this.minimize(result.board, depth - 1, alpha, beta);
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, maxScore);

      if (beta <= alpha) {
        this.prunedNodes++;
        break; // Beta剪枝
      }
    }

    return maxScore;
  }

  private minimize(board: number[][], depth: number, alpha: number, beta: number): number {
    this.searchedNodes++;

    if (depth === 0) {
      return evaluateBoard(board);
    }

    const emptyCells = getEmptyCells(board);
    if (emptyCells.length === 0) {
      return evaluateBoard(board);
    }

    let minScore = Infinity;
    const cellsToCheck = emptyCells.slice(0, Math.min(4, emptyCells.length));

    for (const cell of cellsToCheck) {
      for (const value of [2, 4]) {
        const newBoard = deepClone(board);
        newBoard[cell.row][cell.col] = value;
        const score = this.maximize(newBoard, depth - 1, alpha, beta);
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, minScore);

        if (beta <= alpha) {
          this.prunedNodes++;
          break; // Alpha剪枝
        }
      }
      if (beta <= alpha) break;
    }

    return minScore;
  }

  evaluate(board: number[][]): number {
    return evaluateBoard(board);
  }
}

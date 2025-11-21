// 贪心算法
import { AIStrategy, AIDecision, AIConfig } from '../../types/ai';
import { GameState, Direction } from '../../types/game';
import { getAvailableMoves, moveBoard } from '../game/BoardUtils';
import { evaluateBoard } from './Evaluator';

export class GreedyStrategy implements AIStrategy {
  name = '贪心算法';
  description = '评估每个可能移动的即时收益，选择能获得最高分数的移动';

  async getBestMove(state: GameState, _config?: AIConfig): Promise<AIDecision> {
    const startTime = performance.now();
    const availableMoves = getAvailableMoves(state.board);

    if (availableMoves.length === 0) {
      throw new Error('No available moves');
    }

    let bestMove: Direction = availableMoves[0];
    let bestScore = -Infinity;
    const alternativeScores: Record<Direction, number> = {} as Record<Direction, number>;

    for (const move of availableMoves) {
      const result = moveBoard(state.board, move);
      const score = result.score + evaluateBoard(result.board);
      alternativeScores[move] = Math.round(score);

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    const thinkingTime = performance.now() - startTime;

    return {
      direction: bestMove,
      confidence: bestScore / (bestScore + 100),
      evaluationScore: Math.round(bestScore),
      thinkingTime,
      details: {
        alternativeScores,
      },
    };
  }

  evaluate(board: number[][]): number {
    return evaluateBoard(board);
  }
}

// 随机算法
import { AIStrategy, AIDecision, AIConfig } from '../../types/ai';
import { GameState, Direction } from '../../types/game';
import { getAvailableMoves } from '../game/BoardUtils';
import { getRandomInt } from '../../utils/helpers';

export class RandomStrategy implements AIStrategy {
  name = '随机算法';
  description = '从所有合法移动中随机选择一个方向';

  async getBestMove(state: GameState, _config?: AIConfig): Promise<AIDecision> {
    const startTime = performance.now();
    const availableMoves = getAvailableMoves(state.board);

    if (availableMoves.length === 0) {
      throw new Error('No available moves');
    }

    const direction = availableMoves[getRandomInt(0, availableMoves.length - 1)];
    const thinkingTime = performance.now() - startTime;

    return {
      direction,
      confidence: 1 / availableMoves.length,
      evaluationScore: 0,
      thinkingTime,
      details: {
        alternativeScores: availableMoves.reduce((acc, move) => {
          acc[move] = 0;
          return acc;
        }, {} as Record<Direction, number>),
      },
    };
  }

  evaluate(_board: number[][]): number {
    return 0;
  }
}

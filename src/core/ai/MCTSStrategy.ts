// 蒙特卡洛树搜索 (MCTS)
import { AIStrategy, AIDecision, AIConfig } from '../../types/ai';
import { GameState, Direction } from '../../types/game';
import { getAvailableMoves, moveBoard, isGameOver } from '../game/BoardUtils';
import { evaluateBoard } from './Evaluator';
import { DEFAULT_AI_CONFIG } from '../../utils/constants';
import { getRandomInt } from '../../utils/helpers';

interface MCTSNode {
  visits: number;
  wins: number;
  children: Map<Direction, MCTSNode>;
}

export class MCTSStrategy implements AIStrategy {
  name = 'MCTS蒙特卡洛';
  description = '使用蒙特卡洛树搜索，通过随机模拟评估移动质量';

  async getBestMove(state: GameState, config?: AIConfig): Promise<AIDecision> {
    const startTime = performance.now();
    const iterations = config?.mctsIterations ?? DEFAULT_AI_CONFIG.mctsIterations;

    const availableMoves = getAvailableMoves(state.board);
    if (availableMoves.length === 0) {
      throw new Error('No available moves');
    }

    const rootNode: MCTSNode = {
      visits: 0,
      wins: 0,
      children: new Map(),
    };

    // 初始化子节点
    for (const move of availableMoves) {
      rootNode.children.set(move, {
        visits: 0,
        wins: 0,
        children: new Map(),
      });
    }

    // 执行MCTS迭代
    for (let i = 0; i < iterations; i++) {
      this.runSimulation(state, rootNode);
    }

    // 选择最佳移动
    let bestMove: Direction = availableMoves[0];
    let bestWinRate = -1;
    const alternativeScores: Record<Direction, number> = {} as Record<Direction, number>;

    for (const [move, node] of rootNode.children.entries()) {
      const winRate = node.visits > 0 ? node.wins / node.visits : 0;
      alternativeScores[move] = Math.round(winRate * 100);

      if (node.visits > 0 && winRate > bestWinRate) {
        bestWinRate = winRate;
        bestMove = move;
      }
    }

    const thinkingTime = performance.now() - startTime;

    return {
      direction: bestMove,
      confidence: bestWinRate,
      evaluationScore: Math.round(bestWinRate * 100),
      thinkingTime,
      details: {
        simulations: iterations,
        alternativeScores,
      },
    };
  }

  private runSimulation(state: GameState, node: MCTSNode): number {
    // 选择阶段：选择最有希望的移动
    const availableMoves = getAvailableMoves(state.board);
    if (availableMoves.length === 0) {
      return 0;
    }

    // UCB1选择
    let bestMove: Direction = availableMoves[0];
    let bestUCB = -Infinity;

    for (const move of availableMoves) {
      const childNode = node.children.get(move);
      if (!childNode) continue;

      const ucb = this.calculateUCB(childNode, node.visits);
      if (ucb > bestUCB) {
        bestUCB = ucb;
        bestMove = move;
      }
    }

    // 模拟阶段：随机游戏直到结束
    const moveResult = moveBoard(state.board, bestMove);
    const simulationScore = this.simulate({
      ...state,
      board: moveResult.board,
      score: state.score + moveResult.score,
    });

    // 回传阶段：更新节点统计
    const childNode = node.children.get(bestMove)!;
    childNode.visits++;
    childNode.wins += simulationScore;
    node.visits++;
    node.wins += simulationScore;

    return simulationScore;
  }

  private calculateUCB(node: MCTSNode, parentVisits: number): number {
    if (node.visits === 0) return Infinity;
    const exploitation = node.wins / node.visits;
    const exploration = Math.sqrt((2 * Math.log(parentVisits)) / node.visits);
    return exploitation + exploration;
  }

  private simulate(state: GameState): number {
    let currentState = { ...state };
    let depth = 0;
    const maxDepth = 20;

    while (!isGameOver(currentState.board) && depth < maxDepth) {
      const moves = getAvailableMoves(currentState.board);
      if (moves.length === 0) break;

      const randomMove = moves[getRandomInt(0, moves.length - 1)];
      const result = moveBoard(currentState.board, randomMove);
      currentState = {
        ...currentState,
        board: result.board,
        score: currentState.score + result.score,
      };
      depth++;
    }

    // 标准化分数到0-1范围
    const finalEval = evaluateBoard(currentState.board);
    return Math.min(1, finalEval / 100000);
  }

  evaluate(board: number[][]): number {
    return evaluateBoard(board);
  }
}

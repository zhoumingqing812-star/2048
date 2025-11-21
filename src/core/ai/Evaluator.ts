// AI评估函数
import { GRID_SIZE, EVALUATION_WEIGHTS } from '../../utils/constants';
import { getEmptyCells, getMaxTile } from '../game/BoardUtils';

// 评估棋盘状态
export const evaluateBoard = (board: number[][]): number => {
  const emptyTilesScore = getEmptyCells(board).length * EVALUATION_WEIGHTS.emptyTiles;
  const maxTileScore = getMaxTile(board) * EVALUATION_WEIGHTS.maxTile;
  const monotonicityScore = calculateMonotonicity(board) * EVALUATION_WEIGHTS.monotonicity;
  const smoothnessScore = calculateSmoothness(board) * EVALUATION_WEIGHTS.smoothness;

  return emptyTilesScore + maxTileScore + monotonicityScore + smoothnessScore;
};

// 计算单调性（数字是否递减排列）
const calculateMonotonicity = (board: number[][]): number => {
  let monotonicity = 0;

  // 检查行
  for (let row = 0; row < GRID_SIZE; row++) {
    let increasing = 0;
    let decreasing = 0;
    for (let col = 0; col < GRID_SIZE - 1; col++) {
      if (board[row][col] > board[row][col + 1]) {
        decreasing += board[row][col] - board[row][col + 1];
      } else {
        increasing += board[row][col + 1] - board[row][col];
      }
    }
    monotonicity += Math.max(increasing, decreasing);
  }

  // 检查列
  for (let col = 0; col < GRID_SIZE; col++) {
    let increasing = 0;
    let decreasing = 0;
    for (let row = 0; row < GRID_SIZE - 1; row++) {
      if (board[row][col] > board[row + 1][col]) {
        decreasing += board[row][col] - board[row + 1][col];
      } else {
        increasing += board[row + 1][col] - board[row][col];
      }
    }
    monotonicity += Math.max(increasing, decreasing);
  }

  return monotonicity;
};

// 计算平滑度（相邻方块数值接近程度）
const calculateSmoothness = (board: number[][]): number => {
  let smoothness = 0;

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] !== 0) {
        const value = Math.log2(board[row][col]);

        // 检查右侧
        if (col < GRID_SIZE - 1 && board[row][col + 1] !== 0) {
          smoothness -= Math.abs(value - Math.log2(board[row][col + 1]));
        }

        // 检查下侧
        if (row < GRID_SIZE - 1 && board[row + 1][col] !== 0) {
          smoothness -= Math.abs(value - Math.log2(board[row + 1][col]));
        }
      }
    }
  }

  return smoothness;
};

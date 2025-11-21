// 棋盘工具函数
import { Direction, Position, MoveResult } from '../../types/game';
import { GRID_SIZE } from '../../utils/constants';
import { deepClone, getRandomInt } from '../../utils/helpers';

// 创建空棋盘
export const createEmptyBoard = (): number[][] => {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
};

// 获取空格位置
export const getEmptyCells = (board: number[][]): Position[] => {
  const emptyCells: Position[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] === 0) {
        emptyCells.push({ row, col });
      }
    }
  }
  return emptyCells;
};

// 添加随机方块
export const addRandomTile = (board: number[][]): number[][] => {
  const newBoard = deepClone(board);
  const emptyCells = getEmptyCells(newBoard);

  if (emptyCells.length === 0) return newBoard;

  const randomCell = emptyCells[getRandomInt(0, emptyCells.length - 1)];
  const value = Math.random() < 0.9 ? 2 : 4;
  newBoard[randomCell.row][randomCell.col] = value;

  return newBoard;
};

// 旋转棋盘（用于简化移动逻辑）
export const rotateBoard = (board: number[][], times: number): number[][] => {
  let rotated = deepClone(board);
  for (let i = 0; i < times; i++) {
    rotated = rotated[0].map((_, index) =>
      rotated.map(row => row[index]).reverse()
    );
  }
  return rotated;
};

// 向左移动一行
const moveRowLeft = (row: number[]): { row: number[]; score: number; moved: boolean } => {
  let newRow = row.filter(cell => cell !== 0);
  let score = 0;
  let moved = false;

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      score += newRow[i];
      newRow.splice(i + 1, 1);
      moved = true;
    }
  }

  while (newRow.length < GRID_SIZE) {
    newRow.push(0);
  }

  if (JSON.stringify(row) !== JSON.stringify(newRow)) {
    moved = true;
  }

  return { row: newRow, score, moved };
};

// 移动棋盘
export const moveBoard = (board: number[][], direction: Direction): MoveResult => {
  let workBoard = deepClone(board);
  let totalScore = 0;
  let moved = false;

  // 根据方向旋转棋盘，统一按左移处理
  if (direction === 'up') workBoard = rotateBoard(workBoard, 3);
  else if (direction === 'right') workBoard = rotateBoard(workBoard, 2);
  else if (direction === 'down') workBoard = rotateBoard(workBoard, 1);

  // 对每一行执行左移
  for (let i = 0; i < GRID_SIZE; i++) {
    const result = moveRowLeft(workBoard[i]);
    workBoard[i] = result.row;
    totalScore += result.score;
    if (result.moved) moved = true;
  }

  // 旋转回原来的方向
  if (direction === 'up') workBoard = rotateBoard(workBoard, 1);
  else if (direction === 'right') workBoard = rotateBoard(workBoard, 2);
  else if (direction === 'down') workBoard = rotateBoard(workBoard, 3);

  return { board: workBoard, score: totalScore, moved };
};

// 检查是否可以移动
export const canMove = (board: number[][], direction: Direction): boolean => {
  const result = moveBoard(board, direction);
  return result.moved;
};

// 获取所有可能的移动方向
export const getAvailableMoves = (board: number[][]): Direction[] => {
  const directions: Direction[] = ['up', 'down', 'left', 'right'];
  return directions.filter(dir => canMove(board, dir));
};

// 检查游戏是否结束
export const isGameOver = (board: number[][]): boolean => {
  return getAvailableMoves(board).length === 0;
};

// 检查是否获胜
export const hasWon = (board: number[][]): boolean => {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] === 2048) return true;
    }
  }
  return false;
};

// 获取最大方块值
export const getMaxTile = (board: number[][]): number => {
  let max = 0;
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] > max) max = board[row][col];
    }
  }
  return max;
};

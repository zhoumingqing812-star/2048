// 游戏逻辑
import { GameState, Direction, GameStatus } from '../../types/game';
import { storage } from '../../utils/storage';
import {
  createEmptyBoard,
  addRandomTile,
  moveBoard,
  isGameOver,
  hasWon
} from './BoardUtils';
import { INITIAL_TILES } from '../../utils/constants';

// 初始化游戏状态
export const initializeGame = (): GameState => {
  let board = createEmptyBoard();

  // 添加初始方块
  for (let i = 0; i < INITIAL_TILES; i++) {
    board = addRandomTile(board);
  }

  return {
    board,
    score: 0,
    bestScore: storage.getBestScore(),
    moves: 0,
    status: 'playing',
  };
};

// 执行移动
export const executeMove = (state: GameState, direction: Direction): GameState => {
  if (state.status !== 'playing') return state;

  const moveResult = moveBoard(state.board, direction);

  if (!moveResult.moved) return state;

  // 添加新方块
  const newBoard = addRandomTile(moveResult.board);
  const newScore = state.score + moveResult.score;

  // 更新最高分
  let newBestScore = state.bestScore;
  if (newScore > newBestScore) {
    newBestScore = newScore;
    storage.saveBestScore(newBestScore);
  }

  // 检查游戏状态
  let newStatus: GameStatus = 'playing';
  if (hasWon(newBoard) && state.status === 'playing') {
    newStatus = 'win';
  } else if (isGameOver(newBoard)) {
    newStatus = 'gameover';
  }

  return {
    board: newBoard,
    score: newScore,
    bestScore: newBestScore,
    moves: state.moves + 1,
    status: newStatus,
  };
};

// 重置游戏
export const resetGame = (currentBestScore: number): GameState => {
  const newState = initializeGame();
  return {
    ...newState,
    bestScore: currentBestScore,
  };
};

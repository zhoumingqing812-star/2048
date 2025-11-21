// 游戏相关类型定义
export type Direction = 'up' | 'down' | 'left' | 'right';
export type GameStatus = 'playing' | 'win' | 'gameover';
export type GameMode = 'manual' | 'ai';

export interface GameState {
  board: number[][];
  score: number;
  bestScore: number;
  moves: number;
  status: GameStatus;
}

export interface Position {
  row: number;
  col: number;
}

export interface MoveResult {
  board: number[][];
  score: number;
  moved: boolean;
}

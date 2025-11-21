// 游戏常量定义
export const GRID_SIZE = 4;
export const INITIAL_TILES = 2;
export const WIN_TILE = 2048;

// AI速度设置 (ms/step)
export const AI_SPEEDS = {
  slow: 1000,
  normal: 500,
  fast: 100,
  instant: 0,
} as const;

// 方块颜色配置
export const TILE_COLORS: Record<number, { bg: string; color: string }> = {
  2: { bg: '#eee4da', color: '#776e65' },
  4: { bg: '#ede0c8', color: '#776e65' },
  8: { bg: '#f2b179', color: '#f9f6f2' },
  16: { bg: '#f59563', color: '#f9f6f2' },
  32: { bg: '#f67c5f', color: '#f9f6f2' },
  64: { bg: '#f65e3b', color: '#f9f6f2' },
  128: { bg: '#edcf72', color: '#f9f6f2' },
  256: { bg: '#edcc61', color: '#f9f6f2' },
  512: { bg: '#edc850', color: '#f9f6f2' },
  1024: { bg: '#edc53f', color: '#f9f6f2' },
  2048: { bg: '#edc22e', color: '#f9f6f2' },
};

// 评估函数权重
export const EVALUATION_WEIGHTS = {
  emptyTiles: 2.7,
  maxTile: 1.0,
  monotonicity: 1.0,
  smoothness: 0.1,
};

// 算法配置
export const DEFAULT_AI_CONFIG = {
  searchDepth: 3,
  mctsIterations: 500,
  enablePruning: true,
  timeLimit: 1000,
};

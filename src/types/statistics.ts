// 统计相关类型定义
export interface GameStatistics {
  averageDecisionTime: number;
  totalSearchedNodes: number;
  averageSearchDepth: number;
  pruningEfficiency: number;
  gameTime: number;
  maxTile: number;
}

export interface MultiGameStats {
  averageScore: number;
  maxScore: number;
  successRate: number;
  averageMoves: number;
  averageTime: number;
  averageDecisionTime: number;
}

import React from 'react';
import { formatNumber } from '../../utils/helpers';

interface ScoreBoardProps {
  score: number;
  bestScore: number;
  moves: number;
  maxTile: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  bestScore,
  moves,
  maxTile,
}) => {
  return (
    <div className="game-stats">
      <div className="stat-card">
        <div className="stat-label">当前分数</div>
        <div className="stat-value">{formatNumber(score)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">最高分</div>
        <div className="stat-value">{formatNumber(bestScore)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">当前步数</div>
        <div className="stat-value">{moves}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">最大方块</div>
        <div className="stat-value">{maxTile}</div>
      </div>
    </div>
  );
};

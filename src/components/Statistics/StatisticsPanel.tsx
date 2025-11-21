import React from 'react';
import { GameStatistics } from '../../types/statistics';
import { formatTime } from '../../utils/helpers';

interface StatisticsPanelProps {
  statistics: GameStatistics;
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ statistics }) => {
  const pruningPercentage = statistics.totalSearchedNodes > 0
    ? ((statistics.pruningEfficiency / statistics.totalSearchedNodes) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="panel-section">
      <div className="panel-title">性能统计</div>
      <div className="decision-info">
        <div className="info-row">
          <span className="info-label">平均决策时间:</span>
          <span className="info-value">{Math.round(statistics.averageDecisionTime)}ms</span>
        </div>
        <div className="info-row">
          <span className="info-label">搜索节点数:</span>
          <span className="info-value">{statistics.totalSearchedNodes}</span>
        </div>
        {statistics.pruningEfficiency > 0 && (
          <div className="info-row">
            <span className="info-label">剪枝节点数:</span>
            <span className="info-value">
              {statistics.pruningEfficiency} ({pruningPercentage}%)
            </span>
          </div>
        )}
        <div className="info-row">
          <span className="info-label">游戏用时:</span>
          <span className="info-value">{formatTime(statistics.gameTime)}</span>
        </div>
      </div>
    </div>
  );
};

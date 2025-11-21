import React from 'react';
import { AIDecision } from '../../types/ai';
import { Direction } from '../../types/game';

interface DecisionPanelProps {
  decision: AIDecision | null;
  algorithmName: string;
  isThinking: boolean;
}

const DIRECTION_ICONS: Record<Direction, string> = {
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
};

const DIRECTION_LABELS: Record<Direction, string> = {
  up: '向上',
  down: '向下',
  left: '向左',
  right: '向右',
};

export const DecisionPanel: React.FC<DecisionPanelProps> = ({
  decision,
  algorithmName,
  isThinking,
}) => {
  if (!decision) {
    return (
      <div className="thinking-panel">
        <h3>📋 当前决策信息</h3>
        <div className="placeholder-text">AI尚未开始决策...</div>
      </div>
    );
  }

  const directions: Direction[] = ['up', 'right', 'down', 'left'];
  const alternativeScores: Record<Direction, number> = decision.details.alternativeScores || {} as Record<Direction, number>;

  return (
    <div className="thinking-panel">
      <h3>📋 当前决策信息</h3>
      <div className="decision-info">
        <div className="info-row">
          <span className="info-label">使用算法:</span>
          <span className="info-value" style={{ color: '#667eea' }}>
            {algorithmName}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">决策状态:</span>
          <span className="info-value" style={{ color: isThinking ? '#f5576c' : '#11998e' }}>
            {isThinking ? '⏳ 思考中...' : '✓ 思考完成'}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">决策耗时:</span>
          <span className="info-value">{Math.round(decision.thinkingTime)}ms</span>
        </div>
        <div className="info-row">
          <span className="info-label">最佳移动:</span>
          <span className="info-value" style={{ fontSize: '1.5rem' }}>
            {DIRECTION_ICONS[decision.direction]}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">评估得分:</span>
          <span className="info-value" style={{ color: '#f5576c' }}>
            {decision.evaluationScore > 0 ? '+' : ''}{decision.evaluationScore}分
          </span>
        </div>
      </div>

      <h3 style={{ marginTop: '25px' }}>🎯 方向评估</h3>
      <div className="direction-eval">
        {directions.map((dir) => {
          const score = alternativeScores[dir];
          const isBest = dir === decision.direction;
          return (
            <div key={dir} className={`direction-card ${isBest ? 'best' : ''}`}>
              <div className="direction-icon">{DIRECTION_ICONS[dir]}</div>
              <div className="direction-score">
                {score !== undefined ? `${score > 0 ? '+' : ''}${score}` : 'N/A'}
                {isBest ? ' ⭐' : ''}
              </div>
              <div className="direction-label">
                {DIRECTION_LABELS[dir]}
                {isBest ? ' (最优)' : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

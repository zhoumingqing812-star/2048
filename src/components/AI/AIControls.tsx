import React from 'react';

interface AIControlsProps {
  isAIRunning: boolean;
  isAIPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset: () => void;
  disabled: boolean;
}

export const AIControls: React.FC<AIControlsProps> = ({
  isAIRunning,
  isAIPaused,
  onStart,
  onPause,
  onStop,
  onReset,
  disabled,
}) => {
  return (
    <div className="panel-section">
      <div className="panel-title">游戏控制</div>
      <div className="action-buttons">
        {!isAIRunning ? (
          <button className="action-btn btn-success" onClick={onStart} disabled={disabled}>
            ▶ 开始AI
          </button>
        ) : (
          <button className="action-btn btn-warning" onClick={onPause}>
            {isAIPaused ? '▶ 继续' : '⏸ 暂停'}
          </button>
        )}
        <button
          className="action-btn btn-secondary"
          onClick={onStop}
          disabled={!isAIRunning}
        >
          ⏹ 停止
        </button>
        <button className="action-btn btn-secondary" onClick={onReset}>
          🔄 重新开始
        </button>
        <button className="action-btn btn-primary btn-full" disabled>
          📊 运行多局测试
        </button>
      </div>
    </div>
  );
};

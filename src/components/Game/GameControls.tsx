import React from 'react';

interface GameControlsProps {
  onNewGame: () => void;
  onPause?: () => void;
  onStop?: () => void;
  isAIMode: boolean;
  isAIRunning: boolean;
}

export const GameControls: React.FC<GameControlsProps> = () => {
  return (
    <div className="game-hint">
      <strong>手动模式：</strong> 使用方向键 ↑↓←→ 或滑动屏幕进行游戏
      <br />
      <strong>AI模式：</strong> 选择AI算法后，点击"开始AI"按钮观察AI自动游戏
    </div>
  );
};

import React from 'react';

interface SpeedControlProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const SPEED_LABELS = ['慢速\n(1000ms)', '正常\n(500ms)', '快速\n(100ms)', '极速\n(无延迟)'];
const SPEED_VALUES = [1000, 500, 100, 0];

export const SpeedControl: React.FC<SpeedControlProps> = ({ speed, onSpeedChange }) => {
  const speedIndex = SPEED_VALUES.indexOf(speed);
  const currentLabel = SPEED_LABELS[speedIndex] || SPEED_LABELS[1];

  return (
    <div className="panel-section">
      <div className="panel-title">执行速度</div>
      <div className="speed-control">
        <input
          type="range"
          className="speed-slider"
          min={0}
          max={3}
          value={speedIndex}
          step={1}
          onChange={(e) => onSpeedChange(SPEED_VALUES[parseInt(e.target.value)])}
        />
        <div className="speed-labels">
          {SPEED_LABELS.map((label, idx) => (
            <span key={idx} style={{ whiteSpace: 'pre-line', fontSize: '0.75rem' }}>
              {label}
            </span>
          ))}
        </div>
        <div className="speed-value">
          当前速度：{currentLabel.split('\n')[0]} ({speed}ms/步)
        </div>
      </div>
    </div>
  );
};

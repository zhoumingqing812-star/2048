import React from 'react';
import { AIConfig } from '../../types/ai';

interface AIConfigPanelProps {
  config: AIConfig;
  onConfigChange: (config: AIConfig) => void;
  showVisualization: boolean;
  onVisualizationToggle: (show: boolean) => void;
}

export const AIConfigPanel: React.FC<AIConfigPanelProps> = ({
  config,
  onConfigChange,
  showVisualization,
  onVisualizationToggle,
}) => {
  return (
    <div className="panel-section">
      <div className="panel-title">
        算法参数<span className="feature-tag">高级</span>
      </div>
      <div className="ai-config">
        <div className="config-row">
          <span className="config-label">搜索深度 (Minimax):</span>
          <input
            type="number"
            className="config-input"
            value={config.searchDepth || 3}
            min={1}
            max={6}
            onChange={(e) =>
              onConfigChange({ ...config, searchDepth: parseInt(e.target.value) })
            }
          />
        </div>
        <div className="config-row">
          <span className="config-label">MCTS迭代次数:</span>
          <input
            type="number"
            className="config-input"
            value={config.mctsIterations || 500}
            min={100}
            max={2000}
            step={100}
            onChange={(e) =>
              onConfigChange({ ...config, mctsIterations: parseInt(e.target.value) })
            }
          />
        </div>
        <div className="config-row">
          <span className="config-label">启用剪枝优化:</span>
          <input
            type="checkbox"
            checked={config.enablePruning !== false}
            onChange={(e) =>
              onConfigChange({ ...config, enablePruning: e.target.checked })
            }
          />
        </div>
        <div className="config-row">
          <span className="config-label">显示决策过程:</span>
          <input
            type="checkbox"
            checked={showVisualization}
            onChange={(e) => onVisualizationToggle(e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
};

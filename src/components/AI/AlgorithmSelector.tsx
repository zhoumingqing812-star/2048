import React from 'react';
import { AIAlgorithm } from '../../types/ai';

interface AlgorithmSelectorProps {
  selectedAlgorithm: AIAlgorithm | null;
  onSelect: (algorithm: AIAlgorithm) => void;
}

const algorithms: { value: AIAlgorithm; label: string; description: string }[] = [
  { value: 'random', label: '随机算法 (Random)', description: '从所有合法移动中随机选择一个方向。适合作为基准对照算法。' },
  { value: 'greedy', label: '贪心算法 (Greedy)', description: '评估每个可能移动的即时收益，选择能获得最高分数的移动。适合展示短视策略的优缺点。' },
  { value: 'minimax', label: 'Minimax算法', description: '使用博弈树搜索，考虑未来几步的最优移动。' },
  { value: 'alphabeta', label: 'Minimax + Alpha-Beta剪枝', description: '在Minimax基础上使用Alpha-Beta剪枝优化搜索效率。' },
  { value: 'mcts', label: '蒙特卡洛树搜索 (MCTS)', description: '使用蒙特卡洛树搜索，通过随机模拟评估移动质量。' },
];

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  selectedAlgorithm,
  onSelect,
}) => {
  const selectedAlgorithmData = algorithms.find(a => a.value === selectedAlgorithm);

  return (
    <div className="panel-section">
      <div className="panel-title">
        AI算法选择<span className="feature-tag">5种算法</span>
      </div>
      <select
        className="algorithm-select"
        value={selectedAlgorithm || ''}
        onChange={(e) => onSelect(e.target.value as AIAlgorithm)}
      >
        <option value="">请选择AI算法...</option>
        {algorithms.map((algo) => (
          <option key={algo.value} value={algo.value}>
            {algo.label}
          </option>
        ))}
      </select>
      {selectedAlgorithmData && (
        <div className="algorithm-info">
          <strong>💡 {selectedAlgorithmData.label}：</strong> {selectedAlgorithmData.description}
        </div>
      )}
    </div>
  );
};

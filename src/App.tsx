import { useState, useCallback, useEffect, useRef } from 'react';
import { Board } from './components/Game/Board';
import { ScoreBoard } from './components/Game/ScoreBoard';
import { AlgorithmSelector } from './components/AI/AlgorithmSelector';
import { AIConfigPanel } from './components/AI/AIConfigPanel';
import { SpeedControl } from './components/AI/SpeedControl';
import { AIControls } from './components/AI/AIControls';
import { DecisionPanel } from './components/AI/DecisionPanel';
import { StatisticsPanel } from './components/Statistics/StatisticsPanel';
import { useGame } from './hooks/useGame';
import { useKeyboard } from './hooks/useKeyboard';
import { useSwipe } from './hooks/useSwipe';
import { useAI } from './hooks/useAI';
import { GameMode } from './types/game';
import { GameStatistics } from './types/statistics';
import './styles/globals.css';

function App() {
  const [gameMode, setGameMode] = useState<GameMode>('manual');
  const [aiSpeed, setAiSpeed] = useState(500);
  const [showVisualization, setShowVisualization] = useState(true);
  const [gameStartTime] = useState(Date.now());
  const [totalDecisionTime, setTotalDecisionTime] = useState(0);
  const [decisionCount, setDecisionCount] = useState(0);

  const { gameState, maxTile, handleMove, handleReset } = useGame();
  const boardRef = useRef<HTMLDivElement>(null);

  const {
    isRunning: isAIRunning,
    isPaused: isAIPaused,
    currentDecision,
    selectedAlgorithm,
    config,
    setSelectedAlgorithm,
    setConfig,
    start: startAI,
    pause: pauseAI,
    stop: stopAI,
  } = useAI(gameState, handleMove, aiSpeed);

  const manualControlEnabled = gameMode === 'manual' && !isAIRunning;

  useKeyboard(handleMove, manualControlEnabled);
  useSwipe(boardRef, handleMove, manualControlEnabled);

  useEffect(() => {
    if (currentDecision) {
      setTotalDecisionTime((prev) => prev + currentDecision.thinkingTime);
      setDecisionCount((prev) => prev + 1);
    }
  }, [currentDecision]);

  const handleModeSwitch = useCallback((mode: GameMode) => {
    setGameMode(mode);
    if (mode === 'manual' && isAIRunning) {
      stopAI();
    }
  }, [isAIRunning, stopAI]);

  const handleResetGame = useCallback(() => {
    handleReset();
    stopAI();
    setTotalDecisionTime(0);
    setDecisionCount(0);
  }, [handleReset, stopAI]);

  const statistics: GameStatistics = {
    averageDecisionTime: decisionCount > 0 ? totalDecisionTime / decisionCount : 0,
    totalSearchedNodes: currentDecision?.details.searchedNodes || 0,
    averageSearchDepth: config.searchDepth || 0,
    pruningEfficiency: currentDecision?.details.prunedNodes || 0,
    gameTime: Date.now() - gameStartTime,
    maxTile,
  };

  const getAlgorithmName = () => {
    if (!selectedAlgorithm) return 'N/A';
    const names = {
      random: '随机算法',
      greedy: '贪心算法',
      minimax: 'Minimax算法',
      alphabeta: 'Minimax + Alpha-Beta',
      mcts: 'MCTS蒙特卡洛',
    };
    return names[selectedAlgorithm];
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🎮 2048 AI Game</h1>
        <p>体验5种AI算法，学习人工智能决策过程 | B站AI算法教学项目</p>
      </header>

      <div className="main-content">
        <div className="game-section">
          <ScoreBoard
            score={gameState.score}
            bestScore={gameState.bestScore}
            moves={gameState.moves}
            maxTile={maxTile}
          />
          <Board ref={boardRef} board={gameState.board} />
          <div className="game-hint">
            <strong>手动模式：</strong> 使用方向键 ↑↓←→ 进行游戏
            <br />
            <strong>AI模式：</strong> 选择AI算法后，点击"开始AI"按钮观察AI自动游戏
          </div>
        </div>

        <aside className="control-panel">
          <div className="panel-section">
            <div className="panel-title">游戏模式</div>
            <div className="mode-switch">
              <button
                className={`mode-btn ${gameMode === 'manual' ? 'active' : ''}`}
                onClick={() => handleModeSwitch('manual')}
              >
                🎮 手动模式
              </button>
              <button
                className={`mode-btn ${gameMode === 'ai' ? 'active' : ''}`}
                onClick={() => handleModeSwitch('ai')}
              >
                🤖 AI模式
              </button>
            </div>
          </div>

          <AlgorithmSelector
            selectedAlgorithm={selectedAlgorithm}
            onSelect={(algo) => {
              setSelectedAlgorithm(algo);
              setGameMode('ai');
            }}
          />

          <SpeedControl speed={aiSpeed} onSpeedChange={setAiSpeed} />

          <AIConfigPanel
            config={config}
            onConfigChange={setConfig}
            showVisualization={showVisualization}
            onVisualizationToggle={setShowVisualization}
          />

          <AIControls
            isAIRunning={isAIRunning}
            isAIPaused={isAIPaused}
            onStart={startAI}
            onPause={pauseAI}
            onStop={stopAI}
            onReset={handleResetGame}
            disabled={!selectedAlgorithm || gameState.status !== 'playing'}
          />

          <StatisticsPanel statistics={statistics} />
        </aside>
      </div>

      {showVisualization && gameMode === 'ai' && (
        <section className="ai-thinking-section">
          <div className="thinking-header">
            <div className="thinking-title">
              <span className="thinking-indicator"></span>
              AI决策过程可视化
              <span className="feature-tag">实时展示</span>
            </div>
            <button
              className="toggle-btn"
              onClick={() => setShowVisualization(false)}
            >
              🔼 收起面板
            </button>
          </div>

          <div className="thinking-content">
            <DecisionPanel
              decision={currentDecision}
              algorithmName={getAlgorithmName()}
              isThinking={isAIRunning && !isAIPaused}
            />
          </div>
        </section>
      )}

      {gameState.status === 'win' && (
        <div className="game-overlay">
          <div className="game-message">
            <h2>🎉 恭喜获胜！</h2>
            <p>你达到了 2048！</p>
            <button className="action-btn btn-primary" onClick={handleResetGame}>
              再玩一次
            </button>
          </div>
        </div>
      )}

      {gameState.status === 'gameover' && (
        <div className="game-overlay">
          <div className="game-message">
            <h2>😢 游戏结束</h2>
            <p>最终分数: {gameState.score}</p>
            <button className="action-btn btn-primary" onClick={handleResetGame}>
              重新开始
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

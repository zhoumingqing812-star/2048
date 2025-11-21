import { useState, useCallback, useRef, useEffect } from 'react';
import { GameState, Direction } from '../types/game';
import { AIAlgorithm, AIDecision, AIConfig, AIStrategy } from '../types/ai';
import { RandomStrategy } from '../core/ai/RandomStrategy';
import { GreedyStrategy } from '../core/ai/GreedyStrategy';
import { MinimaxStrategy } from '../core/ai/MinimaxStrategy';
import { AlphaBetaStrategy } from '../core/ai/AlphaBetaStrategy';
import { MCTSStrategy } from '../core/ai/MCTSStrategy';

const getAIStrategy = (algorithm: AIAlgorithm): AIStrategy => {
  switch (algorithm) {
    case 'random':
      return new RandomStrategy();
    case 'greedy':
      return new GreedyStrategy();
    case 'minimax':
      return new MinimaxStrategy();
    case 'alphabeta':
      return new AlphaBetaStrategy();
    case 'mcts':
      return new MCTSStrategy();
  }
};

export const useAI = (
  gameState: GameState,
  onMove: (direction: Direction) => void,
  speed: number
) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentDecision, setCurrentDecision] = useState<AIDecision | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AIAlgorithm | null>(null);
  const [config, setConfig] = useState<AIConfig>({
    searchDepth: 3,
    mctsIterations: 500,
    enablePruning: true,
  });

  const isRunningRef = useRef(isRunning);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isRunningRef.current = isRunning;
    isPausedRef.current = isPaused;
  }, [isRunning, isPaused]);

  const runAIStep = useCallback(async () => {
    if (!selectedAlgorithm || gameState.status !== 'playing') {
      setIsRunning(false);
      return;
    }

    try {
      const strategy = getAIStrategy(selectedAlgorithm);
      const decision = await strategy.getBestMove(gameState, config);
      setCurrentDecision(decision);

      if (!isRunningRef.current || isPausedRef.current) return;

      await new Promise((resolve) => setTimeout(resolve, speed));

      if (!isRunningRef.current || isPausedRef.current) return;

      onMove(decision.direction);
    } catch (error) {
      console.error('AI decision error:', error);
      setIsRunning(false);
    }
  }, [selectedAlgorithm, gameState, config, speed, onMove]);

  useEffect(() => {
    if (isRunning && !isPaused && gameState.status === 'playing') {
      runAIStep();
    }
  }, [isRunning, isPaused, gameState, runAIStep]);

  const start = useCallback(() => {
    if (!selectedAlgorithm) return;
    setIsRunning(true);
    setIsPaused(false);
  }, [selectedAlgorithm]);

  const pause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  return {
    isRunning,
    isPaused,
    currentDecision,
    selectedAlgorithm,
    config,
    setSelectedAlgorithm,
    setConfig,
    start,
    pause,
    stop,
  };
};

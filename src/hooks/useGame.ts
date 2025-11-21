import { useState, useCallback } from 'react';
import { GameState, Direction } from '../types/game';
import { initializeGame, executeMove, resetGame } from '../core/game/GameLogic';
import { getMaxTile } from '../core/game/BoardUtils';

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(initializeGame());

  const handleMove = useCallback((direction: Direction) => {
    setGameState((prevState) => executeMove(prevState, direction));
  }, []);

  const handleReset = useCallback(() => {
    setGameState((prevState) => resetGame(prevState.bestScore));
  }, []);

  const maxTile = getMaxTile(gameState.board);

  return {
    gameState,
    maxTile,
    handleMove,
    handleReset,
  };
};

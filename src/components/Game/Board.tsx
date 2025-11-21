import React from 'react';
import { Tile } from './Tile';

interface BoardProps {
  board: number[][];
}

export const Board: React.FC<BoardProps> = ({ board }) => {
  return (
    <div className="game-board-container">
      <div className="game-board">
        {board.map((row, rowIndex) =>
          row.map((value, colIndex) => (
            <Tile key={`${rowIndex}-${colIndex}`} value={value} />
          ))
        )}
      </div>
    </div>
  );
};

import { forwardRef } from 'react';
import { Tile } from './Tile';

interface BoardProps {
  board: number[][];
}

export const Board = forwardRef<HTMLDivElement, BoardProps>(({ board }, ref) => (
  <div className="game-board-container" ref={ref}>
    <div className="game-board">
      {board.map((row, rowIndex) =>
        row.map((value, colIndex) => (
          <Tile key={`${rowIndex}-${colIndex}`} value={value} />
        ))
      )}
    </div>
  </div>
));

Board.displayName = 'Board';

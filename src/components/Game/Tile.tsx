import React from 'react';
import { TILE_COLORS } from '../../utils/constants';

interface TileProps {
  value: number;
}

export const Tile: React.FC<TileProps> = ({ value }) => {
  const colors = value > 0 ? TILE_COLORS[value] || TILE_COLORS[2048] : { bg: '#cdc1b4', color: '#776e65' };

  const getFontSize = (val: number): string => {
    if (val === 0) return '2.5rem';
    if (val < 100) return '2.5rem';
    if (val < 1000) return '2.3rem';
    if (val < 10000) return '1.8rem';
    return '1.5rem';
  };

  return (
    <div
      className="tile"
      style={{
        backgroundColor: colors.bg,
        color: colors.color,
        fontSize: getFontSize(value),
      }}
    >
      {value > 0 ? value : ''}
    </div>
  );
};

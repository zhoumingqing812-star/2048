import { useEffect, useRef } from 'react';
import { Direction } from '../types/game';

export const useSwipe = (
  ref: React.RefObject<HTMLElement>,
  onMove: (direction: Direction) => void,
  enabled: boolean
) => {
  const startPoint = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      startPoint.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.cancelable) {
        event.preventDefault();
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (!startPoint.current) return;

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - startPoint.current.x;
      const deltaY = touch.clientY - startPoint.current.y;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (Math.max(absX, absY) < 20) {
        startPoint.current = null;
        return;
      }

      const direction: Direction =
        absX > absY
          ? deltaX > 0
            ? 'right'
            : 'left'
          : deltaY > 0
          ? 'down'
          : 'up';

      onMove(direction);
      startPoint.current = null;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref, onMove, enabled]);
};



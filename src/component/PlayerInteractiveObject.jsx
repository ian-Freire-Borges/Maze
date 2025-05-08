import React, { useEffect, useRef, useState } from 'react';
import imgCoin from '../assets/coin_rot_anim.png';

const SPRITE_FRAME_COUNT = 6;
const FRAME_WIDTH = 32; // Largura de cada frame da moeda
const SPRITE_DURATION = 100; // Tempo por frame (ms)

const PlayerInteractiveObject = ({ 
  maze, 
  playerPosition, 
  cellDimensions, 
  setScore
}) => {
  const itemPositionsRef = useRef(null);
  const [frameIndex, setFrameIndex] = useState(0);

  if (itemPositionsRef.current === null) {
    const positions = [];
    const emptyCells = [];

    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        if (maze[y][x] === 0) emptyCells.push({ x, y });
      }
    }

    for (let i = 0; i < 4 && emptyCells.length > 0; i++) {
      const index = Math.floor(Math.random() * emptyCells.length);
      positions.push(emptyCells.splice(index, 1)[0]);
    }

    itemPositionsRef.current = positions;
  }

  useEffect(() => {
    const playerKey = `${playerPosition.x},${playerPosition.y}`;
    const index = itemPositionsRef.current.findIndex(
      pos => `${pos.x},${pos.y}` === playerKey
    );

    if (index !== -1) {
      itemPositionsRef.current.splice(index, 1);
      setScore(prev => prev + 20);
    }
  }, [playerPosition, setScore]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % SPRITE_FRAME_COUNT);
    }, SPRITE_DURATION);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {itemPositionsRef.current.map(({ x, y }, index) => {
        const { cellWidth, cellHeight } = cellDimensions;
        const left = x * cellWidth;
        const top = y * cellHeight;

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left,
              top,
              width: cellWidth,
              height: cellHeight,
              backgroundImage: `url(${imgCoin})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${FRAME_WIDTH * SPRITE_FRAME_COUNT}px ${cellHeight}px`,
              backgroundPosition: `-${frameIndex * FRAME_WIDTH}px 0px`,
              imageRendering: 'pixelated', // para manter o estilo retrô
              zIndex: 5
            }}
          />
        );
      })}
    </>
  );
};

export default PlayerInteractiveObject;
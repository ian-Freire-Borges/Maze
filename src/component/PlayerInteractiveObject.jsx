import React, { useEffect, useRef } from 'react';

const PlayerInteractiveObject = ({ 
  maze, 
  playerPosition, 
  cellDimensions, 
  setScore
}) => {

  const itemPositionsRef = useRef(null);

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
      itemPositionsRef.current.splice(index, 1); // Remove item
      setScore(prev => prev + 20); // Atualiza o score corretamente
    }
  }, [playerPosition, setScore]);

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
              background: 'gold',
              borderRadius: '50%',
              boxShadow: '0 0 4px 2px yellow',
              zIndex: 5
            }}
          />
        );
      })}
    </>
  );
};

export default PlayerInteractiveObject;
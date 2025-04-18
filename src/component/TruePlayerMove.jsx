import React, { useState, useEffect, useRef } from 'react';
import RenderPlayerMove from './RenderPlayerMove';
import { mazeLayout } from "./MazeMap";

export default function TruePlayerMove() {
  const [playerPosition, setPlayerPosition] = useState([],[]);
  const [maze, setMaze] = useState(mazeLayout);
  const [isAutoMoving, setIsAutoMoving] = useState(false);
  const [exitFound, setExitFound] = useState(false);
  const [moveDirection, setMoveDirection] = useState(null);
  const [lastValidDirection, setLastValidDirection] = useState("down");
  const [pathStack, setPathStack] = useState([]);
  const [moveSpeed, setMoveSpeed] = useState(300);
  const [playAgain, setPlayAgain] = useState(false)

  const visited = useRef(new Set());

  useEffect(() => {
    const findInitialPosition = () => {
      for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
          if (maze[row][col] === 2) {
            return { x: col, y: row };
          }
        }
      }
      return { x: 1, y: 1 };
    };
    const startPos = findInitialPosition();
    setPlayerPosition(startPos);
    setPathStack([startPos]);
    visited.current = new Set([`${startPos.x},${startPos.y}`]);
  }, []);

  const tryMovePlayer = (currentPos) => {
    const directions = [
      { dx: -1, dy: 0, dir: "left" },
      { dx: 1, dy: 0, dir: "right" },
      { dx: 0, dy: -1, dir: "up" },
      { dx: 0, dy: 1, dir: "down" }
    ];

    for (const { dx, dy, dir } of directions) {
      const newX = currentPos.x + dx;
      const newY = currentPos.y + dy;
      const key = `${newX},${newY}`;

      if (maze[newY]?.[newX] === 3) {
        setExitFound(true);
        setMoveDirection(null);
        return true;
      }

      if (maze[newY]?.[newX] === 0 && !visited.current.has(key)) {
        setMaze(prevMaze => {
          const newMaze = prevMaze.map(row => [...row]);
          newMaze[currentPos.y][currentPos.x] = 0;
          newMaze[newY][newX] = 2;

          setPlayerPosition({ x: newX, y: newY });
          setMoveDirection(dir);
          setLastValidDirection(dir);
          setPathStack(prev => [...prev, { x: newX, y: newY }]);
          visited.current.add(key);

          return newMaze;
        });
        return true;
      }
    }

    return false;
  };

  const backtrack = () => {
    if (pathStack.length <= 1) {
      setIsAutoMoving(false);
      return;
    }
  
    const newPath = pathStack.slice(0, -1);
    const prevPos = newPath[newPath.length - 1];
  
    const dx = prevPos.x - playerPosition.x;
    const dy = prevPos.y - playerPosition.y;
  
    let dir = null;
    if (dx === -1) dir = "left";
    else if (dx === 1) dir = "right";
    else if (dy === -1) dir = "up";
    else if (dy === 1) dir = "down";
  
    setPathStack(newPath);
    setPlayerPosition(prevPos);
    setMoveDirection(dir);
    setLastValidDirection(dir);
  
    setMaze(prevMaze => {
      const newMaze = prevMaze.map(row => [...row]);
      newMaze[playerPosition.y][playerPosition.x] = 0;
      newMaze[prevPos.y][prevPos.x] = 2;
      return newMaze;
    });
  };

  useEffect(() => {
    if (!isAutoMoving || exitFound) return;

    const moveInterval = setInterval(() => {
      const moved = tryMovePlayer(playerPosition);

      if (!moved) {
        backtrack();
      }
    }, moveSpeed);

    return () => clearInterval(moveInterval);
  }, [isAutoMoving, playerPosition, exitFound, pathStack]);

  return (
    <div>
      <div style={{ position: 'absolute', top: -40, left: -80 }}>
        <div style={{ marginBottom: '10px' }}>
          <button  disabled={isAutoMoving} onClick={() => {
            setIsAutoMoving(true);
            setExitFound(false);
            if(!playAgain){
            setPathStack([playerPosition]);
            visited.current = new Set([`${playerPosition.x},${playerPosition.y}`]);
          }}}>
            Iniciar Movimento Automático
          </button>
          <button onClick={() => {
            setPlayAgain(true);
            setIsAutoMoving(false);
            setMoveDirection(null);
          }} style={{ marginLeft: '10px' }}
          disabled={!isAutoMoving}>
            Parar
          </button>
          <button onClick={() => {
            setMoveSpeed(prev => {
            if (prev === 300) return 150;   
            if (prev === 150) return 100;
            if (prev === 100) return 50;
            if (prev === 50) return 25;   
            return 300;});
            }} style={{ marginLeft: '10px' }}>
            Velocidade: { moveSpeed === 300 ? "1x" : moveSpeed === 150 ? "2x" : moveSpeed === 100 ? '3x' : moveSpeed === 50 ? '4x' : '5x'} ⏩
          </button>
          <button>
            Gerar Novo Mapa: 
          </button>
        </div>
        {exitFound && <p style={{ color: 'green' }}>Saída encontrada!</p>}
      </div>
      <RenderPlayerMove
        position={playerPosition}
        moveDirection={moveDirection}
        lastDirection={lastValidDirection}
      />
    </div>
  );
}
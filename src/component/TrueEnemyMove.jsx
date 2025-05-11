import React, { useState, useEffect, useRef } from 'react';
import RenderEnemyMove from "./RenderEnemyMove";

export default function TrueEnemyMove({ 
  setMaze, 
  exitFound, 
  moveSpeed, 
  isAutoMoving, 
  setExitFound, 
  setGameResult, 
  cellDimensions,
  mazeRef,
  enemyId
}) {
  const [enemyPosition, setEnemyPosition] = useState({ x: 0, y: 0 });
  const [moveDirection, setMoveDirection] = useState("right");
  
  // Refs para sincronização
  const pathStackRef = useRef([]);
  const visitedRef = useRef(new Set());
  const enemyPosRef = useRef(enemyPosition);

  // Atualiza a ref da posição quando o estado muda
  useEffect(() => {
    enemyPosRef.current = enemyPosition;
  }, [enemyPosition]);

  // Inicializa a posição do inimigo
  useEffect(() => {
    const findInitialPosition = () => {
      const currentMaze = mazeRef.current;
      for (let row = 0; row < currentMaze.length; row++) {
        for (let col = 0; col < currentMaze[row].length; col++) {
          if ((enemyId === 1 && currentMaze[row][col] === 4)||(enemyId === 2 && currentMaze[row][col] === 5) ) {
            return { x: col, y: row };
          }
        }
      }
      return { x: 1, y: 1 };
    };
    
    const startPos = findInitialPosition();
    setEnemyPosition(startPos);
    pathStackRef.current = [startPos];
    visitedRef.current = new Set([`${startPos.x},${startPos.y}`]);
  }, [mazeRef]);

  const tryMoveEnemy = (currentPos) => {
    const currentMaze = mazeRef.current;
    const directions = [
      { dx: -1, dy: 0 }, // esquerda
      { dx: 1, dy: 0 },  // direita
      { dx: 0, dy: -1 }, // cima
      { dx: 0, dy: 1 }   // baixo
    ];

    // Embaralha as direções
    for (let i = directions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [directions[i], directions[j]] = [directions[j], directions[i]];
    }
    
    // Verifica se encontrou o jogador
    if (currentMaze[currentPos.y][currentPos.x] === 2) {
      handlePlayerCaught(currentPos);
      return true;
    }

    // Tenta mover em todas as direções
    for (const { dx, dy } of directions) {
      const newX = currentPos.x + dx;
      const newY = currentPos.y + dy;
      const key = `${newX},${newY}`;

      if (currentMaze[newY]?.[newX] === 0 && !visitedRef.current.has(key)) {
        moveEnemy(currentPos, newX, newY, dx);
        return true;
      }
      
      // Verifica se encontrou o jogador na nova posição
      if (currentMaze[newY]?.[newX] === 2) {
        handlePlayerCaught({ x: newX, y: newY }, currentPos);
        return true;
      }
    }

    return false;
  };

  const moveEnemy = (currentPos, newX, newY, dx) => {
    // Atualiza a direção
    if (dx < 0) setMoveDirection("left");
    if (dx > 0) setMoveDirection("right");

    // Atualiza o labirinto e a posição
    setMaze(prevMaze => {
      const newMaze = prevMaze.map(row => [...row]);
      newMaze[currentPos.y][currentPos.x] = 0;
      newMaze[newY][newX] = 4;
      return newMaze;
    });

    setEnemyPosition({ x: newX, y: newY });
    pathStackRef.current = [...pathStackRef.current, { x: newX, y: newY }];
    visitedRef.current.add(`${newX},${newY}`);
  };

  const handlePlayerCaught = (playerPos, enemyPos = enemyPosRef.current) => {
    setMaze(prevMaze => {
      const newMaze = prevMaze.map(row => [...row]);
      newMaze[enemyPos.y][enemyPos.x] = 0;
      newMaze[playerPos.y][playerPos.x] = 4;
      return newMaze;
    });

    setEnemyPosition(playerPos);
    setGameResult(false);
    setExitFound(true);
    setMoveDirection(null);
  };

  const backtrack = () => {
    if (pathStackRef.current.length <= 1) {
      visitedRef.current = new Set();
      return;
    }

    const newPath = pathStackRef.current.slice(0, -1);
    const prevPos = newPath[newPath.length - 1];

    // Define direção reversa
    if (prevPos.x < enemyPosRef.current.x) setMoveDirection("left");
    if (prevPos.x > enemyPosRef.current.x) setMoveDirection("right");

    // Verifica se encontrou o jogador
    if (mazeRef.current[prevPos.y]?.[prevPos.x] === 2) {
      handlePlayerCaught(prevPos);
      return;
    }

    // Atualiza o labirinto e a posição
    setMaze(prevMaze => {
      const newMaze = prevMaze.map(row => [...row]);
      newMaze[enemyPosRef.current.y][enemyPosRef.current.x] = 0;
      newMaze[prevPos.y][prevPos.x] = 4;
      return newMaze;
    });

    setEnemyPosition(prevPos);
    pathStackRef.current = newPath;
  };

  useEffect(() => {
    if (!isAutoMoving || exitFound) return;

    const moveInterval = setInterval(() => {
      const moved = tryMoveEnemy(enemyPosRef.current);
      if (!moved) backtrack();
    }, moveSpeed * 2);

    return () => clearInterval(moveInterval);
  }, [isAutoMoving, exitFound, moveSpeed]);

  return (
    <RenderEnemyMove 
      position={enemyPosition} 
      moveDirection={moveDirection}  
      cellDimensions={cellDimensions}
    />
  );
}
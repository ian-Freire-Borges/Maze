import React, { useState, useEffect, useRef } from 'react';
import RenderEnemyMove from "./RenderEnemyMove";

export default function TrueEnemyMove({ setMaze,maze, exitFound, moveSpeed, isAutoMoving,setExitFound, setGameResult }) {
  const [EnemyPosition, setEnemyPosition] = useState([]);
  const [pathStack, setPathStack] = useState([]);
  const [moveDirection, setMoveDirection] = useState("right");

  const visited = useRef(new Set());
  const onDoor = useRef(false);
  const onDoorBack = useRef(false);

  useEffect(() => {
    const findInitialPosition = () => {
      for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
          if (maze[row][col] === 4) {
            return { x: col, y: row };
          }
        }
      }
    };
    const startPos = findInitialPosition();
    setEnemyPosition(startPos);
    setPathStack([startPos]);
    visited.current = new Set([`${startPos.x},${startPos.y}`]);
  }, []);

  const tryMovePlayer = (currentPos) => {
    const directions = [
      { dx: -1, dy: 0 }, // esquerda
      { dx: 1, dy: 0 },  // direita
      { dx: 0, dy: -1 }, // cima
      { dx: 0, dy: 1 }   // baixo
    ];
    
    if(maze[currentPos.y][currentPos.x]===2){
        setExitFound(true);
        setGameResult(false);

          return true;
      }
    for (const { dx, dy } of directions) {
      const newX = currentPos.x + dx;
      const newY = currentPos.y + dy;
      const key = `${newX},${newY}`;

      if ((maze[newY]?.[newX] === 0 || maze[newY]?.[newX] === 3) && !visited.current.has(key) ) {
        if (dx < 0) setMoveDirection("left");
        if (dx > 0) setMoveDirection("right");

        
        setMaze(prevMaze => {
          const newMaze = prevMaze.map(row => [...row]);
         if(newMaze[newY][newX]===3){
            onDoor.current=true;
            newMaze[currentPos.y][currentPos.x] = 0;
            newMaze[newY][newX] = 4;
          }else{
            if(onDoor.current){
              newMaze[currentPos.y][currentPos.x] = 3;
              newMaze[newY][newX] = 4;
              onDoor.current=false
              console.log("foiiii")
            }else{
          newMaze[currentPos.y][currentPos.x] = 0;
          newMaze[newY][newX] = 4;
            }
          }

          setEnemyPosition({ x: newX, y: newY });
          setPathStack(prev => [...prev, { x: newX, y: newY }]);
          visited.current.add(key);

          return newMaze;
        });
        return true;
      }
    
      if(maze[newY]?.[newX] === 2){
        setGameResult(false);
        setExitFound(true);
        setMaze(prevMaze => {
            const newMaze = prevMaze.map(row => [...row]);
            newMaze[currentPos.y][currentPos.x] = 0;
            newMaze[newY][newX] = 4;
  
            setEnemyPosition({ x: newX, y: newY });
            setPathStack(prev => [...prev, { x: newX, y: newY }]);
            visited.current.add(key);
          
            return newMaze;
          });
          setMoveDirection(null);
          return true;
     
    }
     
    }

    return false;
  };

  const backtrack = () => {
    if (pathStack.length <= 1) {
      visited.current = new Set();
      return;
    }

    const newPath = pathStack.slice(0, -1);
    const prevPos = newPath[newPath.length - 1];

    // define direção reversa
    if (prevPos.x < EnemyPosition.x) setMoveDirection("left");
    if (prevPos.x > EnemyPosition.x) setMoveDirection("right");

    if (maze[prevPos.y]?.[prevPos.x] === 2) {
      setGameResult(false);
      setExitFound(true);
      
      return 
    }

    if(maze[prevPos.y]?.[prevPos.x] === 3){
      onDoorBack.current=true;
    }
    setPathStack(newPath);
    setEnemyPosition(prevPos);

    setMaze(prevMaze => {
      const newMaze = prevMaze.map(row => [...row]);
      if(onDoorBack.current){
        onDoorBack.current=false
        newMaze[EnemyPosition.y][EnemyPosition.x] = 3;
        newMaze[prevPos.y][prevPos.x] = 4;

      }else{
      newMaze[EnemyPosition.y][EnemyPosition.x] = 0;
      newMaze[prevPos.y][prevPos.x] = 4;
      }
      return newMaze;
    });
  };

  useEffect(() => {
    if (!isAutoMoving || exitFound) return;

    const moveInterval = setInterval(() => {
      const moved = tryMovePlayer(EnemyPosition);
      if (!moved) backtrack();
    }, moveSpeed * 2);

    return () => clearInterval(moveInterval);
  }, [isAutoMoving, EnemyPosition, exitFound]);

  return (
    <div>
      <RenderEnemyMove position={EnemyPosition} moveDirection={moveDirection} />
    </div>
  );
}
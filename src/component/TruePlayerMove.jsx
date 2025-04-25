import React, { useState, useEffect, useRef } from 'react';
import RenderPlayerMove from './RenderPlayerMove';


export default function TruePlayerMove({ setScreen, setGameResult, maze, setMaze, setExitFound, exitFound, moveSpeed, isAutoMoving}) {
  const [playerPosition, setPlayerPosition] = useState([], []);
  const [moveDirection, setMoveDirection] = useState(null);
  const [lastValidDirection, setLastValidDirection] = useState("down");
 

  const back= useRef(false);
  const pathStackRef = useRef([]);
  const pathStackCloneRef = useRef([]);
  const enemyAlertRef = useRef(false);
  const visited = useRef(new Set());
  const superVisited = useRef(new Set());
  const playerPanic = useRef(false);
  const stepsInPanic = useRef(0);


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
    pathStackRef.current = [startPos]; // Atualiza a ref
    visited.current = new Set([`${startPos.x},${startPos.y}`]);
  }, []);

  const tryMovePlayer = (currentPos) => {
    const directions = [
      { dx: -1, dy: 0, dir: "left" },
      { dx: 1, dy: 0, dir: "right" },
      { dx: 0, dy: -1, dir: "up" },
      { dx: 0, dy: 1, dir: "down" }
    ];
    const cellValue = maze[currentPos.y][currentPos.x];
    if(cellValue===4){
      setGameResult(false);
      setExitFound(true);
      setMoveDirection(null);
      return true;
    }

    if(cellValue===3){
      setGameResult(true);
      setExitFound(true);
      setMoveDirection(null);
      return true;
    }
    if(!playerPanic.current){
    if (!enemyAlertRef.current) {
      for (const { dx, dy } of directions) {
        const newX = currentPos.x + dx;
        const newY = currentPos.y + dy;
        const key = `${newX},${newY}`; 

        
        if (maze[newY]?.[newX] === 0 || maze[newY]?.[newX] === 4) {
          let dx2 = dx;
          let dy2 = dy;
          while (maze[currentPos.y + dy2]?.[currentPos.x + dx2] === 0 || maze[currentPos.y + dy2]?.[currentPos.x + dx2] === 4) {
            if (maze[currentPos.y + dy2]?.[currentPos.x + dx2] === 4) {
              console.log("🚨 ALERTA! Inimigo detectado!");
              if(back.current===true){
              superVisited.current.clear();
              superVisited.current.add(key);
              superVisited.current.add(`${currentPos.x},${currentPos.y}`);
              console.log(key)
              console.log(currentPos.y,currentPos.x )
              playerPanic.current = true; 
              return;
              }else{
              visited.current.add(key);
              enemyAlertRef.current = true;
              pathStackCloneRef.current = [...pathStackRef.current];
              return;
              }
              
            }
            dx2 += dx;
            dy2 += dy;
          }
        }
      }
    }
  }

    for (const { dx, dy, dir } of directions) {
      const newX = currentPos.x + dx;
      const newY = currentPos.y + dy;
      const key = `${newX},${newY}`;

      if (maze[newY]?.[newX] === 3) {
        setGameResult(true);
        setExitFound(true);
        setMoveDirection(null);
        return true;
      }
      
      if (
        (!playerPanic.current && maze[newY]?.[newX] === 0 && !visited.current.has(key)) ||
        (playerPanic.current && maze[newY]?.[newX] === 0 && !superVisited.current.has(key))
      )  {
        back.current=false
        console.log(stepsInPanic.current)
        console.log("front");
        console.log(superVisited.current)
        console.log(pathStackRef.current)
        if (enemyAlertRef.current) {
          const last = Array.from(visited.current).at(-1);
          if (last) {
            visited.current.delete(last);
          }
          enemyAlertRef.current = false;
          console.log("tirei alerta");
          console.log(enemyAlertRef.current);
        }
        
        setMaze(prevMaze => {
          const newMaze = prevMaze.map(row => [...row]);
          newMaze[currentPos.y][currentPos.x] = 0;
          newMaze[newY][newX] = 2;

          setPlayerPosition({ x: newX, y: newY });
          setMoveDirection(dir);
          setLastValidDirection(dir);
          pathStackRef.current = [...pathStackRef.current, { x: newX, y: newY }]; 
          visited.current.add(key);
          if(playerPanic.current){
            console.log(key);
             stepsInPanic.current++;
             superVisited.current.add(`${currentPos.x},${currentPos.y}`);
              if(stepsInPanic.current>=4){
                superVisited.current.clear();
                playerPanic.current=false
                console.log("saiu do panico")
                stepsInPanic.current = 0;
              }
          }
          return newMaze;
        });
        return true;
      }
    }

    return false;
  };

  const backtrack = () => {
    back.current=true;
    if(playerPanic.current){
      return
    }
    console.log("back ativado")
    if (pathStackRef.current.length <= 1) {
      visited.current.clear();
      return false;
    }

    let newPath, prevPos;

    if (enemyAlertRef.current) {
      newPath = pathStackCloneRef.current.slice(0, -1);
      if (newPath.length <= 1) {
        visited.current.clear();
        return ;
      }
      prevPos = newPath[newPath.length - 1];
      pathStackRef.current = [...pathStackRef.current, prevPos];
      pathStackCloneRef.current = newPath;
     
    } else {
      newPath = pathStackRef.current.slice(0, -1);
      prevPos = newPath[newPath.length - 1];
      pathStackRef.current = newPath;  
    }

    
    
   
    const dx = prevPos.x - playerPosition.x;
    const dy = prevPos.y - playerPosition.y;
    

    let dir = null;
    if (dx === -1) dir = "left";
    else if (dx === 1) dir = "right";
    else if (dy === -1) dir = "up";
    else if (dy === 1) dir = "down";

  
    setPlayerPosition(prevPos);
    setMoveDirection(dir);
    setLastValidDirection(dir);

    if (maze[prevPos.y]?.[prevPos.x] === 4) {
      setGameResult(false);
      setExitFound(true);
      
      return 
    }
  

    setMaze(prevMaze => {
      const newMaze = prevMaze.map(row => [...row]);
      newMaze[playerPosition.y][playerPosition.x] = 0;
      newMaze[prevPos.y][prevPos.x] = 2;
      return newMaze;
    });
    return ;
  };

  useEffect(() => {
    if (!isAutoMoving || exitFound) {
      if (exitFound) {
        enemyAlertRef.current = false;
        playerPanic.current = false;
        superVisited.current.clear();
        setScreen("END")
      }
      return;
    }

    const moveInterval = setInterval(() => {
      const moved = tryMovePlayer(playerPosition);
      if (!moved) {
        backtrack();
       
      }
      if(maze[playerPosition.y][playerPosition.x]===4){
        setExitFound(true);
        setGameResult(false);

          return ;
      }
  
    }, moveSpeed);

    return () => clearInterval(moveInterval);
  }, [isAutoMoving, playerPosition, exitFound]);

  return (
    <div className='container-total'>
      <RenderPlayerMove
        position={playerPosition}
        moveDirection={moveDirection}
        lastDirection={lastValidDirection}
        isAlert={enemyAlertRef.current}
        isPanic={playerPanic.current}
      />
    </div>
  );
} 
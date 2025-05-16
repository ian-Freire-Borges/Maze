import React, { useState, useEffect, useRef } from 'react';
import RenderEnemyMove from "./RenderEnemyMove";

export default function TrueEnemyMove({ 
  setMaze,
  maze, 
  exitFound, 
  moveSpeed, 
  isAutoMoving, 
  setExitFound, 
  setGameResult, 
  cellDimensions,
  mazeRef,
  enemyId,
  powerPickRef,
  setScore
}) {
  const [enemyPosition, setEnemyPosition] = useState({ x: 0, y: 0 });
  const [moveDirection, setMoveDirection] = useState("right");
  const [playerAlert, setPlayerAlert] = useState(false)

  
  // Refs para sincronização
  const pathStackRef = useRef([]);
  const visitedRef = useRef(new Set());
  const enemyPosRef = useRef(enemyPosition);
  const lookIntervalRef = useRef(null);
  const emenyPassRef = useRef(0)
  const enemyDeadRef = useRef(false)
  

   const cechkPlayerImpact = (currentPos) => {
    if(enemyDeadRef.current){return}
    const currentMaze = mazeRef.current;
    if(currentMaze[currentPos.y ]?.[currentPos.x]=== 2){
       setMaze(prevMaze => {
      const newMaze = prevMaze.map(row => [...row]);
      currentMaze[currentPos.y][currentPos.x] = 0;
      return newMaze;
       })
      
      if(!powerPickRef.current){
    setGameResult(false);
    setExitFound(true);
    setMoveDirection(null);
    }else if (powerPickRef.current){
       setScore((prev) => prev + 100)
      enemyDeadRef.current=true
    }
    }
   }
  const lookforplayer = (currentPos) => {
    if(enemyDeadRef.current){return}
    const currentMaze = mazeRef.current;
    const directions = [
      { dx: -1, dy: 0 }, // esquerda
      { dx: 1, dy: 0 },  // direita
      { dx: 0, dy: -1 }, // cima
      { dx: 0, dy: 1 }   // baixo
    ];
    if(playerAlert){
       emenyPassRef.current++
       if( emenyPassRef.current>80){
        setPlayerAlert(false)
       emenyPassRef.current=0}
    }
     for (const { dx, dy } of directions) {
      const newX = currentPos.x + dx;
      const newY = currentPos.y + dy;
      const key = `${newX},${newY}`;

      if(!playerAlert && enemyId === 2){
      if (currentMaze[newY]?.[newX] === 0 || currentMaze[newY]?.[newX] === 2) {
            let dx2 = dx;
            let dy2 = dy;
            while (currentMaze[currentPos.y + dy2]?.[currentPos.x + dx2] === 0 || currentMaze[currentPos.y + dy2]?.[currentPos.x + dx2] === 2) {
              if (currentMaze[currentPos.y + dy2]?.[currentPos.x + dx2] === 2) {
                console.log("eedsasadasd")
                 setPlayerAlert(true)
                return;
                }
              
             
    
                   dx2 += dx;
                  dy2 += dy;
              }
           
          }
        }
  }
}


useEffect(() => {
  if (!lookIntervalRef.current) {
    
      lookforplayer(enemyPosRef.current);
  
  }
  cechkPlayerImpact (enemyPosRef.current);

}, [maze]); 
  useEffect(() => {
    enemyPosRef.current = enemyPosition;
  }, [enemyPosition]);

  // Inicializa a posição do inimigo
 useEffect(() => {
  const currentMaze = mazeRef.current;
  const validPositions = [];

  for (let row = 0; row < currentMaze.length; row++) {
    for (let col = 0; col < currentMaze[row].length; col++) {
      if (currentMaze[row][col] === 0) {
        validPositions.push({ x: col, y: row });
      }
    }
  }

  


  const randomIndex = Math.floor(Math.random() * validPositions.length);
  const startPos = validPositions[randomIndex];

  setEnemyPosition(startPos);
  pathStackRef.current = [startPos];
  visitedRef.current = new Set([`${startPos.x},${startPos.y}`]);
}, []);

  const tryMoveEnemy = (currentPos) => {
    if(enemyDeadRef.current){return}
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
    if(enemyDeadRef.current){return}
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
      if(!powerPickRef.current){
      newMaze[playerPos.y][playerPos.x] = 4;}
      return newMaze;
    });
    if(!powerPickRef.current){
    setEnemyPosition(playerPos);
    setGameResult(false);
    setExitFound(true);
    setMoveDirection(null);
    }else if (powerPickRef.current){
       setScore((prev) => prev + 100)
      enemyDeadRef.current=true;
    }
  };

  const backtrack = () => {
    if(enemyDeadRef.current){return}
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
        let adjustedSpeed;
        if(enemyId===1){
        adjustedSpeed = 3;
      }
       else if(enemyId===2){
         adjustedSpeed = 3.5;
         if(playerAlert){
          adjustedSpeed = 1;
         }
       }else{
           adjustedSpeed = 2.5;
         }
    const moveInterval = setInterval(() => {
      const moved = tryMoveEnemy(enemyPosRef.current);
      if (!moved) backtrack();
    }, moveSpeed * adjustedSpeed);

    return () => clearInterval(moveInterval);
  }, [isAutoMoving, exitFound, moveSpeed, playerAlert]);

  return (
   <>
    {!enemyDeadRef.current && (
      <RenderEnemyMove 
        position={enemyPosition} 
        moveDirection={moveDirection}  
        cellDimensions={cellDimensions}
        maze={maze}
        enemyId={enemyId}
        isAlert={playerAlert}
      />
    )}
  </>
  );
}
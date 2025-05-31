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
  setScore,
  tick,
  playerPositionRef
}) {
  const [enemyPosition, setEnemyPosition] = useState({ x: 0, y: 0 });
  const [moveDirection, setMoveDirection] = useState("right");
  const [playerAlert, setPlayerAlert] = useState(false)
  const [moveRate, setMoveRate] = useState(6);
  
  // Refs para sincronização
  const pathStackRef = useRef([]);
  const visitedRef = useRef(new Set());
  const enemyPosRef = useRef(enemyPosition);
  const emenyPassRef = useRef(0)
  const enemyDeadRef = useRef(false)
  const jumpCooldownRef= useRef(false)
  const jumpCooldownStepRef= useRef(0)
  

   const cechkPlayerImpact = (currentPos) => {
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
      { posX: -1, PosY: 0 }, // esquerda
      { posX: 1, PosY: 0 },  // direita
      { posX: 0, PosY: -1 }, // cima
      { posX: 0, PosY: 1 }   // baixo
    ];
    if(playerAlert){
       emenyPassRef.current++
       if( emenyPassRef.current>80){
        setPlayerAlert(false)
       emenyPassRef.current=0}
    }
     for (const { posX, PosY } of directions) {
      const newX = currentPos.x + posX;
      const newY = currentPos.y + PosY;
      const key = `${newX},${newY}`;

      if(!playerAlert && enemyId === 2){
      if (currentMaze[newY]?.[newX] === 0 || currentMaze[newY]?.[newX] === 2) {
            let posX2 = posX;
            let PosY2 = PosY;
            while (currentMaze[currentPos.y + PosY2]?.[currentPos.x + posX2] === 0 || currentMaze[currentPos.y + PosY2]?.[currentPos.x + posX2] === 2) {
              if (currentMaze[currentPos.y + PosY2]?.[currentPos.x + posX2] === 2) {
                console.log("eedsasadasd")
                 setPlayerAlert(true)
                return;
                }
              
             
    
                   posX2 += posX;
                  PosY2 += PosY;
              }
           
          }
        }
  }
}


useEffect(() => {
          if(enemyDeadRef.current){return}
  if (enemyPosRef.current.x === playerPositionRef.current.x &&
    enemyPosRef.current.y === playerPositionRef.current.y){
    const currentMaze = mazeRef.current;
       setMaze(prevMaze => {
      const newMaze = prevMaze.map(row => [...row]);
      currentMaze[enemyPosRef.current.y][enemyPosRef.current.x] = 0;
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
  
      lookforplayer(enemyPosRef.current);
  
 
  cechkPlayerImpact (enemyPosRef.current);

}, [maze,enemyPosition,tick]); 
  useEffect(() => {
    enemyPosRef.current = enemyPosition;
  }, [enemyPosition]);

  // Inicializa a posição do inimigo
useEffect(() => {
  const currentMaze = mazeRef.current;
  const validPositions = [];
  let playerX = 0;
  let playerY = 0;

  // Encontra a posição do player (valor 2)
  for (let row = 0; row < currentMaze.length; row++) {
    for (let col = 0; col < currentMaze[row].length; col++) {
      if (currentMaze[row][col] === 2) {
        playerX = col;
        playerY = row;
      }
    }
  }

  // Filtra apenas posições válidas com distância >= 10 do player
  for (let row = 0; row < currentMaze.length; row++) {
    for (let col = 0; col < currentMaze[row].length; col++) {
      if (currentMaze[row][col] === 0) {
        const distance = Math.sqrt((col - playerX) ** 2 + (row - playerY) ** 2);
        if (distance >= 10) {
          validPositions.push({ x: col, y: row });
        }
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
    const currentMaze = mazeRef.current;
    const directions = [
      { posX: -1, PosY: 0 }, // esquerda
      { posX: 1, PosY: 0 },  // direita
      { posX: 0, PosY: -1 }, // cima
      { posX: 0, PosY: 1 }   // baixo
    ];
    cechkPlayerImpact (enemyPosRef.current)
          
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

    if(enemyId === 3 && jumpCooldownRef.current){
      jumpCooldownStepRef.current++;
      if(jumpCooldownStepRef.current>80){
        jumpCooldownStepRef.current=0;
        jumpCooldownRef.current=false;

      }
    }

    // Tenta mover em todas as direções
    for (const { posX, PosY } of directions) {
      const newX = currentPos.x + posX;
      const newY = currentPos.y + PosY;
      const key = `${newX},${newY}`;


      if (currentMaze[newY]?.[newX] === 2) {
        handlePlayerCaught({ x: newX, y: newY }, currentPos);
        return true;
      }


      if (currentMaze[newY]?.[newX] === 0 && !visitedRef.current.has(key)) {
        moveEnemy(currentPos, newX, newY, posX);
        return true;
      }
      
      
    }
    if (enemyId === 3 && !jumpCooldownRef.current) {
  for (const { posX, PosY } of directions) {
    const newX = currentPos.x + posX;
    const newY = currentPos.y + PosY;

    if (currentMaze[newY]?.[newX] === 1) { // Se for obstáculo, tenta pular
      const teleportY = newY + PosY;
      const teleportX = newX + posX;

      if (
        teleportY >= 0 && teleportY < currentMaze.length &&
        teleportX >= 0 && teleportX < currentMaze[0].length &&
        currentMaze[teleportY][teleportX] === 0 &&
        !visitedRef.current.has(`${teleportX},${teleportY}`)
      ) {
        moveEnemy(currentPos, teleportX, teleportY, posX);
        jumpCooldownRef.current = true;
        return true;
      }
    }
  }
}


    return false;
  };

  const moveEnemy = (currentPos, newX, newY, posX) => {
    // Atualiza a direção
    if (posX < 0) setMoveDirection("left");
    if (posX > 0) setMoveDirection("right");

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
    if (pathStackRef.current.length <= 1) {
      visitedRef.current = new Set();
      return;
    }
     cechkPlayerImpact (enemyPosRef.current)

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
  if (enemyId === 1) {
    setMoveRate(8);
  } else if (enemyId === 2) {
    setMoveRate(playerAlert ? 3 : 8);
  } else {
    setMoveRate(5);
  }
}, [enemyId, playerAlert]);

useEffect(() => {
   if(enemyDeadRef.current)return;
  if (!isAutoMoving || exitFound) return;

  if (tick % moveRate !== 0) return; // só se for o momento certo de agir
  cechkPlayerImpact(enemyPosRef.current)
  const moved = tryMoveEnemy(enemyPosRef.current);
  if (!moved) backtrack();
}, [tick, isAutoMoving, exitFound, moveRate]);

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
        jumpCooldownRef={jumpCooldownRef}
      />
    )}
  </>
  );
}
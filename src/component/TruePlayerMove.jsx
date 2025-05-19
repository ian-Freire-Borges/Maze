import React, { useState, useEffect, useRef } from 'react';
  import RenderPlayerMove from './RenderPlayerMove';
  import PlayerInteractiveObject from './PlayerInteractiveObject';


  export default function TruePlayerMove({ setScreen, setGameResult, maze, setMaze, setExitFound, exitFound, moveSpeed, isAutoMoving, cellDimensions, setScore,mazeRef,nivel,powerPickRef,tick,playerPositionRef}) {
    const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
    const [moveDirection, setMoveDirection] = useState(null);
    const [lastValidDirection, setLastValidDirection] = useState("down");
    const [moveRate, setMoveRate] = useState(3);
    
  
    const win= useRef(false);
    const back= useRef(false);
    const pathStackRef = useRef([]);
    const pathStackCloneRef = useRef([]);
    const enemyAlertRef = useRef(false);
    const visited = useRef(new Set());
    const superVisited = useRef(new Set());
    const playerPanic = useRef(false);
    const stepsInPanic = useRef(0);
    const stepOutOfPowerRef = useRef(0);
    const stepOutofPanic = useRef(0);
   



    useEffect(() => {
      const findInitialPosition = () => {
        const currentMaze = mazeRef.current;
        for (let row = 0; row < currentMaze.length; row++) {
          for (let col = 0; col < currentMaze[row].length; col++) {
            if (currentMaze[row][col] === 2) {
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


    useEffect(()=>{
     playerPositionRef.current=playerPosition;
    },
    [playerPosition])

    const tryMovePlayer = (currentPos) => {
      const currentMaze = mazeRef.current;
      const directions = [
        { dx: -1, dy: 0, dir: "left" },
        { dx: 1, dy: 0, dir: "right" },
        { dx: 0, dy: -1, dir: "up" },
        { dx: 0, dy: 1, dir: "down" }
      ];

     


       
      if(powerPickRef.current){
        stepOutOfPowerRef.current++
        if(stepOutOfPowerRef.current>55){
          powerPickRef.current = false;
          stepOutOfPowerRef.current = 0;
        }
      }
      
      for (let i = directions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [directions[i], directions[j]] = [directions[j], directions[i]];
      }
      const cellValue = currentMaze[currentPos.y][currentPos.x];

       if(cellValue===4 && !powerPickRef.current){
        win.current=false;
        setGameResult(true);
        setExitFound(true);
        setMoveDirection(null);
        return true;
      }

      if(!playerPanic.current && !powerPickRef.current){
      if (!enemyAlertRef.current) {
        for (const { dx, dy } of directions) {
          const newX = currentPos.x + dx;
          const newY = currentPos.y + dy;
          const key = `${newX},${newY}`; 

          
          if (currentMaze[newY]?.[newX] === 0 || currentMaze[newY]?.[newX] === 4) {
            let dx2 = dx;
            let dy2 = dy;
            while (currentMaze[currentPos.y + dy2]?.[currentPos.x + dx2] === 0 || currentMaze[currentPos.y + dy2]?.[currentPos.x + dx2] === 4) {
              if (currentMaze[currentPos.y + dy2]?.[currentPos.x + dx2] === 4) {
                console.log("🚨");
                if(back.current===true){
                  console.log("🚨alerta back panic");
                superVisited.current.clear();
                superVisited.current.add(key);
                superVisited.current.add(`${currentPos.x},${currentPos.y}`);
                playerPanic.current = true; 
                return;
                }else{
                  console.log("🚨 ALERTA! Inimigo detectado!");
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

       
        if (
          (!playerPanic.current && (currentMaze[newY]?.[newX] === 0 || currentMaze[newY]?.[newX] === 4 ) && !visited.current.has(key)) ||
          (playerPanic.current && currentMaze[newY]?.[newX] === 0 && !superVisited.current.has(key))
        )  
        {
          back.current=false
          console.log("front");
          if (enemyAlertRef.current) {
            const last = Array.from(visited.current).at(-1);
            if (last) {
              console.log("daletei utimo visited");
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
          return newMaze;
          });
            setPlayerPosition({ x: newX, y: newY });
            setMoveDirection(dir);
            setLastValidDirection(dir);
            pathStackRef.current = [...pathStackRef.current, { x: newX, y: newY }]; 
            visited.current.add(key);
            if(playerPanic.current){
              stepsInPanic.current++;
              superVisited.current.add(`${currentPos.x},${currentPos.y}`);
                if(stepsInPanic.current>=40){
                  superVisited.current.clear();
                  playerPanic.current=false;
                  stepOutofPanic.current=0;
                  console.log("saiu do panico")
                  stepsInPanic.current = 0;
                }
            }
       
          return true;
        }
      }
      if(playerPanic.current){
      stepOutofPanic.current++
      }
      return false;
    };

    const backtrack = () => {
      const currentMaze = mazeRef.current;
      back.current=true;
       
        if(currentMaze[playerPositionRef.current.y][playerPositionRef.current.x]===4 && !powerPickRef.current){
          win.current=false;
          setGameResult(true);
          setExitFound(true);
          setMoveDirection(null);
          return true;
        }
      if(playerPanic.current){   
        if(stepOutofPanic.current!=stepsInPanic.current){
          superVisited.current.clear();
          playerPanic.current=false
          console.log("saiu do panico no back")
          stepsInPanic.current = 0;
          stepOutofPanic.current = 0;
        }
        return ;
      }
      console.log("back ativado")
      if (pathStackRef.current.length < 1) {
        visited.current.clear();
        console.log("🚨🚨🚨🚨🚨🚨todas visited linpo")
        return;
      }

      let newPath, prevPos;

      if (enemyAlertRef.current) {
        console.log("alerta ativado no back")
        newPath = pathStackCloneRef.current.slice(0, -1);
        if (newPath.length === 0) {
          enemyAlertRef.current = false
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

      
      console.log("back ativado")
    
      const dx = prevPos.x - playerPositionRef.current.x;
      const dy = prevPos.y - playerPositionRef.current.y;
      

      let dir = null;
      if (dx === -1) dir = "left";
      else if (dx === 1) dir = "right";
      else if (dy === -1) dir = "up";
      else if (dy === 1) dir = "down";


    if(enemyAlertRef.current && currentMaze[prevPos.y][prevPos.x]  ){
      playerPanic.current=true;
      superVisited.current.clear();
      superVisited.current.add(`${prevPos.y},${prevPos.x}`);
      superVisited.current.add(`${playerPositionRef.current.y},${playerPositionRef.current.x}`);
    } else{
      setPlayerPosition(prevPos);
      setMoveDirection(dir);
      setLastValidDirection(dir);

      setMaze(prevMaze => {
        const newMaze = prevMaze.map(row => [...row]);
        newMaze[playerPositionRef.current.y][playerPositionRef.current.x] = 0;
        newMaze[prevPos.y][prevPos.x] = 2;
        return newMaze;
      });
    }
      return ;
    };

 useEffect(() => {
  if (!isAutoMoving) return;

  if (exitFound) {
    enemyAlertRef.current = false;
    playerPanic.current = false;
    superVisited.current.clear();

    if (win.current) {
      setScreen("WINNER");
    } else {
      setScreen("END");
    }

    return;
  }

  // Executa a cada `moveRate` ticks
  if (tick % moveRate !== 0) return;


  const moved = tryMovePlayer(playerPositionRef.current);
  if (!moved) {
    backtrack();
  }
}, [tick, isAutoMoving, exitFound, moveRate]);

    return (
      <>
        <RenderPlayerMove
          position={playerPosition}
          moveDirection={moveDirection}
          lastDirection={lastValidDirection}
          isAlert={enemyAlertRef.current}
          isPanic={playerPanic.current}
          cellDimensions={cellDimensions}
          maze={maze}
          powerPickRef={powerPickRef}
          nivel={nivel}
        />
        <PlayerInteractiveObject
        maze={maze}
        playerPosition={playerPosition}
        cellDimensions={cellDimensions}
        setScore={setScore}
        nivel={nivel}
        setExitFound={setExitFound}
        win={win}
        powerPickRef={powerPickRef}
        stepOutOfPowerRef={stepOutOfPowerRef}
        />
      </>
    );
  } 
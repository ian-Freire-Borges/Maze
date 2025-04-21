import React, { useState, useEffect, useRef } from 'react';
import RenderPlayerMove from './RenderPlayerMove';
import "./TruePlayerMove.css";
import pause from "../assets/pause.png";
import play from "../assets/play.png";
import speedUp from "../assets/speedup.png";
import TrueEnemyMove from './TrueEnemyMove';

export default function TruePlayerMove({ setScreen, mazeLayout, setGameResult  }) {
  const [playerPosition, setPlayerPosition] = useState([], []);
  const [maze, setMaze] = useState(mazeLayout);
  const [isAutoMoving, setIsAutoMoving] = useState(false);
  const [exitFound, setExitFound] = useState(false);
  const [moveDirection, setMoveDirection] = useState(null);
  const [lastValidDirection, setLastValidDirection] = useState("down");
  const [pathStack, setPathStack] = useState([]);
  const [moveSpeed, setMoveSpeed] = useState(300);
  const [playAgain, setPlayAgain] = useState(false);
  const [pathStackClone, setPathStackClone] = useState([]);

  const enemyAlertRef = useRef(false);
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
    if(maze[currentPos.y][currentPos.x]===4){
      setGameResult(false);
      setExitFound(true);
        setMoveDirection(null);
        return true;
    }
    else if(maze[currentPos.y][currentPos.x]===3){
      setGameResult(true);
      setExitFound(true);
        setMoveDirection(null);
        return true;
    }
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
              console.log("🚨 2 ALERTA! Inimigo detectado!");
              visited.current.add(key);
              enemyAlertRef.current = true;
              setPathStackClone(pathStack);
            }
            dx2 += dx;
            dy2 += dy;
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
      if (maze[newY]?.[newX] === 4) {
        setGameResult(false);
        setExitFound(true);
        setMoveDirection(null);
        return true;
      }

      if (maze[newY]?.[newX] === 0 && !visited.current.has(key)) {
        if (enemyAlertRef.current) {
          const last = Array.from(visited.current).at(-1);
          if (last) {
            visited.current.delete(last);
          }
          setPathStackClone([]);
        }
        enemyAlertRef.current = false;

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

    let newPath, prevPos;

    if (enemyAlertRef.current) {
      newPath = pathStackClone.slice(0, -1);
      if (newPath.length <= 1) {
        visited.current.clear();
        return;}
      prevPos = newPath[newPath.length - 1];
      setPathStack(prev => [...prev, { x: prevPos.x, y: prevPos.y }]);
      setPathStackClone(newPath);
    } else {
      newPath = pathStack.slice(0, -1);
      prevPos = newPath[newPath.length - 1];
      setPathStack(newPath);
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

    setMaze(prevMaze => {
      const newMaze = prevMaze.map(row => [...row]);
      newMaze[playerPosition.y][playerPosition.x] = 0;
      newMaze[prevPos.y][prevPos.x] = 2;
      return newMaze;
    });
  };

  useEffect(() => {
    if (!isAutoMoving || exitFound) {
      if (exitFound) {
        setTimeout(() => setScreen("END"), 300);
      }
      return;
    }

    const moveInterval = setInterval(() => {
      const moved = tryMovePlayer(playerPosition);
      if (!moved) {
        backtrack();
      }
    }, moveSpeed);

    return () => clearInterval(moveInterval);
  }, [isAutoMoving, playerPosition, exitFound, pathStack]);

  return (
    <div className='container-total'>
      <div style={{ position: 'absolute', top: -50, left: -80 }} className='container-button'>
        <div className='coitaner-for-mov'>
          <button disabled={isAutoMoving} onClick={() => {
            setIsAutoMoving(true);
            setExitFound(false);
            if (!playAgain) {
              setPathStack([playerPosition]);
              visited.current = new Set([`${playerPosition.x},${playerPosition.y}`]);
            }
          }}>
            Iniciar Movimento Automático <img src={play} />
          </button>
          <button onClick={() => {
            setPlayAgain(true);
            setIsAutoMoving(false);
            setMoveDirection(null);
          }} style={{ marginLeft: '10px' }} disabled={!isAutoMoving}>
            Parar <img src={pause} />
          </button>
        </div>
        <button onClick={() => {
          setMoveSpeed(prev => {
            if (prev === 300) return 150;
            if (prev === 150) return 100;
            if (prev === 100) return 50;
            if (prev === 50) return 25;
            return 300;
          });
        }}>
          Velocidade: {moveSpeed === 300 ? "1x" : moveSpeed === 150 ? "2x" : moveSpeed === 100 ? '3x' : moveSpeed === 50 ? '4x' : '5x'} <img src={speedUp} />
        </button>
      </div>
      <RenderPlayerMove
        position={playerPosition}
        moveDirection={moveDirection}
        lastDirection={lastValidDirection}
      />
      <TrueEnemyMove
        setMaze={setMaze}
        maze={maze}
        exitFound={exitFound}
        moveSpeed={moveSpeed}
        isAutoMoving={isAutoMoving}
        setExitFound={setExitFound}
      />
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react'; 
import MazeRender from "../component/MazeRender";
import TruePlayerMove from '../component/TruePlayerMove';
import "./MazePage.css";
import pause from "../assets/pause.png";
import play from "../assets/play.png";
import speedUp from "../assets/speedup.png";
import TrueEnemyMove from '../component/TrueEnemyMove';
import volta from "../assets/voltar.png";

export default function MazePage({ mazeLayout, setScreen, setGameResult, nivel, setScore, score, devMode }) {
  const [maze, setMaze] = useState(mazeLayout);
  const [exitFound, setExitFound] = useState(false);
  const [moveSpeed, setMoveSpeed] = useState(150);
  const [isAutoMoving, setIsAutoMoving] = useState(false);
  const mazeWrapperRef = useRef();
  const [cellDimensions, setCellDimensions] = useState({ });
  const [mazeReady, setMazeReady] = useState(false);
  const mazeRef = useRef(maze);
  const [dynamicSize, setDynamicSize] = useState(null);
  const powerPickRef = useRef(false);
  const [tick, setTick] = useState(0);
 const playerPositionRef = useRef([]);

useEffect(() => {
  if (!isAutoMoving || exitFound) return;

  const interval = setInterval(() => {
    setTick((prev) => prev + 1);
  }, moveSpeed); 

  return () => clearInterval(interval);
}, [isAutoMoving, exitFound,moveSpeed]);

  useEffect(() => {
    mazeRef.current = maze;
  }, [maze]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMazeReady(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  

  // Calcula tamanho ideal com base em maze n x n
  useEffect(() => {
    const updateSize = () => {
      const rows = maze.length;
      const cols = maze[0]?.length || 1;
      let maxHeight;
      let maxWidth ;
      if(window.innerWidth <= 450 ){
          maxHeight = window.innerHeight * 0.9;
          maxWidth = window.innerWidth * 0.9;
      }else{
      maxWidth = window.innerWidth * 1;
      maxHeight = window.innerHeight * 0.8;
      }

      const cellWidth = Math.floor(maxWidth / cols);
      const cellHeight = Math.floor(maxHeight / rows);
      const optimalCellSize = Math.min(cellWidth, cellHeight);

      const finalWidth = optimalCellSize * cols;
      const finalHeight = optimalCellSize * rows;

      setDynamicSize({ width: finalWidth, height: finalHeight });
      setCellDimensions({ cellWidth: optimalCellSize, cellHeight: optimalCellSize });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className='total-maze'>
      <div className='container-button'>
        <div className='coitaner-for-mov'>
          <button disabled={isAutoMoving} onClick={() => {
            setIsAutoMoving(true);
            setExitFound(false);
          }}>
            <img src={play} />
          </button>
          <button onClick={() => setIsAutoMoving(false)} disabled={!isAutoMoving}>
            <img src={pause} />
          </button>
          <button className="speed-button" onClick={() => {
            setMoveSpeed(prev => {
              if (prev === 150) return 70;
              if (prev === 70) return 40;
              if (devMode) {
                if (prev === 40) return 25;
                if (prev === 25) return 15;
              }
              return 150;
            });
          }}>
            <img src={speedUp} />
          </button>
          <span className="speed-text">
            {moveSpeed === 150 ? "1x" : moveSpeed === 70 ? "2x" : moveSpeed === 40 ? '3x' : moveSpeed === 25 ? '4x' : '5x'}
          </span>
        </div>
        <button className="back-button" onClick={() => setScreen("MENU")}>
          <img src={volta} />
        </button>
      </div>

      <div
        className="maze-wrapper"
        ref={mazeWrapperRef}
        style={dynamicSize ? {
          width: `${dynamicSize.width}px`,
          height: `${dynamicSize.height}px`
        } : {}}
      >
        <MazeRender
          mazeLayout={maze}
          wrapperRef={mazeWrapperRef}
          nivel={nivel}
        />

        {mazeReady && (
          <TruePlayerMove
            setScreen={setScreen}
            setGameResult={setGameResult}
            maze={maze}
            setMaze={setMaze}
            setExitFound={setExitFound}
            exitFound={exitFound}
            moveSpeed={moveSpeed}
            isAutoMoving={isAutoMoving}
            cellDimensions={cellDimensions}
            setScore={setScore}
            mazeRef={mazeRef}
            nivel={nivel}
            powerPickRef={powerPickRef}
             tick={tick}
             playerPositionRef={playerPositionRef}
          />
        )}

        {mazeReady && (nivel === 1)&& (
          <>

          <TrueEnemyMove
            key="enemy1"
            setMaze={setMaze}
            maze={maze}
            exitFound={exitFound}
            moveSpeed={moveSpeed}
            isAutoMoving={isAutoMoving}
            setExitFound={setExitFound}
            setGameResult={setGameResult}
            cellDimensions={cellDimensions}
            mazeRef={mazeRef}
            enemyId={1}
            powerPickRef={powerPickRef}
            setScore={setScore}
            tick={tick}
            playerPositionRef={playerPositionRef}
          />

           <TrueEnemyMove
            key="enemy1b"
            setMaze={setMaze}
            maze={maze}
            exitFound={exitFound}
            moveSpeed={moveSpeed}
            isAutoMoving={isAutoMoving}
            setExitFound={setExitFound}
            setGameResult={setGameResult}
            cellDimensions={cellDimensions}
            mazeRef={mazeRef}
            enemyId={1}
            powerPickRef={powerPickRef}
            setScore={setScore}
             tick={tick}
             playerPositionRef={playerPositionRef}
          />
          <TrueEnemyMove
            key="enemy1sdb"
            setMaze={setMaze}
            maze={maze}
            exitFound={exitFound}
            moveSpeed={moveSpeed}
            isAutoMoving={isAutoMoving}
            setExitFound={setExitFound}
            setGameResult={setGameResult}
            cellDimensions={cellDimensions}
            mazeRef={mazeRef}
            enemyId={1}
            powerPickRef={powerPickRef}
            setScore={setScore}
             tick={tick}
             playerPositionRef={playerPositionRef}
          />
            <TrueEnemyMove
            key="enemy1bsd"
            setMaze={setMaze}
            maze={maze}
            exitFound={exitFound}
            moveSpeed={moveSpeed}
            isAutoMoving={isAutoMoving}
            setExitFound={setExitFound}
            setGameResult={setGameResult}
            cellDimensions={cellDimensions}
            mazeRef={mazeRef}
            enemyId={1}
            powerPickRef={powerPickRef}
            setScore={setScore}
             tick={tick}
             playerPositionRef={playerPositionRef}
          />


          </>
        )}

        {mazeReady && (nivel ===2 ) && (
          <>
            <TrueEnemyMove
            key="enemy1c"
            setMaze={setMaze}
            maze={maze}
            exitFound={exitFound}
            moveSpeed={moveSpeed}
            isAutoMoving={isAutoMoving}
            setExitFound={setExitFound}
            setGameResult={setGameResult}
            cellDimensions={cellDimensions}
            mazeRef={mazeRef}
            enemyId={1}
            powerPickRef={powerPickRef}
            setScore={setScore}
             tick={tick}
             playerPositionRef={playerPositionRef}
          />

          <TrueEnemyMove
            key="enemy2"
            setMaze={setMaze}
            maze={maze}
            exitFound={exitFound}
            moveSpeed={moveSpeed}
            isAutoMoving={isAutoMoving}
            setExitFound={setExitFound}
            setGameResult={setGameResult}
            cellDimensions={cellDimensions}
            mazeRef={mazeRef}
            enemyId={2}
            powerPickRef={powerPickRef}
            setScore={setScore}
             tick={tick}
             playerPositionRef={playerPositionRef}
          />

          <TrueEnemyMove
            key="enemy2f"
            setMaze={setMaze}
            maze={maze}
            exitFound={exitFound}
            moveSpeed={moveSpeed}
            isAutoMoving={isAutoMoving}
            setExitFound={setExitFound}
            setGameResult={setGameResult}
            cellDimensions={cellDimensions}
            mazeRef={mazeRef}
            enemyId={2}
            powerPickRef={powerPickRef}
            setScore={setScore}
             tick={tick}
             playerPositionRef={playerPositionRef}
          />

          <TrueEnemyMove
            key="enemy2b"
            setMaze={setMaze}
            maze={maze}
            exitFound={exitFound}
            moveSpeed={moveSpeed}
            isAutoMoving={isAutoMoving}
            setExitFound={setExitFound}
            setGameResult={setGameResult}
            cellDimensions={cellDimensions}
            mazeRef={mazeRef}
            enemyId={2}
            powerPickRef={powerPickRef}
            setScore={setScore}
             tick={tick}
             playerPositionRef={playerPositionRef}
          />

          <TrueEnemyMove
            key="enemy2c"
            setMaze={setMaze}
            maze={maze}
            exitFound={exitFound}
            moveSpeed={moveSpeed}
            isAutoMoving={isAutoMoving}
            setExitFound={setExitFound}
            setGameResult={setGameResult}
            cellDimensions={cellDimensions}
            mazeRef={mazeRef}
            enemyId={2}
            powerPickRef={powerPickRef}
            setScore={setScore}
            tick={tick}
            playerPositionRef={playerPositionRef}
          />

          </>
        )}
        {mazeReady && nivel === 3 && (
          <>
          <TrueEnemyMove
            key="enemy3"
            setMaze={setMaze}
            maze={maze}
            exitFound={exitFound}
            moveSpeed={moveSpeed}
            isAutoMoving={isAutoMoving}
            setExitFound={setExitFound}
            setGameResult={setGameResult}
            cellDimensions={cellDimensions}
            mazeRef={mazeRef}
            enemyId={3}
            powerPickRef={powerPickRef}
            setScore={setScore}
             tick={tick}
             playerPositionRef={playerPositionRef}
          />

           <TrueEnemyMove
            key="enemy3b"
            setMaze={setMaze}
            maze={maze}
            exitFound={exitFound}
            moveSpeed={moveSpeed}
            isAutoMoving={isAutoMoving}
            setExitFound={setExitFound}
            setGameResult={setGameResult}
            cellDimensions={cellDimensions}
            mazeRef={mazeRef}
            enemyId={3}
            powerPickRef={powerPickRef}
            setScore={setScore}
             tick={tick}
             playerPositionRef={playerPositionRef}
          />

             <TrueEnemyMove
            key="enemy3c"
            setMaze={setMaze}
            maze={maze}
            exitFound={exitFound}
            moveSpeed={moveSpeed}
            isAutoMoving={isAutoMoving}
            setExitFound={setExitFound}
            setGameResult={setGameResult}
            cellDimensions={cellDimensions}
            mazeRef={mazeRef}
            enemyId={3}
            powerPickRef={powerPickRef}
            setScore={setScore}
             tick={tick}
             playerPositionRef={playerPositionRef}
          />

            <TrueEnemyMove
            key="enemy3d"
            setMaze={setMaze}
            maze={maze}
            exitFound={exitFound}
            moveSpeed={moveSpeed}
            isAutoMoving={isAutoMoving}
            setExitFound={setExitFound}
            setGameResult={setGameResult}
            cellDimensions={cellDimensions}
            mazeRef={mazeRef}
            enemyId={3}
            powerPickRef={powerPickRef}
            setScore={setScore}
             tick={tick}
             playerPositionRef={playerPositionRef}
          />

           <TrueEnemyMove
            key="enemy3e"
            setMaze={setMaze}
            maze={maze}
            exitFound={exitFound}
            moveSpeed={moveSpeed}
            isAutoMoving={isAutoMoving}
            setExitFound={setExitFound}
            setGameResult={setGameResult}
            cellDimensions={cellDimensions}
            mazeRef={mazeRef}
            enemyId={3}
            powerPickRef={powerPickRef}
            setScore={setScore}
             tick={tick}
             playerPositionRef={playerPositionRef}
          />

          
          <TrueEnemyMove
            key="enemy1d"
            setMaze={setMaze}
            maze={maze}
            exitFound={exitFound}
            moveSpeed={moveSpeed}
            isAutoMoving={isAutoMoving}
            setExitFound={setExitFound}
            setGameResult={setGameResult}
            cellDimensions={cellDimensions}
            mazeRef={mazeRef}
            enemyId={1}
            powerPickRef={powerPickRef}
            setScore={setScore}
             tick={tick}
             playerPositionRef={playerPositionRef}
          />

          </>
        
        )}
        {mazeReady && nivel===4 && (
          <>
          <TrueEnemyMove
            key="enemy4"
            setMaze={setMaze}
            maze={maze}
            exitFound={exitFound}
            moveSpeed={moveSpeed}
            isAutoMoving={isAutoMoving}
            setExitFound={setExitFound}
            setGameResult={setGameResult}
            cellDimensions={cellDimensions}
            mazeRef={mazeRef}
            enemyId={2}
            powerPickRef={powerPickRef}
            setScore={setScore}
            tick={tick}
            playerPositionRef={playerPositionRef}
          />
             <TrueEnemyMove
            key="enemy5"
            setMaze={setMaze}
            maze={maze}
            exitFound={exitFound}
            moveSpeed={moveSpeed}
            isAutoMoving={isAutoMoving}
            setExitFound={setExitFound}
            setGameResult={setGameResult}
            cellDimensions={cellDimensions}
            mazeRef={mazeRef}
            enemyId={2}
            powerPickRef={powerPickRef}
            setScore={setScore}
            tick={tick}
            playerPositionRef={playerPositionRef}
          />
          </>
        )}
      </div>
    </div>
  );
}

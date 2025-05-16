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
  const [moveSpeed, setMoveSpeed] = useState(300);
  const [isAutoMoving, setIsAutoMoving] = useState(false);
  const mazeWrapperRef = useRef();
  const [cellDimensions, setCellDimensions] = useState({ });
  const [mazeReady, setMazeReady] = useState(false);
  const mazeRef = useRef(maze);
  const [dynamicSize, setDynamicSize] = useState(null);
  const powerPickRef = useRef(false);


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
      maxHeight = window.innerHeight * 0.64;
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
  }, [maze]);

  return (
    <>
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
              if (prev === 300) return 150;
              if (prev === 150) return 100;
              if (devMode) {
                if (prev === 100) return 50;
                if (prev === 50) return 25;
              }
              return 300;
            });
          }}>
            <img src={speedUp} />
          </button>
          <span className="speed-text">
            {moveSpeed === 300 ? "1x" : moveSpeed === 150 ? "2x" : moveSpeed === 100 ? '3x' : moveSpeed === 50 ? '4x' : '5x'}
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
          />
        )}

        {mazeReady && (nivel !== 0 && nivel !== 4)&& (
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
          />
          </>
        )}

        {mazeReady && (nivel ===2 || nivel===4) && (
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
          />
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
          />

           <TrueEnemyMove
            key="enemyb3"
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
          />
          </>
        )}
      </div>
    </>
  );
}

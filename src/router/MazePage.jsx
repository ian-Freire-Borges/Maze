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
  const [cellDimensions, setCellDimensions] = useState({ cellWidth: 20, cellHeight: 20 });
  const [mazeReady, setMazeReady] = useState(false);
  const mazeRef = useRef(maze);
  const [dynamicSize, setDynamicSize] = useState(null);

  const handleCellDimensionsChange = (newDimensions) => {
    setCellDimensions(newDimensions);
  };

  useEffect(() => {
    mazeRef.current = maze;
  }, [maze]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMazeReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateSize = () => {
      let divider;
      let width = window.innerWidth * 0.76;
      let height = window.innerHeight;

      if (window.innerWidth > 450) {
        if (nivel === 1) divider = 48.93617021276596;
        else if (nivel === 2) divider = 49.01960784313725;
        else if (nivel === 3) divider = 49.15254237288136;
        else divider = 49.20634920634921;

        setDynamicSize({
          width: width,
          height: width * (divider / 100),
        });
      } else {
        height = window.innerHeight * 0.9;
        if (nivel === 1) divider = 51.5151;
        else if (nivel === 2) divider = 51.;
        else if (nivel === 3) divider = 52.9411;
        else {
                divider = 54.3859649122807
        }

        setDynamicSize({
          height: height,
          width: height * (divider / 100),
        });
      }
    };

    updateSize(); // chama ao montar
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [nivel]);

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
          onCellDimensionsChange={handleCellDimensionsChange}
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
          />
        )}

        {mazeReady && nivel !== 0 && (
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
          />
        )}

        {mazeReady && nivel === 2 && (
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
          />
        )}
      </div>
    </>
  );
}

import React from 'react';
import { useState } from 'react';
import MazeRender from "../component/MazeRender";
import TruePlayerMove from '../component/TruePlayerMove';
import "./MazePage.css"
import pause from "../assets/pause.png";
import play from "../assets/play.png";
import speedUp from "../assets/speedup.png";
import TrueEnemyMove from '../component/TrueEnemyMove';

export default function MazePage({ mazeLayout, setScreen, setGameResult,nivel}) {
  const [maze, setMaze] = useState(mazeLayout);
  const [exitFound, setExitFound] = useState(false);
  const [moveSpeed, setMoveSpeed] = useState(300);
  const [isAutoMoving, setIsAutoMoving] = useState(false);
  return (
    <>
      
      <div  className='container-button'>
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
        </div>
        
        <button className="speed-button" onClick={() => {
          setMoveSpeed(prev => {
            if (prev === 300) return 150;
            if (prev === 150) return 100;
            if (prev === 100) return 50;
            if (prev === 50) return 25;
            return 300;
          });
        }}>
          {moveSpeed === 300 ? "1x" : moveSpeed === 150 ? "2x" : moveSpeed === 100 ? '3x' : moveSpeed === 50 ? '4x' : '5x'} <img src={speedUp} />
        </button>
        <button 
          className="back-button"
          onClick={() => setScreen("MENU")}
        >
          Voltar ao Menu
        </button>
      </div>
      <div className="maze-wrapper">
      <MazeRender mazeLayout={maze}/>
      <TruePlayerMove 
        setScreen={setScreen}  
        setGameResult={setGameResult}  
        maze={maze} 
        setMaze={setMaze} 
        setExitFound={setExitFound} 
        exitFound={exitFound} 
        moveSpeed={moveSpeed} 
        isAutoMoving={isAutoMoving}
      />
      

      {nivel != 1 && (
        <TrueEnemyMove
          setMaze={setMaze}
          maze={maze}
          exitFound={exitFound}
          moveSpeed={moveSpeed}
          isAutoMoving={isAutoMoving}
          setExitFound={setExitFound}
          setGameResult={setGameResult}
        />
      )}
      </div>
      </>
  );
}
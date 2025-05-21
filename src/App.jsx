import { useState, useRef, useEffect } from 'react'; 
import Menu from './router/Menu';
import './App.css';
import menuImage from './assets/tilesetOpenGameBackground.png';
import cristal from "./assets/caveRemasteredV7.png"
import lavacave from "./assets/lavacave.jpg"
import End from './router/End';
import useMaze from "./component/MazeMap"
import MazePage from './router/MazePage';
import Win from './router/Win';
import florestimage from './assets/6271267.jpg'
import winerimg from './assets/freepik__pixel-art-background-for-a-victory-screen-confetti__20051.png'
import ScoreBoard from './router/ScoreBoard';
import iceimg from './assets/5.png'


function App() { 
  const [nivel, setNivel] = useState(1);
  const { mazeLayout, gerarNovoMaze } = useMaze(nivel);
  const [mazeKey, setMazeKey] = useState(0);
  const [screen, setScreen] = useState('MENU');
  const [gameResult, setGameResult] = useState(null);
  const [score, setScore] = useState(0);
  const [devMode, setDevMove] = useState(false);
  const [levelCheck, setLevelCheck] = useState(false);
  const [infinityMode, setInfinityMode] = useState( localStorage.getItem("infinityMode") === "true");
  const [trueInfinityMode, setTrueInfinityMode] = useState(false);
  const [progressoInfinito, setProgressoInfinito] = useState(0);

  useEffect (()=>{
     if (levelCheck) {
    setInfinityMode(true);
    localStorage.setItem("infinityMode", "true"); // Armazena no localStorage
  } 
  },[levelCheck])
 

  const getBackgroundImage = () => {
    if (levelCheck) return winerimg;
    if (screen === 'SCORE') return menuImage;
    if (!devMode && screen === 'MENU') return menuImage;
    
    switch(nivel) {
      case 2: return cristal;
      case 3: return lavacave;
      case 4: return iceimg;
      case 1: return (devMode || screen !== 'MENU') ? florestimage : menuImage;
      default: return menuImage;
    }
  };

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(${getBackgroundImage()})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      {screen === 'MENU' && (<Menu setScreen={setScreen} setMazeKey={setMazeKey} gerarNovoMaze={gerarNovoMaze} setNivel={setNivel} nivel={nivel} setScore={setScore} setDevMove={setDevMove} devMode={devMode} infinityMode={infinityMode} trueInfinityMode={trueInfinityMode} setTrueInfinityMode={setTrueInfinityMode}setProgressoInfinito={setProgressoInfinito}/>)}
      {screen === 'MAZE' && (<div key={mazeKey}><MazePage mazeLayout={mazeLayout} setScreen={setScreen} setGameResult={setGameResult} nivel={nivel} setScore={setScore} score={score} devMode={devMode}/></div>)}
      {screen === 'END' && (<End setScreen={setScreen} gameResult={gameResult} score={score} trueInfinityMode={trueInfinityMode} nivel={nivel} progressoInfinito={progressoInfinito}/>)}
      {screen === 'WINNER' && (<Win setScreen={setScreen} gameResult={gameResult} score={score} nivel={nivel} setNivel={setNivel}setMazeKey={setMazeKey} gerarNovoMaze={gerarNovoMaze} levelCheck={levelCheck} setLevelCheck={setLevelCheck} trueInfinityMode={trueInfinityMode} progressoInfinito={progressoInfinito} setProgressoInfinito={setProgressoInfinito}/>)}
      {screen === "SCORE" && <ScoreBoard setScreen={setScreen}/>}
    </div>
  );
}

export default App;
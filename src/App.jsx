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
  const [devMode, setDevMove] = useState()
  const [levelCheck , setLevelCheck] = useState(false);
  const [infinityMode, setInfinityMode] = useState(true);
  
  useEffect(() => {
  if (levelCheck) {
    setInfinityMode(true);
  }
}, [levelCheck]);

  const cellSize = 20;
   let backgroundImage =menuImage;
  if(levelCheck){
     backgroundImage = winerimg;
  }
  else if(screen === 'SCORE'){
    backgroundImage=menuImage
  }
  else if(!devMode &&  screen === 'MENU'){
      backgroundImage =menuImage
  }
  else if(nivel === 2){
    backgroundImage = cristal;
  }else if(nivel === 3 ){
     backgroundImage = lavacave ;
  }else if(nivel === 4 ){
    backgroundImage = iceimg
  }else if((devMode && nivel === 1)||(nivel === 1 && screen != 'MENU')){
    backgroundImage = florestimage
  }

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      {screen === 'MENU' && <Menu setScreen={setScreen} setMazeKey={setMazeKey} gerarNovoMaze={gerarNovoMaze} setNivel={setNivel} nivel={nivel} setScore={setScore} setDevMove={setDevMove} devMode={devMode} infinityMode={infinityMode}/>}
      {screen === 'MAZE' && (
        <div key={mazeKey}>
          <MazePage 
            mazeLayout={mazeLayout}  
            setScreen={setScreen} 
            setGameResult={setGameResult}
            nivel={nivel}
            setScore={setScore}
            score={score}
            devMode={devMode}
          />
        </div>
      )}
      {screen === 'END' && <End setScreen={setScreen} gameResult={gameResult} score={score}/>}
      {screen === 'WINNER' && <Win setScreen={setScreen} gameResult={gameResult} score={score} nivel={nivel} setNivel={setNivel}setMazeKey={setMazeKey} gerarNovoMaze={gerarNovoMaze} levelCheck={levelCheck} setLevelCheck={setLevelCheck}/>}
      {screen === "SCORE" && <ScoreBoard setScreen={setScreen}/>}
    </div>
  );
}

export default App;
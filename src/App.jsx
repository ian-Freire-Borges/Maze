import { useState } from 'react';
import MazeRender from './component/MazeRender';
import TruePlayerMove from './component/TruePlayerMove';
import Menu from './router/Menu';
import './App.css';
import backgroundImage from './assets/tilesetOpenGameBackground.png';
import End from './router/End';
import useMaze from "./component/MazeMap"
import MazePage from './router/MazePage';


function App() { 
  const [nivel, setNivel] = useState(1);
  const { mazeLayout, gerarNovoMaze } = useMaze(nivel);
  const [mazeKey, setMazeKey] = useState(0);
  const [screen, setScreen] = useState('MENU');
  const [gameResult, setGameResult] = useState(null);
  const [score, setScore] = useState(0);
  
  const cellSize = 20;

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      {screen === 'MENU' && <Menu setScreen={setScreen} setMazeKey={setMazeKey} gerarNovoMaze={gerarNovoMaze} setNivel={setNivel} nivel={nivel} />}
      {screen === 'MAZE' && (
        <div key={mazeKey}>
          <MazePage 
            mazeLayout={mazeLayout}  
            setScreen={setScreen} 
            setGameResult={setGameResult}
            nivel={nivel}
            setScore={setScore}
            score={score}
          />
        </div>
      )}
      {screen === 'END' && <End setScreen={setScreen} gameResult={gameResult} score={score}/>}
    </div>
  );
}

export default App;
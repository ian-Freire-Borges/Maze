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
  const { mazeLayout, gerarNovoMaze } = useMaze();
  const [mazeKey, setMazeKey] = useState(0);
  const [screen, setScreen] = useState('MENU');
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
      {screen === 'MENU' && <Menu setScreen={setScreen} setMazeKey={setMazeKey} gerarNovoMaze={gerarNovoMaze} />}
      {screen === 'MAZE' && (
        <div key={mazeKey}>
          <MazePage mazeLayout={mazeLayout}  setScreen={setScreen} />
        </div>
      )}
      {screen === 'END' && <End setScreen={setScreen} />}
    </div>
  );
}

export default App;
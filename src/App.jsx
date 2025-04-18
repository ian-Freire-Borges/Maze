import { useState } from 'react';
import MazeRender from './component/MazeRender';
import TruePlayerMove from './component/TruePlayerMove';
import Menu from './component/Menu';
import './App.css';
import backgroundImage from './assets/tilesetOpenGameBackground.png';
import End from "./component/End"

function App() {
  const [mazeKey, setMazeKey] = useState(0);
  const [screen, setScreen] = useState('MENU');
  const cellSize = 20;

  return (
    <div
      className='app-container'
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      {screen === 'MENU' && <Menu setScreen={setScreen} />}

      {screen === 'MAZE' && (
        <div className="maze-wrapper" key={mazeKey}>
          <MazeRender />
          <TruePlayerMove setScreen={setScreen}/>
        </div>
      )}

      {screen === 'END' && <End setScreen={setScreen} />}
    </div>
  );
}

export default App;
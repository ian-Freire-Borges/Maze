import { useState } from 'react'
import MazeRender from './component/MazeRender';
import './App.css'
import backgroundImage from './assets/tilesetOpenGameBackground.png';
import TruePlayerMove from './component/TruePlayerMove';



function App() {
  const cellSize = 20;
  

  return (
    <div className='app-container' style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    }}>
      <h2>Maze</h2>
      <div className="maze-wrapper">
        <MazeRender/>
        <TruePlayerMove/>
       
      </div>

    </div>
    
  )
}

export default App

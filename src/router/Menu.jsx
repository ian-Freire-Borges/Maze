import React from 'react';
function Menu({ setScreen, setMazeKey, gerarNovoMaze }) { 
  return (
    <div>
      Menu
      <button onClick={() => {
        gerarNovoMaze(); 
        setScreen("MAZE");
        setMazeKey(prevKey => prevKey + 1); 
      }}>
        Iniciar Maze
      </button>
    </div>
  );
}

export default Menu;
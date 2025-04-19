import React from 'react';
import './Menu.css'; // <-- adiciona isso

function Menu({ setScreen, setMazeKey, gerarNovoMaze }) { 
  return (
    <div className="menu-container">
      <h1 className="menu-title">Maze Game</h1>
      <button
        className="menu-button"
        onClick={() => {
          gerarNovoMaze(); 
          setScreen("MAZE");
          setMazeKey(prevKey => prevKey + 1); 
        }}
      >
        Iniciar Maze
      </button>
    </div>
  );
}

export default Menu;
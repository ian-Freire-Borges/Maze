import React from 'react';
import './Menu.css';

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
      <div className='opçoes'>
      <label for="Nivel">Escolha um Nivel:</label>
        <select id="nivel" name="nivel">
          <option value="nv:1">Nivel :1</option>
          <option value="nv:2">Nivel :2</option> 
          <option value="nv:3">Nivel :3</option>
          <option value="nv:4">Nivel :4</option>
      </select>
      </div>
    </div>
  );
}

export default Menu;
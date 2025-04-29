import React from 'react';
import './Menu.css';

function Menu({ setScreen, setMazeKey, gerarNovoMaze, setNivel ,nivel}) { 
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
      <label htmlFor="Nivel">Escolha um Nivel:</label>
        <select id="nivel" name="nivel"
        value={nivel}
        onChange={(e) => setNivel(Number(e.target.value))}>
          <option value={1}>Enchanted Florest</option>
          <option value={2}>Mushroom kingdom</option> 
          <option value={3}>Secret Dungeon</option>
          {window.innerWidth > 450 &&(
          <option value={0}>Demo</option>
        )}
      </select>
      </div>
    </div>
  );
}

export default Menu;
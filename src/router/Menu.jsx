import React, { useState,useEffect } from 'react';
import './Menu.css';

function Menu({ setScreen, setMazeKey, gerarNovoMaze, setNivel ,nivel,setScore,setDevMove,devMode}) { 
  const ativarDevMode = ()=>{
    if(!devMode){
    let senhaDev = "123"
    const senha = prompt('Digite a senha de desenvolvedor:');
    if( senha === senhaDev){
      setDevMove(true)
      alert('Dev Mode ativado!');
    }else{
        alert('Senha incorreta!');
    }
  }else{
    setDevMove(false)
  }
  }
  const renderNivelNome = () => {
  switch (nivel) {
    case 1:
      return <h2 className="nivel-titulo">Enchanted Florest</h2>;
    case 2:
      return <h2 className="nivel-titulo">Crystal Cave</h2>;
    case 3:
      return <h2 className="nivel-titulo">Volcano Bowels</h2>;
   
  }
};
  useEffect(() => {
      setNivel(1)
    }, []); 
  return (
    <div className="menu-container">
      <h1 className="menu-title">Maze Game</h1>
      <button
        className="menu-button"
        onClick={() => {
          setScore(0)
          gerarNovoMaze(); 
          setScreen("MAZE");
          setMazeKey(prevKey => prevKey + 1); 
        }}
      >
        Iniciar Maze
      </button>
      <div className='devMode-container'>
        <button onClick={ativarDevMode} className={devMode ? 'dev-button active' : ''}>Dev Mode</button>
      </div>
      {devMode &&(<div className='opçoes'>
      <label htmlFor="Nivel">Escolha um Nivel:</label>
        <select id="nivel" name="nivel"
        value={nivel}
        onChange={(e) => setNivel(Number(e.target.value))}>
          <option value={1}>Enchanted Florest</option>
          <option value={2}>Crystal Cave</option> 
          <option value={3}>Volcano Bowels</option>
          {window.innerWidth > 450 &&(
          <option value={0}>Demo</option>
        )}
      </select>
      </div>)}
      {!devMode &&(
      <div className='nameLevel-container'>
         <label>Nível Atual:</label>
             {renderNivelNome()}
      </div>
          )}
      <div className='scoreBoard-container'>
          <button  onClick={() => {
          setScreen("SCORE");
        }}>ScoreBoard</button>
      </div>
    </div>
  );
}

export default Menu;
import React, { useState, useEffect } from 'react';
import './Menu.css';

function Menu({  setScreen,  setMazeKey,  gerarNovoMaze,  setNivel,  nivel,  setScore, setDevMove, devMode, infinityMode, setTrueInfinityMode, setProgressoInfinito}) { 
  const [devModeForm, setDevModeForm] = useState(false);
  const [passWord, setPassWord] = useState("");
  const [auxiliarRandow, setAuxiliarRandow] = useState(false);
 
  const randomNivel = () => {
    return Math.max(1, Math.floor(Math.random() * 4)); // Garante 1-4
  };

  useEffect(() => {
    if (auxiliarRandow) {
      setScore(0);
      gerarNovoMaze();
      setScreen("MAZE");
      setMazeKey(prevKey => prevKey + 1);
      setAuxiliarRandow(false);
      console.log("Modo infinito iniciado - Nível:", nivel);
    }
  }, [auxiliarRandow]);

  const ativarDevModeForm = () => {
    if(!devMode) {
      setDevModeForm(true);
    } else {
      setDevMove(false);
    }
  };

  const ativarDevMod = () => {
    const senhaDev = "123";
    if(passWord === senhaDev) {
      setPassWord("");   
      setDevMove(true);
      setDevModeForm(false);
      alert("Bem vindo Dev!");
    } else {
      alert("Senha incorreta!");
      setPassWord(""); 
    }
  };
   
  const renderNivelNome = () => {
    switch (nivel) {
      case 1: return <h2 className="nivel-titulo">Enchanted Florest</h2>;
      case 2: return <h2 className="nivel-titulo">Crystal Cave</h2>;
      case 3: return <h2 className="nivel-titulo">Volcano Bowels</h2>;
      case 4: return <h2 className="nivel-titulo">Perma Frost</h2>;
      case 0: return <h2 className="nivel-titulo">Demo</h2>;
      default: return <h2 className="nivel-titulo">Nível {nivel}</h2>;
    }
  };

  const iniciarModoNormal = () => {
    setScore(0);
    setTrueInfinityMode(false);
    setProgressoInfinito(0);
    setNivel(1);
    gerarNovoMaze();
    setScreen("MAZE");
    setMazeKey(prevKey => prevKey + 1);
  };

  const iniciarModoInfinito = () => {
    setTrueInfinityMode(true);
    setProgressoInfinito(1); // Começa com 1 nível completado
    setNivel(randomNivel());
    setScore(0);
    setAuxiliarRandow(true);
    console.log("Modo infinito iniciado - Progresso: 1");
  };

  useEffect(() => {
    // Reset inicial
    setTrueInfinityMode(false);
    setNivel(1);
    setProgressoInfinito(0);
  }, []); 

  return (
    <div className="menu-container">
      <h1 className="menu-title">Maze Game</h1>
      
      {!devModeForm && (
        <div>
          <button
            className="menu-button"
            onClick={iniciarModoNormal}
          >
            Story Mode
          </button>
          
          {infinityMode && (
            <div className="infinity-container">
              <button
                onClick={iniciarModoInfinito}
              >
                Infinity mode
              </button>
            </div>
          )}
        </div>
      )}
      
      <div className='devMode-container'>
        <button 
          onClick={ativarDevModeForm} 
          className={devModeForm || devMode ? 'dev-button active' : ''}
        >
          {devMode || devModeForm ? "Dev Mode" : "Dev"}
        </button>
      </div>
      
      {devModeForm && (
        <div className='input-container'>
          <input 
            type="password" 
            placeholder="Digite a senha de desenvolvedor"  
            onChange={(e) => setPassWord(e.target.value)} 
            maxLength={10} 
            value={passWord}
          />
          <div className="button-group">
            <button onClick={ativarDevMod}>Confirmar</button>
            <button onClick={() => {
              setPassWord("");   
              setDevModeForm(false);
            }}>
              Cancelar
            </button>
          </div>
        </div>
      )}
      
      {!devModeForm && (
        <div>
          {devMode && (
            <div className='opçoes'>
              <label htmlFor="Nivel">Escolha um Nivel:</label>
              <select 
                id="nivel" 
                name="nivel"
                value={nivel}
                onChange={(e) => setNivel(Number(e.target.value))}
              >
                <option value={1}>Enchanted Florest</option>
                <option value={2}>Crystal Cave</option> 
                <option value={3}>Volcano Bowels</option>
                <option value={4}>Perma Frost</option>
                {window.innerWidth > 450 && <option value={0}>Demo</option>}
              </select>
            </div>
          )}
          
          {!devMode && (
            <div className='nameLevel-container'>
              <label>Nível Atual:</label>
              {renderNivelNome()}
            </div>
          )}
          
          <div className='scoreBoard-container'>
            <button onClick={() => setScreen("SCORE")}>
              ScoreBoard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;
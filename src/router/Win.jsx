import "./Win.css";
import { useState, useEffect } from 'react';

const Win = ({ setScreen,score, nivel, setNivel, setMazeKey, gerarNovoMaze, levelCheck, setLevelCheck, trueInfinityMode,progressoInfinito,setProgressoInfinito}) => {
  const randomNivel = () => Math.max(1, Math.floor(Math.random() * 4) + 1);

  useEffect(() => {
    if(trueInfinityMode) {
      setProgressoInfinito(prev => {
        const novoProgresso = prev + 1;
        console.log(`Progresso atualizado: ${novoProgresso}`);
        return novoProgresso;
      });
      
      const novoNivel = randomNivel();
      console.log(`Novo nível sorteado: ${novoNivel}`);
      setNivel(novoNivel);
      setMazeKey(prev => prev + 1);
      gerarNovoMaze();
    } else {
      if (nivel < 4) {
        setNivel(nivel + 1);    
        setMazeKey(prev => prev + 1); 
        gerarNovoMaze();          
      } else {
        setLevelCheck(true);
      }
    }
  }, []);

  const WinNext = () => {
    if(levelCheck) {
      setLevelCheck(false);
      setNivel(1);             
      setScreen("MENU");         
    } else {
      gerarNovoMaze();          
      setScreen("MAZE");        
    }
  };

  const renderNivelNome = () => {
    if(levelCheck) {
      return <h2 className="nivel-titulo">Menu</h2>;
    } else {
      switch (nivel) {
        case 1: return <h2 className="nivel-titulo">Enchanted Florest</h2>;
        case 2: return <h2 className="nivel-titulo">Crystal Cave</h2>;
        case 3: return <h2 className="nivel-titulo">Volcano Bowels</h2>;
        case 4: return <h2 className="nivel-titulo">Perma Frost</h2>;
        case 0: return <h2 className="nivel-titulo">Demo</h2>;
        default: return <h2 className="nivel-titulo">Nível {nivel}</h2>;
      }
    }
  };

  return (
    <div className="Win-container">
      <h1>Winner Chicken Dinner</h1>
      <div className='Win'>
        <button onClick={WinNext}>Next Level</button>
      </div>
      <div className='nameLevel-container'>
        <label>Próximo Nível:</label>
        {renderNivelNome()}
      </div>
      <div className="score-container">
        <h2>{trueInfinityMode ? `Sequência: ${progressoInfinito - 1} níveis` : `Score: ${score}`}</h2>
      </div>
    </div>
  );
}

export default Win;
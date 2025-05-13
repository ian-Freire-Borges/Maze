import "./Win.css";
import { useState, useEffect } from 'react';  // Adicionando o useEffect aqui

const Win = ({ setScreen, gameResult, score, nivel, setNivel, setMazeKey, gerarNovoMaze, levelCheck,  setLevelCheck}) => {
  
  
  useEffect(() => {
    if (nivel < 4) {
      const proximoNivel = nivel + 1;
      setNivel(proximoNivel);    
      setMazeKey(prev => prev + 1); 
      gerarNovoMaze();          
    }else{
        setLevelCheck(true)
    }
  }, []); 

  const WinNext = () => {
    if(levelCheck){
      setLevelCheck(false)
      setNivel(1);             
      setScreen("MENU");         
    }
    else if (nivel <= 4) {
      gerarNovoMaze();          
      setScreen("MAZE");        
    } 
  };
  const renderNivelNome = () => {
    if(levelCheck){
      return <h2 className="nivel-titulo">Menu</h2>;
    }else{
  switch (nivel) {
    case 1:
      return <h2 className="nivel-titulo">Enchanted Florest</h2>;
    case 2:
      return <h2 className="nivel-titulo">Crystal Cave</h2>;
    case 3:
      return <h2 className="nivel-titulo">Volcano Bowels</h2>;
    case 4:
      return <h2 className="nivel-titulo">Perma Frost</h2>;
    case 0:
      return <h2 className="nivel-titulo">Demo</h2>;
   
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
         <label>Proximo Nivel:</label>
             {renderNivelNome()}
      </div>
      <div className="score-container"><h2>Score:{score}</h2></div>
    </div>
  );
}

export default Win;
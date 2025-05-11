import "./Win.css";
import { useState, useEffect } from 'react';  // Adicionando o useEffect aqui

const Win = ({ setScreen, gameResult, score, nivel, setNivel, setMazeKey, gerarNovoMaze, levelCheck,  setLevelCheck}) => {
  
  
  useEffect(() => {
    if (nivel <= 2) {
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
    else if (nivel <= 3) {
      gerarNovoMaze();          
      setScreen("MAZE");        
    } 
  };

  return (
    <div className="Win-container">
      <h1>Winner Chicken Dinner</h1>
      <div className='Win'>
        <button onClick={WinNext}>Next Level</button>
      </div>
      <div className="score-container"><h2>Score:{score}</h2></div>
    </div>
  );
}

export default Win;
import React from 'react';
import "./End.css";

function End({ setScreen, gameResult ,score }) {
  return (
    <div className="end-container">
      <h1 className="end-title">End Game</h1>
      <p className={`end-text ${gameResult ? 'win-text' : 'lose-text'}`}>
        {gameResult ? "You Win!" : "You Lose!"}
      </p>
      <button onClick={() => setScreen("MENU")}>Voltar para o menu</button>
      <div className='score-container'>
      <h2>Score:{score}</h2>
      </div>
    </div>
  );
}

export default End;
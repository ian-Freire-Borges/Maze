import React from 'react';
import "./End.css";

function End({ setScreen, gameResult }) {
  return (
    <div className="end-container">
      <h1 className="end-title">End Game</h1>
      <p className={`end-text ${gameResult ? 'win-text' : 'lose-text'}`}>
        {gameResult ? "You Win!" : "You Lose!"}
      </p>
      <button onClick={() => setScreen("MENU")}>Voltar para o menu</button>
    </div>
  );
}

export default End;
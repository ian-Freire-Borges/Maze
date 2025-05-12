import React, { useEffect, useState } from 'react';
import "./ScoreBoard.css"

const ScoreBoard = ({setScreen}) => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const storedScores = JSON.parse(localStorage.getItem('gameScores')) || [];
    setScores(storedScores);
  }, []);

 const handleDelete = (id) => {
    const updatedScores = scores.filter(score => score.id !== id);
    setScores(updatedScores);
    localStorage.setItem('gameScores', JSON.stringify(updatedScores));
  };

  return (
    <div className="scoreboard-wrapper">
    <div className="scoreboard-container">
      <h2>Top Scores</h2>
      <ul className="score-list">
        {scores.map((score) => (
          <li key={score.id}>
            <span className='score-info'><strong>{score.nick}</strong>: {score.score} pts</span>
            <button
              className="delete-button"
              onClick={() => handleDelete(score.id)}
              title="Deletar"
            >
              <span className="delete-text">Delete</span> ❌
            </button>
          </li>
        ))}
      </ul>
      <div className='back-button'>
        <button onClick={()=>setScreen("MENU")}>Voltar</button>
      </div>
    </div>
    </div>
  );
};

export default ScoreBoard
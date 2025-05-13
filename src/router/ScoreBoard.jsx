import React, { useEffect, useState } from 'react';
import './ScoreBoard.css';
import api from '../api';

const ScoreBoard = ({ setScreen }) => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    async function fetchScores() {
      try {
        const response = await api.get('/scoreTop');
        setScores(response.data);
      } catch (error) {
        console.error('Erro ao buscar scores:', error);
      }
    }

    fetchScores();
  }, []);

  return (
    <div className="scoreboard-wrapper">
      <div className="scoreboard-container">
        <h2>Top 10 Scores</h2>
        <ul className="score-list">
          {scores.map((score) => (
            <li key={score.id}>
              <span className='score-info'>
                <strong>{score.name}</strong> - {score.score} pts
              </span>
            </li>
          ))}
        </ul>
        <div className='back-button'>
          <button onClick={() => setScreen("MENU")}>Voltar</button>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
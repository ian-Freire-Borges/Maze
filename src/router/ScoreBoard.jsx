import React, { useEffect, useState } from 'react';
import './ScoreBoard.css';
import api from '../api';

const ScoreBoard = ({ setScreen }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewNivel, setViewNivel] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const endpoint = viewNivel ? '/scoreNivel' : '/scoreTop';
        const response = await api.get(endpoint);
        setScores(response.data);
      } catch (error) {
        console.error('Erro ao buscar scores:', error);
        setScores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [viewNivel]);

  return (
    <div className="scoreboard-wrapper">
      <div className="scoreboard-container">
        <h2>{viewNivel ? 'Top 10 Modo Infinito' : 'Top 10 Scores'}</h2>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <ul className="score-list">
            {scores.map((score) => (
              <li key={score.id}>
                <span className="score-info">
                  <strong>{score.name}</strong> - {viewNivel ? `${score.nivel}° nível` : `${score.score} pts`}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="back-button">
          <button onClick={() => setScreen('MENU')}>Voltar</button>
          <button onClick={() => setViewNivel(!viewNivel)}>
            {viewNivel ? 'Score Normal' : 'Score Infinito'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
import React, { useState } from 'react';
import "./End.css";

function End({ setScreen, gameResult ,score }) {
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [nick, setNick] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSaveScore = () => {
   
 

    // Criar objeto de score
    const scoreData = {
      id: Date.now(), // ID único baseado no timestamp
      nick,
      score,
      date: new Date().toISOString()
    };

    // Obter scores existentes ou inicializar array vazio
    const existingScores = JSON.parse(localStorage.getItem('gameScores')) || [];
    
    // Adicionar novo score
    const updatedScores = [...existingScores, scoreData];
    
    // Ordenar por score (maior primeiro) 
    const topScores = updatedScores
      .sort((a, b) => b.score - a.score)

    // Salvar no localStorage
    localStorage.setItem('gameScores', JSON.stringify(topScores));
    
    // Resetar estado
    setShowSaveForm(false);
    setNick('');
    setError('');
  };

  return (
    <div className="end-container">
      <h1 className="end-title">You Lose!</h1>
      <button onClick={() => setScreen("MENU")}>Voltar para o menu</button>
        {!saved &&(
        <div className='save-container'>
             {!showSaveForm ? (
               <button onClick={() => setShowSaveForm(true)}>
                Save Score
               </button>
             ) : (
              <div className='input-container'>
               <input
                  type="text"
                  value={nick}
                  onChange={(e) => setNick(e.target.value)}
                  placeholder="Seu nick (3-10 Caracteris)"
                  maxLength={10}
              />
              {error && <p className="error-message">{error}</p>}
              <div className="button-group">
                <button
                  onClick={() => {
                    handleSaveScore();
                    setSaved(true);
                  }}
                  disabled={nick.length < 3}
                >Confirm</button>
                <button onClick={() => setShowSaveForm(false)}>Cancel</button>
              </div>
               </div>
             )}
        </div>
        )}
      <div className='score-container'>
      <h2>Score:{score}</h2>
      </div>
    </div>
  );
}

export default End;
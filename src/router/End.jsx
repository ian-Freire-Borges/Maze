import React, { useState } from 'react';
import './End.css';
import api from '../api';

function End({ setScreen, score, trueInfinityMode, progressoInfinito }) {
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [nick, setNick] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveScore = async () => {
    if (nick.length < 3 || nick.length > 10) {
      setError('Nick deve ter entre 3 e 10 caracteres.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const numericScore = Number(score);
      if (isNaN(numericScore)) {
        throw new Error('Score inválido');
      }

      const payload = trueInfinityMode ? { name: nick, nivel: progressoInfinito } : { name: nick, score: Number(score) };

      const endpoint = trueInfinityMode ? '/scoreNivel' : '/scoreTop';
      const response = await api.post(endpoint, payload);

      if (response.data && response.data.id) {
        setSaved(true);
        setShowSaveForm(false);
        setNick('');
      } else {
        throw new Error('Invalid response from the server');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error saving score. Please try again later.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="end-container">
      <h1 className="end-title">You Lose!</h1>
      <button className="menu-button" onClick={() => setScreen("MENU")}>Back to menu</button>

      {!saved && (
        <div className='save-container'>
          {!showSaveForm ? (
            <button className="end-save"onClick={() => setShowSaveForm(true)}>Save Score</button>
          ) : (
            <div className='input-container'>
              <input
                type="text"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                placeholder="Your nickname (3–10 characters)"
                maxLength={10}
              />
              {error && <p className="error-message">{error}</p>}
              <div className="button-group">
                <button
                  onClick={handleSaveScore}
                  disabled={nick.length < 3 || isSaving}
                >
                  {isSaving ? 'Salvando...' : 'Confirm'}
                </button>
                <button 
                  onClick={() => {
                    setShowSaveForm(false);
                    setError('');
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {saved && <p className="success-message">Score was saved successfully!</p>}

      <div className='score-container'>
        <h2>{trueInfinityMode ? `Progresso: Nível ${progressoInfinito}` : `Score: ${score}`}</h2>
      </div>
    </div>
  );
}

export default End;
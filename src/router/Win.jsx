import "./Win.css";
import api from "../api";
import { useState, useEffect,useRef } from 'react';

const Win = ({ setScreen,score, nivel, setNivel, setMazeKey, gerarNovoMaze, levelCheck, setLevelCheck, trueInfinityMode,progressoInfinito,setProgressoInfinito}) => {
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [nick, setNick] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const didAdvanceLevel = useRef(false);

  const randomNivel = () => Math.max(1, Math.floor(Math.random() * 4) + 1);

  useEffect(() => {
     if (didAdvanceLevel.current) return;
    didAdvanceLevel.current = true;
    if(trueInfinityMode) {
      setProgressoInfinito(prev => {
        const novoProgresso = prev + 1;
        return novoProgresso;
      });
      
      const novoNivel = randomNivel();
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

    const handleSaveScore = async () => {
    if (nick.length < 3 || nick.length > 10) {
      setError("Nickname must be between 3 and 10 characters.");
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const payload = trueInfinityMode
        ? { name: nick, nivel: progressoInfinito - 1 }
        : { name: nick, score };

      const endpoint = trueInfinityMode ? '/scoreNivel' : '/scoreTop';
      const response = await api.post(endpoint, payload);

      if (response.data && response.data.id) {
        setSaved(true);
        setShowSaveForm(false);
        setNick('');
      } else {
        throw new Error("Invalid response from the server");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error saving score. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

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
      <h1>{levelCheck ? "victory" :  "Winner Chicken Dinner"}</h1>
      <div className='Win'>
        <button onClick={WinNext}>{levelCheck ? "Menu" :  "Next >>"}</button>
      </div>

  {!saved && levelCheck && (
        <div className='save-container'>
          {!showSaveForm ? (
            <button className="save-score" onClick={() => setShowSaveForm(true)}>Save Score</button>
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
                  {isSaving ? 'Saving...' : 'Confirm'}
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

      {saved && <p className="success-message">Score saved successfully!</p>}

      {!levelCheck && (
        <div className='nameLevel-container'>
          <label>Next Level</label>
          {renderNivelNome()}
        </div>
      )}

      {levelCheck && (
        <div className="desbloqueado">
          <p>Infinite Mode unlocked</p>
        </div>
      )}
      <div className="score-container">
        <h2>{trueInfinityMode ? `Sequence: ${progressoInfinito - 1} levels` : `Score: ${score}`}</h2>
      </div>
    </div>
  );
};

export default Win;
import React from 'react'
import "./End.css"
function End({setScreen}) {
  return (
    <div className="end-container">
      <h1 className="end-title">End Game</h1>
        <button onClick={() => setScreen("MENU")}>Voltar para o menu</button>
    </div>

  )
}

export default End
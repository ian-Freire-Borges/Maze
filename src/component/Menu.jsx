import React from 'react'


function Menu({setScreen}) {
  return (
    <div>Menu
    <button onClick={() => setScreen("MAZE")}>Iniciar Maze</button>
    </div>
  )
}

export default Menu
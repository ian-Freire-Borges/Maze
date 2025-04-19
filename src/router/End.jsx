import React from 'react'

function End({setScreen}) {
  return (
    <div>End
        <button onClick={() => setScreen("MENU")}>Ir menu</button>
    </div>

  )
}

export default End
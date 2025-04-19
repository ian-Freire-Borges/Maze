import React from 'react';
import MazeRender from "../component/MazeRender";
import TruePlayerMove from '../component/TruePlayerMove';
import "./MazePage.css"

export default function MazePage({ mazeLayout, setScreen}) {
  return (
    <div className="maze-wrapper">
      <MazeRender mazeLayout={mazeLayout}/>
      <TruePlayerMove setScreen={setScreen} mazeLayout={mazeLayout} />
    </div>
  );
}
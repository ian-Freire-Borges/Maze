import { useState } from 'react';
import matrizes from '../../public/matrizes.json';

export default function useMaze() {
  const [mazeLayout, setMazeLayout] = useState(() => {
    const randomIndex = Math.floor(Math.random() * matrizes.length);
    return matrizes[randomIndex];
  });

  const gerarNovoMaze = () => {
    const randomIndex = Math.floor(Math.random() * matrizes.length);
    setMazeLayout(matrizes[randomIndex]);
  };

  return { mazeLayout, gerarNovoMaze };
}
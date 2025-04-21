import { useState } from 'react';
import matrizes1 from '../../public/matrizesLvL1.json';
import matrizes2 from '../../public/matrizesLvL2.json';

export default function useMaze() {
  const [mazeLayout, setMazeLayout] = useState(() => {
    const randomIndex = Math.floor(Math.random() * matrizes2.length);
    return matrizes2[randomIndex];
  });

  const gerarNovoMaze = () => {
    const randomIndex = Math.floor(Math.random() * matrizes2.length);
    setMazeLayout(matrizes2[randomIndex]);
  };

  return { mazeLayout, gerarNovoMaze };
}
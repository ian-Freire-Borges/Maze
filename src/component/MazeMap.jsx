import { useState } from 'react';
import matrizes1 from '../../public/matrizesLvL1.json';
import matrizes2 from '../../public/matrizesLvL2.json';
import matrizes3 from '../../public/teste.json';

export default function useMaze(nivel) {
  // Sempre escolhe as matrizes com base no nivel e no tamanho da tela
  const escolherMatrizes = () => {
    if (window.innerWidth <= 450) {
      return matrizes1;
    } else if (nivel === 2) {
      return matrizes2;
    } else if (nivel === 3) {
      return matrizes3;
    } else {
      return matrizes2;
    }
  };

  const [mazeLayout, setMazeLayout] = useState(() => {
    const matrizes = escolherMatrizes();
    const randomIndex = Math.floor(Math.random() * matrizes.length);
    return matrizes[randomIndex];
  });

  const gerarNovoMaze = () => {
    const matrizes = escolherMatrizes();
    const randomIndex = Math.floor(Math.random() * matrizes.length);
    setMazeLayout(matrizes[randomIndex]);
  };

  return { mazeLayout, gerarNovoMaze };
}
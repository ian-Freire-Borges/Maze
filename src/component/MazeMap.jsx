import { useState } from 'react';
import matrizes1 from '../../public/matrizesLvL1.json';
import matrizes2 from '../../public/matrizesLvL2.json';
import matrizes3 from '../../public/teste.json';

export default function useMaze(nivel) {
  let matrizes
  if (nivel===1){
    matrizes = matrizes1
  }else if(nivel===2){
    matrizes = matrizes2
  }
  else if (nivel===3){
    matrizes = matrizes3
  }
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
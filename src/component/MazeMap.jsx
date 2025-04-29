import { useState } from 'react';
import mapaMobileLv1 from "../../public/mapaMobileNv1.json"  // 16 x 32
import mapaMobileLv2 from "../../public/mapaMobileNv2.json"  // 20 x 40
import mapaMobileLv3 from "../../public/mapaMobileNv3.json"  // 24 x 48
import matrizes1 from '../../public/matrizesLvL1.json';
import matrizes2 from '../../public/matrizesLvL2.json';
import matrizes3 from '../../public/teste.json';

export default function useMaze(nivel) {
  const escolherMatrizes = () => {
    if (window.innerWidth <= 450 && nivel === 1) {
      return mapaMobileLv1;
    } else if (window.innerWidth <= 450 && nivel === 2) {
      return mapaMobileLv2;
    } else if (window.innerWidth <= 450 && nivel === 3) {
      return mapaMobileLv3;
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
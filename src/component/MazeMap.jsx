import { useState } from 'react';
import mapaMobileLv1 from "../../public/Mobile1.json"  // 16 x 32
import mapaMobileLv2 from "../../public/Mobile2.json"  // 22 x 44
import mapaMobileLv3 from "../../public/Mobile3.json"  // 24 x 48
import matrizes1 from '../../public/mapaNv1.json' // 35 x 19
import matrizes2 from '../../public/mapaNv2.json';  // 45 x 25
import matrizes3 from '../../public/mapaNv3.json';  // 55 x 29
import demo from '../../public/mapaForDemo.json';   // 63 x 31

export default function useMaze(nivel) {
  const escolherMatrizes = () => {
    if(window.innerWidth <= 450 ){
    if (window.innerWidth <= 450 && nivel === 1) {
      return mapaMobileLv1;
    } else if (window.innerWidth <= 450 && nivel === 2) {
      return mapaMobileLv2;
    } else{
      return mapaMobileLv3;
    }
    } else {
      if(nivel === 1){
        return matrizes1;
      } else if(nivel === 2){
        return matrizes2;
      } else if (nivel ===3){
        return matrizes3;
      }else{
        return demo
      }
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
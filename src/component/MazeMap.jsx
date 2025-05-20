import { useState } from 'react';
import mapaMobileLv1 from "../../public/Mobile1.json"  // 17 x 33
import mapaMobileLv2 from "../../public/Mobile2.json"  // 23 x 45
import mapaMobileLv3 from "../../public/Mobile3.json"  // 27 x 51
import mapaMobileLv4 from "../../public/Mobile4.json"  // 31 x 57
import matrizes1 from '../../public/mapaNv1.json' // 47 x 23 
import matrizes2 from '../../public/mapaNv2.json';  // 51 x 25 
import matrizes3 from '../../public/mapaNv3.json';  // 59 x 29 
import matrizes4 from "../../public/mapaNv4.json";   // 63 x 31 
import demo from '../../public/mapaForDemo.json';   // 63 x 31 

export default function useMaze(nivel) {
  const escolherMatrizes = () => {
    if(window.innerWidth <= 450 ){
    if (window.innerWidth <= 450 && nivel === 1) {
      return mapaMobileLv1;
    } else if (window.innerWidth <= 450 && nivel === 2) {
      return mapaMobileLv2;
    } else if (window.innerWidth <= 450 && nivel === 3) {
      return mapaMobileLv3;
    } else{
      return mapaMobileLv4;
    }
    } else {
      if(nivel === 1){
        return matrizes1;
      } else if(nivel === 2){
        return matrizes2;
      } else if (nivel === 3){
        return matrizes3;
      }else if (nivel === 4){
        return matrizes4
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
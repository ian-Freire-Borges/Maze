import { useState } from 'react';
import mapaMobileLv1 from "../../public/Mobile1.json";  
import mapaMobileLv2 from "../../public/Mobile2.json"; 
import mapaMobileLv3 from "../../public/Mobile3.json";
import mapaMobileLv4 from "../../public/Mobile4.json";
import matrizes1 from '../../public/mapaNv1.json';
import matrizes2 from '../../public/mapaNv2.json';  
import matrizes3 from '../../public/mapaNv3.json';   
import matrizes4 from "../../public/mapaNv4.json";   
import demo from '../../public/mapaForDemo.json';   

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
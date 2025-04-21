import { useRef } from 'react';
import Sketch from 'react-p5';


import wall1 from "../assets/FlorestWall.png";
import door from "../assets/pixel_door.png";

import tile3 from "../assets/tile3.png";
import tile4 from "../assets/tile4.png";
import tile5 from "../assets/tile5.png";

import bush from "../assets/Tree1.png";
import miniBush from "../assets/Tree2.png";

export default function StaticMaze({ mazeLayout }) {
  const cellSize = 20;

  const wall1Ref = useRef();
  const doorRef = useRef();
  const tile3Ref = useRef();
  const tile4Ref = useRef();
  const tile5Ref = useRef();
  const bushRef = useRef();
  const miniBushRef = useRef();

  const wallMapRef = useRef([]);
  const pathMapRef = useRef([]);
  const overlayMapRef = useRef([]);

  const preload = (p5) => {
    wall1Ref.current = p5.loadImage(wall1);
    doorRef.current = p5.loadImage(door);

    tile3Ref.current = p5.loadImage(tile3);
    tile4Ref.current = p5.loadImage(tile4);
    tile5Ref.current = p5.loadImage(tile5);

    bushRef.current = p5.loadImage(bush);
    miniBushRef.current = p5.loadImage(miniBush);
  };

  const setup = (p5, canvasParentRef) => {
    const canvas = p5.createCanvas(
      mazeLayout[0].length * cellSize,
      mazeLayout.length * cellSize
    ).parent(canvasParentRef);

    // Gerar os mapas estáticos de texturas
    wallMapRef.current = [];
    pathMapRef.current = [];
    overlayMapRef.current = [];

    for (let row = 0; row < mazeLayout.length; row++) {
      wallMapRef.current[row] = [];
      pathMapRef.current[row] = [];
      overlayMapRef.current[row] = [];

      for (let col = 0; col < mazeLayout[0].length; col++) {
        const val = mazeLayout[row][col];

        if (val === 1) {
         
          wallMapRef.current[row][col] =  wall1Ref.current 

          // Bush por cima: 70% bush, 30% miniBush
          overlayMapRef.current[row][col] = Math.random() < 0.7 ? bushRef.current : miniBushRef.current;

        } else if (val === 0 || val === 2 || val === 4) {
          // Caminho: 40% tile3, 30% tile5, 30% tile4
          const rand = Math.random();
          if (rand < 0.4) {
            pathMapRef.current[row][col] = tile3Ref.current;
          } else if (rand < 0.7) {
            pathMapRef.current[row][col] = tile5Ref.current;
          } else {
            pathMapRef.current[row][col] = tile4Ref.current;
          }
        }
      }
    }

    p5.frameRate(30);
  };

  const draw = (p5) => {
    p5.background(240);

    for (let row = 0; row < mazeLayout.length; row++) {
      for (let col = 0; col < mazeLayout[0].length; col++) {
        const x = col * cellSize;
        const y = row * cellSize;
        const val = mazeLayout[row][col];

        if (val === 1) {
          // Parede + overlay (bush/miniBush)
          p5.image(wallMapRef.current[row][col], x, y, cellSize, cellSize);
          p5.image(overlayMapRef.current[row][col], x, y, 20, 20);

        } else if (val === 0 || val === 2 || val === 4) {
          // Caminho com textura aleatória
          p5.image(pathMapRef.current[row][col], x, y, cellSize, cellSize);

        } else if (val === 3) {
          // Porta
          p5.image(doorRef.current, x, y, cellSize, cellSize);
        }
      }
    }
  };

  return (
    <div className="maze-container">
      <Sketch preload={preload} setup={setup} draw={draw} />
    </div>
  );
}
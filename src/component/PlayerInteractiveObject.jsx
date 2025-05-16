import { useEffect, useRef } from 'react';
import Sketch from 'react-p5';
import imgCoin from '../assets/coin_rot_anim.png';
import door from '../assets/door.png';
import cristalBlue from '../assets/blue_crystal_0000.png';
import cristalRed from '../assets/red_crystal_0000.png';
import cristalGreen from '../assets/green_crystal_0000.png';
import cristalPink from '../assets/pink_crystal_0000.png';

const SPRITE_FRAME_COUNT = 6;
const POWER_FRAME_COUNT = 4;
const animationSpeed = 0.15;

export default function RenderCoins({
  maze,
  playerPosition,
  cellDimensions,
  setScore,
  nivel,
  setExitFound,
  win,
  powerPickRef,
  stepOutOfPowerRef
}) {
  const spriteSheetRef = useRef(null);
  const doorImageRef = useRef(null);
  const powerImageRef = useRef(null);
  const animationFrames = useRef([]);
  const powerFrames = useRef([]);
  const frameCount = useRef(0);
  const powerFrameCount = useRef(0);

  const doorPositionsRef = useRef(null);
  const poweUpPositionRef = useRef(null);
  const itemPositionsRef = useRef(null);

  const { cellWidth, cellHeight } = cellDimensions;
  const spriteSize = Math.min(cellWidth, cellHeight) * 1.1;

  let mutiCoin;
  let mutiPowe;
  let cristal;
  switch (nivel) {
    case 1:
      mutiCoin = 4;
      mutiPowe = 3;
      cristal = cristalGreen;
      break;
    case 2:
      mutiCoin = 6;
      mutiPowe = 5;
      cristal = cristalPink;
      break;
    case 3:
      mutiCoin = 8;
      mutiPowe = 7;
      cristal = cristalRed;
      break;
    case 4:
      mutiCoin = 10;
      mutiPowe = 8;
      cristal = cristalBlue;
      break;
    default:
      mutiCoin = 4;
      mutiPowe = 1;
      cristal = cristalGreen;
  }

  if (itemPositionsRef.current === null) {
    const positions = [];
    const emptyCells = [];
    let doorPosition = null;
    const  poweUpPosition = [];

    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        if (maze[y][x] === 0) emptyCells.push({ x, y });
      }
    }

    for (let i = 0; i < mutiCoin && emptyCells.length > 0; i++) {
      const index = Math.floor(Math.random() * emptyCells.length);
      positions.push(emptyCells.splice(index, 1)[0]);
    }

    for (let i = 0; i < mutiPowe && emptyCells.length > 0; i++) {
      const indexP = Math.floor(Math.random() * emptyCells.length);
      poweUpPosition.push(emptyCells.splice(indexP, 1)[0]);
    }

    const indexD = Math.floor(Math.random() * emptyCells.length);
    doorPosition = emptyCells.splice(indexD, 1)[0];
    

    poweUpPositionRef.current = poweUpPosition;
    doorPositionsRef.current = doorPosition;
    itemPositionsRef.current = positions;
  }

  useEffect(() => {
    let mutiplier;
    switch (nivel) {
      case 1:
        mutiplier = 1;
        break;
      case 2:
        mutiplier = 1.5;
        break;
      case 3:
        mutiplier = 2;
        break;
      case 4:
        mutiplier = 2.5;
        break;
      default:
        mutiplier = 1;
    }

    const playerKey = `${playerPosition.x},${playerPosition.y}`;

    // Coleta moeda
    const index = itemPositionsRef.current.findIndex(
      (pos) => `${pos.x},${pos.y}` === playerKey
    );
    if (index !== -1) {
      itemPositionsRef.current.splice(index, 1);
      setScore((prev) => prev + 20 * mutiplier);
    }

    // Coleta power-up
    const indexP = poweUpPositionRef.current.findIndex(
      (pos) => `${pos.x},${pos.y}` === playerKey
    );
    if (indexP !== -1) {
      poweUpPositionRef.current.splice(indexP, 1);
      setScore((prev) => prev + 5 * mutiplier);
      powerPickRef.current = true;
    }

    // Porta
    const doorPos = doorPositionsRef.current;
    if (doorPos && doorPos.x === playerPosition.x && doorPos.y === playerPosition.y) {
      setExitFound(true);
      win.current = true;
    }
  }, [playerPosition, setScore]);

  const preload = (p5) => {
    spriteSheetRef.current = p5.loadImage(imgCoin);
    doorImageRef.current = p5.loadImage(door);
    powerImageRef.current = p5.loadImage(cristal);
  };

  const setup = (p5, canvasParentRef) => {
    p5
      .createCanvas(cellWidth * maze[0].length, cellHeight * maze.length)
      .parent(canvasParentRef);
    p5.noStroke();

    // Coin animation
    const frameWidth = spriteSheetRef.current.width / SPRITE_FRAME_COUNT;
    const frameHeight = spriteSheetRef.current.height;
    for (let i = 0; i < SPRITE_FRAME_COUNT; i++) {
      animationFrames.current.push(
        spriteSheetRef.current.get(i * frameWidth, 0, frameWidth, frameHeight)
      );
    }

    // Power-up animation
    const powerFrameWidth = powerImageRef.current.width / POWER_FRAME_COUNT;
    const powerFrameHeight = powerImageRef.current.height;
    for (let i = 0; i < POWER_FRAME_COUNT; i++) {
      powerFrames.current.push(
        powerImageRef.current.get(
          i * powerFrameWidth,
          0,
          powerFrameWidth,
          powerFrameHeight
        )
      );
    }
  };

  const draw = (p5) => {
    p5.clear();

    // Atualiza animações
    frameCount.current += animationSpeed;
    const currentFrame = Math.floor(frameCount.current) % SPRITE_FRAME_COUNT;
    const coinImg = animationFrames.current[currentFrame];

    powerFrameCount.current += animationSpeed;
    const currentPowerFrame =
      Math.floor(powerFrameCount.current) % POWER_FRAME_COUNT;
    const powerImg = powerFrames.current[currentPowerFrame];

    // Desenha moedas
    itemPositionsRef.current.forEach(({ x, y }) => {
      const px = x * cellWidth + cellWidth / 2;
      const py = y * cellHeight + cellHeight / 2;

      p5.push();
      p5.imageMode(p5.CENTER);
      p5.image(coinImg, px, py, spriteSize, spriteSize);
      p5.pop();
    });

    // Desenha power-up
     poweUpPositionRef.current.forEach(({ x, y }) => {
      const px = x * cellWidth + cellWidth / 2;
      const py = y * cellHeight + cellHeight / 2;

      p5.push();
      p5.imageMode(p5.CENTER);
      p5.image(powerImg, px, py, spriteSize, spriteSize);
      p5.pop();
    })

    // Desenha porta
    if (doorPositionsRef.current && doorImageRef.current) {
      const px = doorPositionsRef.current.x * cellWidth + cellWidth / 2;
      const py = doorPositionsRef.current.y * cellHeight + cellHeight / 2;

      p5.push();
      p5.imageMode(p5.CENTER);
      p5.image(doorImageRef.current, px, py, cellWidth, cellHeight);
      p5.pop();
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 3,
      }}
    >
      <Sketch preload={preload} setup={setup} draw={draw} />
    </div>
  );
}

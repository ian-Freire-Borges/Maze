import { useEffect, useRef, useState } from 'react';
import Sketch from 'react-p5';
import imgCoin from '../assets/coin_rot_anim.png';

const SPRITE_FRAME_COUNT = 6;

export default function RenderCoins({
  maze,
  playerPosition,
  cellDimensions,
  setScore,
  nivel
}) {
  const spriteSheetRef = useRef(null);
  const animationFrames = useRef([]);
  const frameCount = useRef(0);
  const itemPositionsRef = useRef(null);
  const totalFrames = SPRITE_FRAME_COUNT;
  const animationSpeed = 0.15;

  const { cellWidth, cellHeight } = cellDimensions;
  const spriteSize = Math.min(cellWidth, cellHeight) * 1.1;
    let mutiCoin;
      switch (nivel) {
      case 1:
        mutiCoin = 4;
        break;
      case 2:
        mutiCoin = 6;
        break;
      case 3:
        mutiCoin = 8;
        break;
      case 4:
        mutiCoin = 10;
        break;
      default:
        mutiCoin = 4;
        break;
    }

  if (itemPositionsRef.current === null) {
    const positions = [];
    const emptyCells = [];

    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        if (maze[y][x] === 0) emptyCells.push({ x, y });
      }
    }

    for (let i = 0; i < mutiCoin  && emptyCells.length > 0; i++) {
      const index = Math.floor(Math.random() * emptyCells.length);
      positions.push(emptyCells.splice(index, 1)[0]);
    }

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
        break;
    }
    const playerKey = `${playerPosition.x},${playerPosition.y}`;
    const index = itemPositionsRef.current.findIndex(
      (pos) => `${pos.x},${pos.y}` === playerKey
    );

    if (index !== -1) {
      itemPositionsRef.current.splice(index, 1);
      setScore((prev) => prev + (20 * mutiplier));
    }
  }, [playerPosition, setScore]);

  const preload = (p5) => {
    spriteSheetRef.current = p5.loadImage(imgCoin);
  };

  const setup = (p5, canvasParentRef) => {
    const canvas = p5
      .createCanvas(cellWidth * maze[0].length, cellHeight * maze.length)
      .parent(canvasParentRef);
    p5.noStroke();

    const frameWidth = spriteSheetRef.current.width / totalFrames;
    const frameHeight = spriteSheetRef.current.height;

    for (let i = 0; i < totalFrames; i++) {
      animationFrames.current.push(
        spriteSheetRef.current.get(
          i * frameWidth,
          0,
          frameWidth,
          frameHeight
        )
      );
    }
  };

  const draw = (p5) => {
    p5.clear();

    frameCount.current += animationSpeed;
    const currentFrame = Math.floor(frameCount.current) % totalFrames;
    const currentImg = animationFrames.current[currentFrame];

    if (!currentImg) return;

    itemPositionsRef.current.forEach(({ x, y }) => {
      const px = x * cellWidth + cellWidth / 2;
      const py = y * cellHeight + cellHeight / 2;

      p5.push();
      p5.imageMode(p5.CENTER);
      p5.image(currentImg, px, py, spriteSize, spriteSize);
      p5.pop();
    });
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
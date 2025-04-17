import { useEffect, useRef } from 'react';
import Sketch from 'react-p5';
import char from "../assets/Basic Charakter Spritesheet.png";

export default function RenderPlayerMove({ position, moveDirection = null, lastDirection = "down", cellSize = 20, style }) {
  const p5Ref = useRef();
  const spriteSheetRef = useRef();
  const animationFrames = useRef({ down: [], left: [], right: [], up: [] });
  const currentFrame = useRef(0);
  const frameCount = useRef(0);

  const totalFrames = 4;
  const animationSpeed = 0.1;
  const spriteSize = cellSize * 3;

  const preload = (p5) => {
    spriteSheetRef.current = p5.loadImage(char);
  };

  const setup = (p5, canvasParentRef) => {
    const canvas = p5.createCanvas(cellSize, cellSize).parent(canvasParentRef);
    p5.noStroke();
    p5Ref.current = canvas;

    if (spriteSheetRef.current) {
      const frameWidth = spriteSheetRef.current.width / totalFrames;
      const frameHeight = spriteSheetRef.current.height / 4;

      const directionsOrder = ["down", "up", "left", "right"];

      directionsOrder.forEach((dir, rowIndex) => {
        for (let frame = 0; frame < totalFrames; frame++) {
          animationFrames.current[dir].push(
            spriteSheetRef.current.get(
              frame * frameWidth,
              rowIndex * frameHeight,
              frameWidth,
              frameHeight
            )
          );
        }
      });
    }
  };

  const draw = (p5) => {
    p5.clear();

    if (moveDirection) {
      frameCount.current += animationSpeed;
      currentFrame.current = Math.floor(frameCount.current) % totalFrames;
    } else {
      currentFrame.current = 0;
    }

    const directionToShow = moveDirection || lastDirection;
    const currentFrames = animationFrames.current[directionToShow];

    if (currentFrames?.length > 0) {
      p5.imageMode(p5.CENTER);
      p5.image(
        currentFrames[currentFrame.current],
        cellSize / 2,
        cellSize / 2,
        spriteSize,
        spriteSize
      );
    } else {
      p5.fill(0, 255, 0);
      p5.ellipse(cellSize / 2, cellSize / 2, spriteSize);
    }
  };

  useEffect(() => {
    p5Ref.current?._p5Instance?.redraw();
  }, [position, moveDirection, lastDirection]);

  return (
    <div style={{
      position: 'absolute',
      left: `${position.x * cellSize}px`,
      top: `${position.y * cellSize}px`,
      pointerEvents: 'none',
      zIndex: 2,
      ...style
    }}>
      <Sketch preload={preload} setup={setup} draw={draw} />
    </div>
  );
}
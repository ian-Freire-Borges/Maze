import { useEffect, useRef } from 'react';
import Sketch from 'react-p5';
import enemySprite from "../assets/Free Chicken Sprites.png";

export default function RenderEnemyMove({ position, cellSize = 20, style, moveDirection = "right" }) {
  const p5Ref = useRef();
  const spriteSheetRef = useRef();
  const animationFrames = useRef([]);
  const currentFrame = useRef(0);
  const frameCount = useRef(0);

  const totalFrames = 4;
  const animationSpeed = 0.07;
  const spriteSize = cellSize * 1.2;

  const preload = (p5) => {
    spriteSheetRef.current = p5.loadImage(enemySprite);
  };

  const setup = (p5, canvasParentRef) => {
    const canvas = p5.createCanvas(cellSize, cellSize).parent(canvasParentRef);
    p5.noStroke();
    p5Ref.current = canvas;

    if (spriteSheetRef.current) {
      const frameWidth = spriteSheetRef.current.width / 4;
      const frameHeight = spriteSheetRef.current.height / 2;

      for (let frame = 0; frame < totalFrames; frame++) {
        animationFrames.current.push(
          spriteSheetRef.current.get(
            frame * frameWidth,
            frameHeight,
            frameWidth,
            frameHeight
          )
        );
      }
    }
  };

  const draw = (p5) => {
    p5.clear();

    frameCount.current += animationSpeed;
    currentFrame.current = Math.floor(frameCount.current) % totalFrames;

    const currentImg = animationFrames.current[currentFrame.current];

    if (currentImg) {
      p5.push();
      p5.imageMode(p5.CENTER);

      if (moveDirection === "left") {
        p5.translate(cellSize, 0);
        p5.scale(-1, 1);
      }

      p5.image(currentImg, cellSize / 2, cellSize / 2, spriteSize, spriteSize);
      p5.pop();
    } else {
      p5.fill(255, 0, 0);
      p5.ellipse(cellSize / 2, cellSize / 2, spriteSize);
    }
  };

  useEffect(() => {
    p5Ref.current?._p5Instance?.redraw();
  }, [position, moveDirection]);

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
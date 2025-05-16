import { useEffect, useRef, useState } from 'react';
import Sketch from 'react-p5';
import enemySprite1 from "../assets/DinoSprites - vita.png";
import enemySprite2 from "../assets/DinoSprites - vita1.png";
import enemySprite2Run from "../assets/DinoSprites 2run.png";
import enemySprite3 from "../assets/DinoSprites - tard (1).png"

export default function RenderEnemyMove({
  position,
  moveDirection = "right",
  cellDimensions,
  maze,
  enemyId,
  isAlert
}) {
  const spriteSheetRef = useRef(null);
  const animationFrames = useRef([]);
  const currentFrame = useRef(0);
  const frameCount = useRef(0);

  const [totalFrames, setTotalFrames] = useState(10);
  const [imageLoaded, setImageLoaded] = useState(false);

  const p5InstanceRef = useRef(null);
  const { cellWidth, cellHeight } = cellDimensions;
  const spriteSize = Math.min(cellWidth, cellHeight) * 1.3;

  // Carrega o sprite atual quando muda
  useEffect(() => {
    let spritePath;
    let frameCount;

    if (enemyId === 1) {
      spritePath = enemySprite1;
      frameCount = 10;
    } else if (enemyId === 2) {
      spritePath = isAlert ? enemySprite2Run : enemySprite2;
      frameCount = isAlert ? 7 : 10;
    }else{
            spritePath = enemySprite3;
      frameCount = 10;  
    }

    setImageLoaded(false);
    setTotalFrames(frameCount);

    if (p5InstanceRef.current) {
      p5InstanceRef.current.loadImage(spritePath, (img) => {
        spriteSheetRef.current = img;
        extractFrames(img, frameCount);
        setImageLoaded(true);
      });
    }
  }, [enemyId, isAlert]);

  const extractFrames = (spriteSheet, totalFrames) => {
    animationFrames.current = [];

    const frameWidth = spriteSheet.width / totalFrames;
    const frameHeight = spriteSheet.height;

    for (let i = 0; i < totalFrames; i++) {
      animationFrames.current.push(
        spriteSheet.get(i * frameWidth, 0, frameWidth, frameHeight)
      );
    }
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(
      cellWidth * maze[0].length,
      cellHeight * maze.length
    ).parent(canvasParentRef);
    p5.noStroke();
    p5InstanceRef.current = p5;
  };

  const draw = (p5) => {
    p5.clear();

    if (!imageLoaded) return;

    const centerX = position.x * cellWidth + cellWidth / 2;
    const centerY = position.y * cellHeight + cellHeight / 2;

    frameCount.current += 0.1;
    currentFrame.current = Math.floor(frameCount.current) % totalFrames;

    const currentImg = animationFrames.current[currentFrame.current];

    if (currentImg) {
      p5.imageMode(p5.CENTER);

      if (moveDirection === "left") {
        p5.push();
        p5.translate(centerX, centerY);
        p5.scale(-1, 1);
        p5.image(currentImg, 0, 0, spriteSize, spriteSize);
        p5.pop();
      } else {
        p5.image(currentImg, centerX, centerY, spriteSize, spriteSize);
      }
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      pointerEvents: 'none',
      zIndex: 4
    }}>
      <Sketch 
        setup={setup} 
        draw={draw} 
      />
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import Sketch from 'react-p5';
import enemySprite1 from "../assets/DinoSprites - vita.png";
import enemySprite2 from "../assets/DinoSprites - vita1.png";
import enemySprite2Run from "../assets/DinoSprites 2run.png";

export default function RenderEnemyMove({
  position,
  moveDirection = "right",
  cellDimensions,
  maze,
  enemyId,
  isAlert
}) {
  const [spriteKey, setSpriteKey] = useState(0);
  const [currentSprite, setCurrentSprite] = useState(() => {
    return enemyId === 1 ? enemySprite1 : enemySprite2;
  });
  const [totalFrames, setTotalFrames] = useState(10);

  const p5Ref = useRef();
  const spriteSheetRef = useRef();
  const animationFrames = useRef([]);
  const currentFrame = useRef(0);
  const frameCount = useRef(0);

  const { cellWidth, cellHeight } = cellDimensions;
  const spriteSize = Math.min(cellWidth, cellHeight) * 1.3;

  // Atualiza apenas para o inimigo 2 quando o alerta muda
  useEffect(() => {
    if (enemyId === 2) {
      const newSprite = isAlert ? enemySprite2Run : enemySprite2;
      const newFrames = isAlert ? 7 : 10;
      
      if (newSprite !== currentSprite || newFrames !== totalFrames) {
        setCurrentSprite(newSprite);
        setTotalFrames(newFrames);
        setSpriteKey(prev => prev + 1);
      }
    }
  }, [isAlert, enemyId, currentSprite, totalFrames]);

  const preload = (p5) => {
    spriteSheetRef.current = p5.loadImage(currentSprite);
  };

  const setup = (p5, canvasParentRef) => {
    const canvas = p5.createCanvas(
      cellWidth * maze[0].length,
      cellHeight * maze.length
    ).parent(canvasParentRef);
    p5.noStroke();
    p5Ref.current = canvas;

    loadAnimationFrames(p5);
  };

  const loadAnimationFrames = (p5) => {
    animationFrames.current = [];
    if (spriteSheetRef.current) {
      const frameWidth = spriteSheetRef.current.width / totalFrames;
      const frameHeight = spriteSheetRef.current.height;

      for (let frame = 0; frame < totalFrames; frame++) {
        animationFrames.current.push(
          spriteSheetRef.current.get(
            frame * frameWidth,
            0,
            frameWidth,
            frameHeight
          )
        );
      }
    }
  };

  const draw = (p5) => {
    p5.clear();
    
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

  useEffect(() => {
    p5Ref.current?._p5Instance?.redraw();
  }, [position, moveDirection]);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      pointerEvents: 'none',
      zIndex: 2
    }}>
      <Sketch 
        key={`enemy-${enemyId}-${spriteKey}`}
        preload={preload} 
        setup={setup} 
        draw={draw} 
      />
    </div>
  );
}
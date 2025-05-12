import { useEffect, useRef } from 'react';
import Sketch from 'react-p5';
import enemySprite1 from "../assets/DinoSprites - vita.png";
import enemySprite2 from "../assets/DinoSprites - vita1.png"

export default function RenderEnemyMove({
  position,
  moveDirection = "right",
  cellDimensions,
  maze,// Adicionado para o tamanho do canvas
  enemyId
}) {
  let enemySprite
  if(enemyId === 1){
    enemySprite = enemySprite1;
  }else if(enemyId === 2){
    enemySprite = enemySprite2;
  }
  const p5Ref = useRef();
  const spriteSheetRef = useRef();
  const animationFrames = useRef([]);
  const currentFrame = useRef(0);
  const frameCount = useRef(0);

  const totalFrames = 10; // Número de frames no sprite sheet
  const animationSpeed = 0.1;
  const { cellWidth, cellHeight } = cellDimensions;
  const spriteSize = Math.min(cellWidth, cellHeight) * 1.3; // Tamanho do sprite ajustado

  const preload = (p5) => {
    spriteSheetRef.current = p5.loadImage(enemySprite);
  };

  const setup = (p5, canvasParentRef) => {
    const canvas = p5.createCanvas(
      cellWidth * maze[0].length,
      cellHeight * maze.length
    ).parent(canvasParentRef);
    p5.noStroke();
    p5Ref.current = canvas;

    if (spriteSheetRef.current) {
      const frameWidth = spriteSheetRef.current.width / totalFrames;
      const frameHeight = spriteSheetRef.current.height; // Ajustando para a altura total da imagem

      for (let frame = 0; frame < totalFrames; frame++) {
        animationFrames.current.push(
          spriteSheetRef.current.get(
            frame * frameWidth,
            0, // Pega da linha 0, já que há apenas uma linha de sprites
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

    frameCount.current += animationSpeed;
    currentFrame.current = Math.floor(frameCount.current) % totalFrames;

    const currentImg = animationFrames.current[currentFrame.current];

    if (currentImg) {
      p5.imageMode(p5.CENTER);
      
      // Flip horizontal para direção esquerda
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
      <Sketch preload={preload} setup={setup} draw={draw} />
    </div>
  );
}

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
  isAlert,
  jumpCooldownRef
}) {
  const spriteSheetRef = useRef(null);
  const animationFrames = useRef([]);
  const currentFrame = useRef(0);
  const frameCount = useRef(0);
   const lavaParticles = useRef([]);

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

    const createLavaParticle = (p5, x, y) => {
    return {
      x: x + p5.random(-5, 5),
      y: y + p5.random(0, 10),
      size: p5.random(3, 8),
      life: p5.random(30, 60),
      maxLife: 60,
      speed: p5.random(0.2, 0.5),
      color: p5.color(
        255, // R
        p5.random(100, 150), // G
        p5.random(0, 50), // B
        p5.random(150, 200) // Alpha
      )
    };
  };

    const updateLavaParticles = (p5, centerX, centerY) => {
    // Adiciona novas partículas se o cooldown estiver desativado
    if (!jumpCooldownRef.current && enemyId === 3) {
      if (p5.frameCount % 3 === 0) { // Controla a frequência de criação
        lavaParticles.current.push(createLavaParticle(p5, centerX, centerY));
      }
    }

    // Atualiza e remove partículas antigas
    lavaParticles.current = lavaParticles.current.map(particle => {
      return {
        ...particle,
        y: particle.y - particle.speed,
        life: particle.life - 1
      };
    }).filter(particle => particle.life > 0);
  };

  const drawLavaParticles = (p5) => {
    lavaParticles.current.forEach(particle => {
      const alpha = p5.map(particle.life, 0, particle.maxLife, 0, 255);
      particle.color.setAlpha(alpha);
      p5.noStroke();
      p5.fill(particle.color);
      p5.ellipse(particle.x, particle.y, particle.size);
    });
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

    frameCount.current += 0.25;
    currentFrame.current = Math.floor(frameCount.current) % totalFrames;

     if (enemyId === 3) {
      updateLavaParticles(p5, centerX, centerY);
      drawLavaParticles(p5);
    }

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

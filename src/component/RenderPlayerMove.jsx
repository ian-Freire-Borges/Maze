import { useEffect, useRef } from 'react';
import Sketch from 'react-p5';
import char from "../assets/Basic Charakter Spritesheet.png";

export default function RenderPlayerMove({
  position,
  moveDirection = null,
  lastDirection = "down",
  cellSize = 20,
  style,
  isAlert = false,
  isPanic = false
}) {
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

    const centerX = cellSize / 2;
    const centerY = cellSize / 2;

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
        centerX,
        centerY,
        spriteSize,
        spriteSize
      );
    } else {
      p5.fill(0, 255, 0);
      p5.ellipse(centerX, centerY, spriteSize);
    }

    // Partículas de alerta e pânico - Removendo o quadrado vermelho e mantendo só as partículas
    if (isAlert || isPanic) {
      p5.push();
      p5.translate(centerX, centerY);

      const time = p5.millis() * 0.005;
      const numParticles = isPanic ? 20 : 12; // Ajustado para mais partículas no pânico
      const radius = isPanic ? 25 : 15;
      const baseColor = isPanic ? [255, 0, 0] : [255, 215, 0]; // Vermelho para pânico, amarelo para alerta
      const size = isPanic ? 8 : 6;

      p5.blendMode(p5.ADD);
      const ctx = p5.drawingContext;
      ctx.shadowBlur = isPanic ? 25 : 20;
      ctx.shadowColor = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, 1)`;

      // Partículas de pânico e alerta
      for (let i = 0; i < numParticles; i++) {
        const angle = (i / numParticles) * p5.TWO_PI + time * 0.5;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        const flicker = p5.random(180, 255);

        p5.noStroke();
        p5.fill(baseColor[0], baseColor[1], baseColor[2], flicker);
        p5.ellipse(x, y, size);
      }

      // Pulso central ajustado
      const pulseSize = isPanic
        ? Math.sin(time * 3) * 6 + 12
        : Math.sin(time * 2.5) * 4 + 10;

      const pulseColor = isPanic
        ? [255, 0, 0, 180]          // Vermelho vibrante
        : [255, 215, 0, 160];       // Amarelo vibrante (ouro)

      p5.noStroke();
      p5.fill(...pulseColor);
      p5.ellipse(0, 0, pulseSize);

      p5.pop();
    }
  };

  useEffect(() => {
    p5Ref.current?._p5Instance?.redraw();
  }, [position, moveDirection, lastDirection, isAlert, isPanic]);

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
import { useEffect, useRef } from 'react';
import Sketch from 'react-p5';
import char from "../assets/Basic Charakter Spritesheet.png";
import "./Render.css";

export default function RenderPlayerMove({
  position,
  moveDirection = null,
  lastDirection = "down",
  style,
  isAlert = false,
  isPanic = false,
  cellDimensions,
}) {
  const p5Ref = useRef();
  const spriteSheetRef = useRef();
  const animationFrames = useRef({ down: [], left: [], right: [], up: [] });
  const currentFrame = useRef(0);
  const frameCount = useRef(0);

  const totalFrames = 4;
  const animationSpeed = 0.1;

  const { cellWidth, cellHeight } = cellDimensions;
  const spriteWidth = cellWidth * 3;  // Aumenta o tamanho do sprite
  const spriteHeight = cellHeight * 3;

  const preload = (p5) => {
    spriteSheetRef.current = p5.loadImage(char);
  };

  const setup = (p5, canvasParentRef) => {
    const canvas = p5.createCanvas(spriteWidth, spriteHeight).parent(canvasParentRef);
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

    const centerX = spriteWidth / 2;
    const centerY = spriteHeight / 2;

    // Lógica de animação do personagem
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
        spriteWidth,
        spriteHeight
      );
    } else {
      p5.fill(0, 255, 0);
      p5.ellipse(centerX, centerY, spriteWidth);
    }

    // Efeito de alerta (luz amarela)
    if (isAlert || isPanic) {
      p5.push();
      p5.translate(centerX, centerY);

      const time = p5.millis() * 0.005;

      // Tamanho da luz - pulsando com o tempo
      const lightSize = Math.sin(time * 2.5) * 8 + 24;

      // Cor da luz
      const lightColor = isPanic
        ? [255, 0, 0, 150]  // Vermelho para pânico
        : [255, 255, 0, 150];  // Amarelo para alerta

      // Desenha a luz ao redor do personagem
      p5.noStroke();
      p5.fill(...lightColor);
      p5.ellipse(0, 0, lightSize); // Desenha a luz como um círculo em torno do personagem
      p5.pop();
    }
  };

  useEffect(() => {
    p5Ref.current?._p5Instance?.redraw();
  }, [position, moveDirection, lastDirection, isAlert, isPanic]);

  // Cálculo da posição do personagem
  const left = position.x * cellWidth + (cellWidth - spriteWidth) / 2;
  const top = position.y * cellHeight + (cellHeight - spriteHeight) / 2;

  return (
    <div
      style={{
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
        width: `${spriteWidth}px`,
        height: `${spriteHeight}px`,
        pointerEvents: "none",
        zIndex: 2,
        ...style,
      }}
    >
      <Sketch preload={preload} setup={setup} draw={draw} />
    </div>
  );
}

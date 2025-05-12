import { useRef, useEffect } from 'react';
import Sketch from 'react-p5';
import char from "../assets/Basic Charakter Spritesheet.png";

export default function RenderPlayerMove({
  position,
  moveDirection = null,
  lastDirection = "down",
  isAlert = false,
  isPanic = false,
  cellDimensions,
  maze
}) {
  const spriteSheetRef = useRef();
  const animationFrames = useRef({ down: [], left: [], right: [], up: [] });
  const currentFrame = useRef(0);
  const frameCount = useRef(0);
  const canvasRef = useRef();

  // Configurações de animação
  const totalFrames = 4;
  const animationSpeed = 0.1;
  const { cellWidth, cellHeight } = cellDimensions;
  
  // Tamanho do sprite (ajustado para ficar proporcional)
  const spriteWidth = cellWidth * 3;
const spriteHeight = cellHeight * 3;

  const preload = (p5) => {
    spriteSheetRef.current = p5.loadImage(char);
  };

  const setup = (p5, canvasParentRef) => {
    // Canvas do tamanho do labirinto (igual às moedas)
    const canvas = p5.createCanvas(
      cellWidth * maze[0].length,
      cellHeight * maze.length
    ).parent(canvasParentRef);
    
    p5.noStroke();
    canvasRef.current = canvas;

    // Carrega os frames da spritesheet
    if (spriteSheetRef.current) {
      const frameWidth = spriteSheetRef.current.width / totalFrames;
      const frameHeight = spriteSheetRef.current.height / 4;

      const directionsOrder = ["down", "up", "left", "right"];
      directionsOrder.forEach((dir, rowIndex) => {
        animationFrames.current[dir] = [];
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
    
    // Posição centralizada (cálculo idêntico às moedas)
    const centerX = position.x * cellWidth + cellWidth / 2;
    const centerY = position.y * cellHeight + cellHeight / 2;

    // Lógica de animação
    if (moveDirection) {
      frameCount.current += animationSpeed;
      currentFrame.current = Math.floor(frameCount.current) % totalFrames;
    } else {
      currentFrame.current = 1; // Frame estático quando parado
    }

    // Renderização do sprite
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
    }

    // Efeitos visuais
    if (isAlert || isPanic) {
      p5.push();
      p5.translate(centerX, centerY);
      
      const time = p5.millis() * 0.005;
      const lightSize = Math.sin(time * 2.5) * 8 + 24;
      
      p5.noStroke();
      p5.fill(isPanic ? [255, 0, 0, 150] : [255, 255, 0, 150]);
      p5.ellipse(0, 0, lightSize);
      
      p5.pop();
    }
  };

  // Atualização quando as props mudam
  useEffect(() => {
    canvasRef.current?._p5Instance?.redraw();
  }, [position, moveDirection, lastDirection, isAlert, isPanic]);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      pointerEvents: 'none',
      zIndex: 2 // Acima do labirinto, abaixo das moedas
    }}>
      <Sketch preload={preload} setup={setup} draw={draw} />
    </div>
  );
}

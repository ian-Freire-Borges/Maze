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
  maze,
  powerPickRef,
  nivel
}) {
  const spriteSheetRef = useRef();
  const animationFrames = useRef({ down: [], left: [], right: [], up: [] });
  const currentFrame = useRef(0);
  const frameCount = useRef(0);
  const canvasRef = useRef();
  const particlesRef = useRef([]); // Partículas de cristal

  const totalFrames = 4;
  const animationSpeed = 0.09;
  const { cellWidth, cellHeight } = cellDimensions;

  const spriteWidth = cellWidth * 3;
  const spriteHeight = cellHeight * 3;

  const preload = (p5) => {
    spriteSheetRef.current = p5.loadImage(char);
  };

  const setup = (p5, canvasParentRef) => {
    const canvas = p5.createCanvas(
      cellWidth * maze[0].length,
      cellHeight * maze.length
    ).parent(canvasParentRef);

    p5.noStroke();
    canvasRef.current = canvas;

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

    const centerX = position.x * cellWidth + cellWidth / 2;
    const centerY = position.y * cellHeight + cellHeight / 2;

    if (moveDirection) {
      frameCount.current += animationSpeed;
      currentFrame.current = Math.floor(frameCount.current) % totalFrames;
    } else {
      currentFrame.current = 1;
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
    }

    // Efeitos visuais de alerta/pânico
// Efeitos visuais de alerta/pânico (dentro da função draw)
if (isAlert || isPanic) {
  p5.push();
  p5.translate(centerX, centerY);

  // Tamanhos definidos (mínimo e máximo relativo ao sprite)
  const minSize = Math.min(spriteWidth, spriteHeight) * 0.05; // 5% do tamanho - bem pequeno
  const maxSize = Math.min(spriteWidth, spriteHeight) * 0.25; // 25% do tamanho
  
  // Tempo de crescimento (0 a 1) em 0.5 segundos
  const growthProgress = Math.min(1, (p5.millis() % 2000) / 500); 
  
  // Interpolação suave do tamanho
  const currentBaseSize = p5.lerp(minSize, maxSize, easeOutQuad(growthProgress));
  
  // Pulsação sutil (5% de variação)
  const pulse = Math.sin(p5.millis() * 0.01) * 0.05 * currentBaseSize;
  const finalSize = currentBaseSize + pulse;

  // Cor com transparência que também aumenta
  const alpha = p5.lerp(50, 120, growthProgress);
  p5.noStroke();
  p5.fill(
    isPanic ? [255, 70, 70, alpha] :  // Vermelho
    [255, 255, 80, alpha]             // Amarelo
  );

  // Desenha o efeito
  p5.ellipse(0, 0, finalSize, finalSize);
  
  p5.pop();
}

// Função de easing para suavizar a animação
function easeOutQuad(t) {
  return t * (2 - t);
}

    // Efeito de partículas tipo cristal (powerPickRef)
    if (powerPickRef.current) {
      const particleCount = 1;
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 2 + 1.5;
        const vx = Math.cos(angle) * 0.2;
        const vy = Math.sin(angle) * 0.2;
            let color;
    switch(nivel) {
      case 0:
      case 1:
        color = [0, 255, 136]; // Verde cristal (RGB)
        break;
      case 2:
        color = [170, 0, 255]; // Roxo cristal
        break;
      case 3:
        color = [255, 51, 0];  // Vermelho cristal
        break;
      case 4:
        color = [0, 102, 255]; // Azul cristal
        break;
      default:
        color = [0, 255, 136]; // Padrão (verde)
    }

        particlesRef.current.push({
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          vx,
          vy,
          alpha: 180,
          size: Math.random() * 1 + 1.5, 
          angle: angle,
          rotationSpeed: (Math.random() - 0.5) * 0.1,
          color: color
        });
      }
    }

    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 2.5;
      p.angle += p.rotationSpeed;

      if (p.alpha <= 0) {
        particlesRef.current.splice(i, 1);
        continue;
      }

      p5.push();
      p5.translate(p.x, p.y);
      p5.rotate(p.angle);
      p5.noStroke();
      p5.fill(...p.color, p.alpha); 
      p5.beginShape();
      p5.vertex(0, -p.size);
      p5.vertex(p.size * 0.5, 0);
      p5.vertex(0, p.size);
      p5.vertex(-p.size * 0.5, 0);
      p5.endShape(p5.CLOSE);
      p5.pop();
    }
  };

  useEffect(() => {
    canvasRef.current?._p5Instance?.redraw();
  }, [position, moveDirection, lastDirection, isAlert, isPanic]);

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

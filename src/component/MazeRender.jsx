import { useRef, useEffect, useState } from 'react';
import Sketch from 'react-p5';
import florestwall from "../assets/Florestwall.png";
import door from "../assets/pixel_door.png";
import florestflor1 from "../assets/tile3.png";
import florestflor3 from "../assets/tile4.png";
import florestflor2 from "../assets/tile5.png";
import bigtree from "../assets/Tree1.png";
import cuttree from "../assets/Tree2.png";
import bigscristal from "../assets/bigcristal.png";
import smallscristal from "../assets/smalcristal.png";
import critalmediun from "../assets/cristalmediun.png";
import critalverysmal from "../assets/critalverysmal.png";
import cristalsmal2 from "../assets/cristalsmal2.png";
import cristallwallfloor from "../assets/cristalcavewall1.png";
import cristalflor from "../assets/cristallflor.png";

export default function MazeRender({ mazeLayout, wrapperRef, onCellDimensionsChange, nivel }) {
  const wall1Ref = useRef();
  const doorRef = useRef();
  const flor1Ref = useRef();
  const flor2Ref = useRef();
  const flor3Ref = useRef();
  const objectwall1Ref = useRef();
  const objectwall2Ref = useRef();
  const objectwall3Ref = useRef();
  const objectwall4Ref = useRef();
  const objectwall5Ref = useRef();

  const wallMapRef = useRef([]);
  const pathMapRef = useRef([]);
  const overlayMapRef = useRef([]);

  const cellSizeRef = useRef(20);
  const [canvasKey, setCanvasKey] = useState(0);
  const [wrapperReady, setWrapperReady] = useState(false);

  let objectwall1, objectwall2, wall1, flor1, flor2, flor3;
  if (nivel === 1 || nivel === 0 || nivel === 3)  {
    objectwall1 = bigtree;
    objectwall2 = cuttree;
    wall1 = florestwall;
    flor1 = florestflor1;
    flor3 = florestflor2;
    flor2 = florestflor3;
  } else if (nivel === 2) {
    objectwall1 = bigscristal;
    objectwall2 = smallscristal;
    wall1 = cristallwallfloor;
    flor1 = cristalflor;
    flor2 = cristalflor;
    flor3 = cristalflor;
  }

  useEffect(() => {
    if (!wrapperRef?.current) return;

    const checkDimensions = () => {
      if (wrapperRef.current.offsetWidth > 0 && wrapperRef.current.offsetHeight > 0) {
        setWrapperReady(true);
      } else {
        setWrapperReady(false);
      }
    };

    checkDimensions();

    const observer = new ResizeObserver(() => {
      checkDimensions();
      setCanvasKey(prev => prev + 1);
    });

    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, [wrapperRef]);

  const preload = (p5) => {
    wall1Ref.current = p5.loadImage(wall1);
    doorRef.current = p5.loadImage(door);
    flor1Ref.current = p5.loadImage(flor1);
    flor2Ref.current = p5.loadImage(flor2);
    flor3Ref.current = p5.loadImage(flor3);
    objectwall1Ref.current = p5.loadImage(objectwall1);
    objectwall2Ref.current = p5.loadImage(objectwall2);
    objectwall3Ref.current = p5.loadImage(critalmediun);
    objectwall4Ref.current = p5.loadImage(critalverysmal);
    objectwall5Ref.current = p5.loadImage(cristalsmal2);
  };

  const setup = (p5, canvasParentRef) => {
    if (!wrapperReady || !wrapperRef?.current) return;

    const cols = mazeLayout[0].length;
    const rows = mazeLayout.length;

    const availableWidth = wrapperRef.current.offsetWidth;
    const availableHeight = wrapperRef.current.offsetHeight;

    const cellSize = Math.floor(Math.min(
      availableWidth / cols,
      availableHeight / rows
    ));

    const canvasWidth = cellSize * cols;
    const canvasHeight = cellSize * rows;

    cellSizeRef.current = cellSize;

    if (onCellDimensionsChange) {
      onCellDimensionsChange({ cellWidth: cellSize, cellHeight: cellSize });
    }

    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);

    wallMapRef.current = [];
    pathMapRef.current = [];
    overlayMapRef.current = [];

    for (let row = 0; row < rows; row++) {
      wallMapRef.current[row] = [];
      pathMapRef.current[row] = [];
      overlayMapRef.current[row] = [];

      for (let col = 0; col < cols; col++) {
        const val = mazeLayout[row][col];

        if (val === 1) {
          wallMapRef.current[row][col] = wall1Ref.current;
          if (nivel === 1 || nivel === 0 || nivel === 3) {
            overlayMapRef.current[row][col] = Math.random() < 0.7
              ? objectwall1Ref.current
              : objectwall2Ref.current;
          } else if (nivel === 2) {
            const random = Math.random();
            let img = null;
            if (random <= 0.2) img = objectwall1Ref.current;
            else if (random <= 0.4) img = objectwall2Ref.current;
            else if (random <= 0.6) img = objectwall3Ref.current;
            else if (random <= 0.8) img = objectwall4Ref.current;
            else img = objectwall5Ref.current;

            overlayMapRef.current[row][col] = {
              image: img,
              pulseOffset: Math.random() * Math.PI * 2
            };
          }
        } else if (val === 0 || val === 2 || val === 4) {
          const rand = Math.random();
          if (rand < 0.4) pathMapRef.current[row][col] = flor1Ref.current;
          else if (rand < 0.7) pathMapRef.current[row][col] = flor3Ref.current;
          else pathMapRef.current[row][col] = flor2Ref.current;
        }
      }
    }

    p5.frameRate(30);
  };

  const draw = (p5) => {
    if (!wrapperReady) return;
    const cellSize = cellSizeRef.current;

    for (let row = 0; row < mazeLayout.length; row++) {
      for (let col = 0; col < mazeLayout[0].length; col++) {
        const x = col * cellSize;
        const y = row * cellSize;
        const val = mazeLayout[row][col];

        if (val === 1) {
          const overlay = overlayMapRef.current[row][col];
          if (nivel === 2 && overlay?.image) {
            p5.image(wallMapRef.current[row][col], x, y, cellSize, cellSize);
            p5.image(overlay.image, x, y, cellSize, cellSize);

            // Brilho intermitente
            const pulse = Math.abs(Math.sin(p5.frameCount * 0.05 + overlay.pulseOffset));
            const pulseThreshold = 0.4;

            if (pulse > pulseThreshold) {
              const brightness = p5.map(pulse, pulseThreshold, 1, 120, 255); // mais opaco
              const glowAlpha = p5.map(pulse, pulseThreshold, 1, 30, 100); // brilho de fundo mais suave
              const dotSize = cellSize * 0.18;
              const glowSize = cellSize * 0.4;

              p5.noStroke();
              // brilho ao redor
              p5.fill(255, 0, 0, glowAlpha); // brilho vermelho mais intenso
              p5.ellipse(x + cellSize / 2, y + cellSize / 2, glowSize);

              // ponto central vibrante
              p5.fill(255, 0, 0, brightness); // ponto vermelho vivo e forte
              p5.ellipse(x + cellSize / 2, y + cellSize / 2, dotSize);
            }

          } else {
            p5.image(wallMapRef.current[row][col], x, y, cellSize, cellSize);
            if (overlay) p5.image(overlay, x, y, cellSize, cellSize);
          }

        } else if (val === 0 || val === 2 || val === 4) {
          const path = pathMapRef.current[row][col];
          if (path) p5.image(path, x, y, cellSize, cellSize);
        } else if (val === 3) {
          if (doorRef.current) {
            p5.image(doorRef.current, x, y, cellSize, cellSize);
          } else {
            p5.fill(150, 50, 50);
            p5.rect(x, y, cellSize, cellSize);
          }
        }
      }
    }

    if (nivel === 2) {
      p5.fill(0, 0, 0, 100);
      p5.noStroke();
      p5.rect(0, 0, p5.width, p5.height);
    }
  };

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!wrapperReady ? (
        <div className="loading-message">Preparando labirinto...</div>
      ) : (
        <Sketch key={canvasKey} preload={preload} setup={setup} draw={draw} />
      )}
    </div>
  );
}

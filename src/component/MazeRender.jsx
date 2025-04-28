import { useRef, useEffect, useState } from 'react';
import Sketch from 'react-p5';
import wall1 from "../assets/FlorestWall.png";
import door from "../assets/pixel_door.png";
import tile3 from "../assets/tile3.png";
import tile4 from "../assets/tile4.png";
import tile5 from "../assets/tile5.png";
import bush from "../assets/Tree1.png";
import miniBush from "../assets/Tree2.png";

export default function MazeRender({ mazeLayout, wrapperRef, onCellDimensionsChange }) {
  const wall1Ref = useRef();
  const doorRef = useRef();
  const tile3Ref = useRef();
  const tile4Ref = useRef();
  const tile5Ref = useRef();
  const bushRef = useRef();
  const miniBushRef = useRef();

  const wallMapRef = useRef([]);
  const pathMapRef = useRef([]);
  const overlayMapRef = useRef([]);

  const cellSizeRef = useRef(20);
  const [canvasKey, setCanvasKey] = useState(0);
  const [wrapperReady, setWrapperReady] = useState(false);

  // Observador para verificar quando o wrapper está pronto
  useEffect(() => {
    if (!wrapperRef?.current) return;

    const checkDimensions = () => {
      if (wrapperRef.current.offsetWidth > 0 && wrapperRef.current.offsetHeight > 0) {
        setWrapperReady(true);
      } else {
        setWrapperReady(false);
      }
    };

    // Verificação inicial
    checkDimensions();

    // Configura o ResizeObserver
    const observer = new ResizeObserver(() => {
      checkDimensions();
      setCanvasKey(prev => prev + 1); // Força recriação do canvas se dimensões mudarem
    });

    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, [wrapperRef]);

  const preload = (p5) => {
    wall1Ref.current = p5.loadImage(wall1);
    doorRef.current = p5.loadImage(door);
    tile3Ref.current = p5.loadImage(tile3);
    tile4Ref.current = p5.loadImage(tile4);
    tile5Ref.current = p5.loadImage(tile5);
    bushRef.current = p5.loadImage(bush);
    miniBushRef.current = p5.loadImage(miniBush);
  };

  const setup = (p5, canvasParentRef) => {
    // Não renderiza se o wrapper não estiver pronto
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

    // Inicializa os mapas
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
          overlayMapRef.current[row][col] = Math.random() < 0.7
            ? bushRef.current
            : miniBushRef.current;
        } else if (val === 0 || val === 2 || val === 4) {
          const rand = Math.random();
          if (rand < 0.4) pathMapRef.current[row][col] = tile3Ref.current;
          else if (rand < 0.7) pathMapRef.current[row][col] = tile5Ref.current;
          else pathMapRef.current[row][col] = tile4Ref.current;
        }
      }
    }

    p5.frameRate(30);
  };

  const draw = (p5) => {
    if (!wrapperReady) return;

    const cellSize = cellSizeRef.current;
    p5.background(240);

    for (let row = 0; row < mazeLayout.length; row++) {
      for (let col = 0; col < mazeLayout[0].length; col++) {
        const x = col * cellSize;
        const y = row * cellSize;
        const val = mazeLayout[row][col];

        if (val === 1) {
          const wall = wallMapRef.current[row][col];
          const overlay = overlayMapRef.current[row][col];
          if (wall) p5.image(wall, x, y, cellSize, cellSize);
          if (overlay) p5.image(overlay, x, y, cellSize, cellSize);
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
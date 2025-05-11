import { useRef, useEffect, useState } from 'react';
import Sketch from 'react-p5';
import florestwall from "../assets/Florestwall.png";
import door from "../assets/door.png";
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
import dungeowall1 from "../assets/free_lava_tiles1-1.png.png";
import dungeoflor1 from "../assets/DungeonTile00.png";
import dungeoflor2 from "../assets/DungeonTile01.png";
import dungeoflor3 from "../assets/DungeonTile02.png";
import dungeoflor4 from "../assets/DungeonTile04.png";

export default function MazeRender({ mazeLayout, wrapperRef, onCellDimensionsChange, nivel }) {
  // Refs
  const wallRefs = {
    wall1: useRef(),
    wall2: useRef(),
    wall3: useRef()
  };
  
  const floorRefs = {
    flor1: useRef(),
    flor2: useRef(),
    flor3: useRef()
  };
  
  const objectRefs = {
    object1: useRef(),
    object2: useRef(),
    object3: useRef(),
    object4: useRef(),
    object5: useRef()
  };
  
  const doorRef = useRef();
  const wallMapRef = useRef([]);
  const pathMapRef = useRef([]);
  const overlayMapRef = useRef([]);
  const cellSizeRef = useRef(20);
  const [canvasKey, setCanvasKey] = useState(0);
  const [wrapperReady, setWrapperReady] = useState(false);

 
  const getAssetsForLevel = () => {
    switch(nivel) {
      case 2: 
        return {
          walls: [cristallwallfloor],
          floors: [cristalflor, cristalflor, cristalflor],
          objects: [bigscristal, smallscristal, critalmediun, critalverysmal, cristalsmal2],
          hasOverlayObjects: true
        };
      case 3: 
        return {
          walls: [dungeowall1],
          floors: [dungeoflor1, dungeoflor2, dungeoflor3, dungeoflor4],
          objects: [],
          hasOverlayObjects: false
        };
      default: 
        return {
          walls: [florestwall],
          floors: [florestflor1, florestflor3, florestflor2],
          objects: [bigtree, cuttree],
          hasOverlayObjects: true
        };
    }
  };

  const assets = getAssetsForLevel();

 
  useEffect(() => {
    if (!wrapperRef?.current) return;

    const checkDimensions = () => {
      setWrapperReady(wrapperRef.current.offsetWidth > 0 && wrapperRef.current.offsetHeight > 0);
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
    assets.walls.forEach((wall, index) => {
      wallRefs[`wall${index+1}`].current = p5.loadImage(wall);
    });
    
    doorRef.current = p5.loadImage(door);
    floorRefs.flor1.current = p5.loadImage(assets.floors[0]);
    floorRefs.flor2.current = p5.loadImage(assets.floors[1]);
    floorRefs.flor3.current = p5.loadImage(assets.floors[2]);
    
    assets.objects.forEach((obj, index) => {
      if (index < 5) objectRefs[`object${index+1}`].current = p5.loadImage(obj);
    });
  };

  
  const setup = (p5, canvasParentRef) => {
    if (!wrapperReady || !wrapperRef?.current) return;

    const cols = mazeLayout[0].length;
    const rows = mazeLayout.length;
    const cellSize = Math.floor(Math.min(
      wrapperRef.current.offsetWidth / cols,
      wrapperRef.current.offsetHeight / rows
    ));

    cellSizeRef.current = cellSize;
    onCellDimensionsChange?.({ cellWidth: cellSize, cellHeight: cellSize });

    p5.createCanvas(cellSize * cols, cellSize * rows).parent(canvasParentRef);

   
    wallMapRef.current = Array(rows).fill().map(() => Array(cols).fill(null));
    pathMapRef.current = Array(rows).fill().map(() => Array(cols).fill(null));
    overlayMapRef.current = Array(rows).fill().map(() => Array(cols).fill(null));

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const val = mazeLayout[row][col];

        if (val === 1) {
          wallMapRef.current[row][col] = wallRefs.wall1.current;
          
          if (nivel === 3) {
            
            if (Math.random() < 0.2) {
              overlayMapRef.current[row][col] = {
                nextSplash: Math.floor(Math.random() * 30) + 10, 
                particles: []
              };
            } else {
              
              overlayMapRef.current[row][col] = {
                nextSplash: Math.floor(Math.random() * 300) + 180, 
                particles: []
              };
            }
          } else if (assets.hasOverlayObjects) {
            if (nivel === 2) {
              const random = Math.random();
              let img;
              if (random <= 0.2) img = objectRefs.object1.current;
              else if (random <= 0.4) img = objectRefs.object2.current;
              else if (random <= 0.6) img = objectRefs.object3.current;
              else if (random <= 0.8) img = objectRefs.object4.current;
              else img = objectRefs.object5.current;

              overlayMapRef.current[row][col] = {
                image: img,
                pulseOffset: Math.random() * Math.PI * 2
              };
            } else {
              overlayMapRef.current[row][col] = Math.random() < 0.7
                ? objectRefs.object1.current
                : objectRefs.object2.current;
            }
          }
        } 
        else if (val === 0 || val === 2 || val === 4 || val === 5) {
          const rand = Math.random();
          pathMapRef.current[row][col] = 
            rand < 0.4 ? floorRefs.flor1.current :
            rand < 0.7 ? floorRefs.flor3.current :
            floorRefs.flor2.current;
        }
      }
    }

    p5.frameRate(30);
  };

  
  const drawCrystalEffect = (p5, x, y, cellSize, overlay) => {
    const pulse = Math.abs(Math.sin(p5.frameCount * 0.05 + overlay.pulseOffset));
    const pulseThreshold = 0.4;

    if (pulse > pulseThreshold) {
      const brightness = p5.map(pulse, pulseThreshold, 1, 120, 255);
      const glowAlpha = p5.map(pulse, pulseThreshold, 1, 30, 100);
      const dotSize = cellSize * 0.18;
      const glowSize = cellSize * 0.4;

      p5.noStroke();
      p5.fill(255, 0, 0, glowAlpha);
      p5.ellipse(x + cellSize / 2, y + cellSize / 2, glowSize);

      p5.fill(255, 0, 0, brightness);
      p5.ellipse(x + cellSize / 2, y + cellSize / 2, dotSize);
    }
  };

  
  const drawLavaSplash = (p5, x, y, cellSize, overlayData) => {
    
    p5.image(wallRefs.wall1.current, x, y, cellSize, cellSize);

    
    if (p5.frameCount > overlayData.nextSplash) {
    
      overlayData.nextSplash = p5.frameCount + 450 + Math.random() * 450;
      
    
      for (let i = 0; i < 1 + Math.floor(Math.random() * 2); i++) {
        overlayData.particles.push({
          x: x + cellSize/2 + (Math.random() - 0.5) * cellSize * 0.3,
          y: y + cellSize,
          size: 3 + Math.random() * 3,
          speedY: -0.5 - Math.random() * 0.3,
          speedX: (Math.random() - 0.5) * 0.1,
          life: 120 + Math.random() * 60,
          alpha: 180 + Math.random() * 40
        });
      }
    }

   
    p5.blendMode(p5.ADD);
    overlayData.particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.life--;
      p.alpha *= 0.985;

      p5.fill(255, 100 + (1 - p.life/180) * 80, 0, p.alpha);
      p5.ellipse(p.x, p.y, p.size);
    });
    p5.blendMode(p5.BLEND);

    
    overlayData.particles = overlayData.particles.filter(p => p.life > 0);
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
          if (nivel === 3) {
            drawLavaSplash(p5, x, y, cellSize, overlayMapRef.current[row][col]);
          } else {
            p5.image(wallMapRef.current[row][col], x, y, cellSize, cellSize);
            if (overlayMapRef.current[row][col] && assets.hasOverlayObjects) {
              if (nivel === 2) {
                p5.image(overlayMapRef.current[row][col].image, x, y, cellSize, cellSize);
                drawCrystalEffect(p5, x, y, cellSize, overlayMapRef.current[row][col]);
              } else {
                p5.image(overlayMapRef.current[row][col], x, y, cellSize, cellSize);
              }
            }
          }
        } 
        else if ([0, 2, 4,5].includes(val)) {
          p5.image(pathMapRef.current[row][col], x, y, cellSize, cellSize);
        } 
        else if (val === 3) {
          p5.image(doorRef.current, x, y, cellSize, cellSize);
        }
      }
    }
  };

  return (
    <div ref={wrapperRef} style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      {wrapperReady ? (
        <Sketch key={canvasKey} preload={preload} setup={setup} draw={draw} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
import { useState, useRef, useEffect } from 'react'; 
import Menu from './router/Menu';
import './App.css';
import menuImage from './assets/tilesetOpenGameBackground.png';
import cristal from "./assets/caveRemasteredV7.png"
import lavacave from "./assets/lavacave.jpg"
import End from './router/End';
import useMaze from "./component/MazeMap"
import MazePage from './router/MazePage';
import Win from './router/Win';
import florestimage from './assets/6271267.jpg'
import winerimg from './assets/freepik__pixel-art-background-for-a-victory-screen-confetti__20051.png'
import ScoreBoard from './router/ScoreBoard';
import iceimg from './assets/5.png'
import musicMenu from './assets/Music/musicMenu.mp3'
import musicLv1 from './assets/Music/Level1Music.mp3'
import musicLv2 from './assets/Music/Level2Music.mp3'
import musicLv3 from './assets/Music/Level3Music.mp3'
import musicLv4 from './assets/Music/Level4Music.mp3'
import musicVictory from './assets/Music/victory.mp3'
import musicEnd from './assets/Music/endMusic.mp3'
import coindSound from './assets/Music/coin-recieved-230517.mp3'
import PowerSound from './assets/Music/power-up-type-1-230548.mp3'


function App() { 
  const [nivel, setNivel] = useState(1);
  const { mazeLayout, gerarNovoMaze } = useMaze(nivel);
  const [mazeKey, setMazeKey] = useState(0);
  const [screen, setScreen] = useState('MENU');
  const [gameResult, setGameResult] = useState(null);
  const [score, setScore] = useState(0);
  const [devMode, setDevMove] = useState(false);
  const [levelCheck, setLevelCheck] = useState(false);
  const [infinityMode, setInfinityMode] = useState( localStorage.getItem("infinityMode") === "true");
  const [trueInfinityMode, setTrueInfinityMode] = useState(false);
  const [progressoInfinito, setProgressoInfinito] = useState(0);
  const audioRef = useRef(null);
  const [audioSrc, setAudioSrc] = useState(musicMenu);
  const [hasClicked, setHasClicked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
   const coinAudioRef = useRef(null);
  const powerAudioRef = useRef(null);

useEffect(() => {
  const handleUnlockAudio = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.1;
      audioRef.current.play().catch(() => {
        // Ignora erro (normal no mobile se não houver interação)
      });
    }
    window.removeEventListener('click', handleUnlockAudio);
    window.removeEventListener('touchstart', handleUnlockAudio);
  };

  window.addEventListener('click', handleUnlockAudio, { once: true });
  window.addEventListener('touchstart', handleUnlockAudio, { once: true });

  return () => {
    window.removeEventListener('click', handleUnlockAudio);
    window.removeEventListener('touchstart', handleUnlockAudio);
  };
}, []);


useEffect(() => {
  if (audioRef.current) {
    if (isPlaying && hasClicked) {
      audioRef.current.volume = 0.1;
      audioRef.current.play().catch(console.warn);
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0;
    }
  }

  // Controla os efeitos sonoros com reset completo
  if (coinAudioRef.current) {
    if (isPlaying && hasClicked) {
      coinAudioRef.current.volume = 0.4;
    } else {
      coinAudioRef.current.pause();
      coinAudioRef.current.currentTime = 0;
      coinAudioRef.current.volume = 0;
    }
  }

  if (powerAudioRef.current) {
    if (isPlaying && hasClicked) {
      powerAudioRef.current.volume = 0.4;
    } else {
      powerAudioRef.current.pause();
      powerAudioRef.current.currentTime = 0;
      powerAudioRef.current.volume = 0;
    }
  }

}, [isPlaying, audioSrc, hasClicked]);

useEffect(() => {
  coinAudioRef.current = new Audio(coindSound);
  powerAudioRef.current = new Audio(PowerSound);
  powerAudioRef.current.preload = 'auto'
  powerAudioRef.current.volume = 0.4;
  coinAudioRef.current.preload = 'auto';
  coinAudioRef.current.volume = 0.4;
}, []);

useEffect(() => {
  if(screen === "MAZE"){
    switch(nivel){
      case 1:
        setAudioSrc(musicLv1);
      break

      case 2:
        setAudioSrc(musicLv2);
        break

      case 3:
        setAudioSrc(musicLv3);
        break

      case 4:
        setAudioSrc(musicLv4);
        break

      default:
        setAudioSrc(musicLv1);
        break
    }
}
 else if (screen === "MENU") {
    setAudioSrc(musicMenu);
  }else if(screen === "END"){
    setAudioSrc(musicEnd )
  }else if(screen === "WINNER"){
    setAudioSrc(musicVictory)
  }
 
}, [screen, nivel]);

useEffect(() => {
  const handleUserClick = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.1;
      audioRef.current.play().catch(console.warn);
    }
    setHasClicked(true);
    window.removeEventListener("click", handleUserClick);
  };

  if (!hasClicked) {
    window.addEventListener("click", handleUserClick);
  }

  return () => {
    window.removeEventListener("click", handleUserClick);
  };
}, [hasClicked, isPlaying]);




// 3. Quando audioSrc muda e já houve clique, troca a música
useEffect(() => {
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.src = audioSrc;
    audioRef.current.load();
    audioRef.current.loop = screen !== "END" && screen !== "WINNER";

    // Só toca se isPlaying === true
    if (isPlaying) {
      audioRef.current.play().catch(console.warn);
    }
  }
}, [audioSrc]);




  useEffect (()=>{
     if (levelCheck) {
    setInfinityMode(true);
    localStorage.setItem("infinityMode", "true"); // Armazena no localStorage
  } 
  },[levelCheck])
 

  const getBackgroundImage = () => {
    if (screen === 'SCORE') return menuImage;
    if (!devMode && screen === 'MENU') return menuImage;
    
    switch(nivel) {
      case 2: return cristal;
      case 3: return lavacave;
      case 4: return iceimg;
      case 1: return (devMode || screen !== 'MENU') ? florestimage : menuImage;
      default: return menuImage;
    }
  };

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(${getBackgroundImage()})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
     <audio ref={audioRef} src={audioSrc} />
      {screen === 'MENU' && (<Menu setScreen={setScreen} setMazeKey={setMazeKey} gerarNovoMaze={gerarNovoMaze} setNivel={setNivel} nivel={nivel} setScore={setScore} setDevMove={setDevMove} devMode={devMode} infinityMode={infinityMode} trueInfinityMode={trueInfinityMode} setTrueInfinityMode={setTrueInfinityMode}setProgressoInfinito={setProgressoInfinito} setIsPlaying={setIsPlaying} isPlaying={isPlaying}/>)}

      {screen === 'MAZE' && (<div key={mazeKey}><MazePage mazeLayout={mazeLayout} setScreen={setScreen} setGameResult={setGameResult} nivel={nivel} setScore={setScore} score={score} devMode={devMode} coinAudioRef={coinAudioRef} powerAudioRef={powerAudioRef}isPlaying={isPlaying}/></div>)}

      {screen === 'END' && (<End setScreen={setScreen} gameResult={gameResult} score={score} trueInfinityMode={trueInfinityMode} nivel={nivel} progressoInfinito={progressoInfinito}/>)}

      {screen === 'WINNER' && (<Win setScreen={setScreen} gameResult={gameResult} score={score} nivel={nivel} setNivel={setNivel}setMazeKey={setMazeKey} gerarNovoMaze={gerarNovoMaze} levelCheck={levelCheck} setLevelCheck={setLevelCheck} trueInfinityMode={trueInfinityMode} progressoInfinito={progressoInfinito} setProgressoInfinito={setProgressoInfinito}/>)}

      {screen === "SCORE" && <ScoreBoard setScreen={setScreen}/>}
    </div>
  );
}

export default App;
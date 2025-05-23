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
  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.015;
      audioRef.current.play().catch((err) => {
        console.warn("Erro ao tentar tocar o áudio:", err);
      });
    }
    window.removeEventListener("click", playMusic); // remove após tocar
  };

  if (audioSrc) {
    window.addEventListener("click", playMusic);
  }

  return () => {
    window.removeEventListener("click", playMusic);
  };
}, [audioSrc]);


// 2. Executa o áudio no primeiro clique
useEffect(() => {
  const handleClick = () => {
    if (audioRef.current && !hasClicked) {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.015;
      audioRef.current.play().catch(console.warn);
      setHasClicked(true);
    }
  };

  window.addEventListener("click", handleClick);

  return () => {
    window.removeEventListener("click", handleClick);
  };
}, [hasClicked]);

// 3. Quando audioSrc muda e já houve clique, troca a música
useEffect(() => {
  if (audioRef.current && hasClicked && audioSrc) {
    audioRef.current.pause();
    audioRef.current.src = audioSrc;
    audioRef.current.load();

    audioRef.current.loop = screen !== "END" && screen !== "WINNER";
    audioRef.current.play().catch(console.warn);
  }
}, [audioSrc, hasClicked]);




  useEffect (()=>{
     if (levelCheck) {
    setInfinityMode(true);
    localStorage.setItem("infinityMode", "true"); // Armazena no localStorage
  } 
  },[levelCheck])
 

  const getBackgroundImage = () => {
    if (levelCheck) return winerimg;
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
      {screen === 'MENU' && (<Menu setScreen={setScreen} setMazeKey={setMazeKey} gerarNovoMaze={gerarNovoMaze} setNivel={setNivel} nivel={nivel} setScore={setScore} setDevMove={setDevMove} devMode={devMode} infinityMode={infinityMode} trueInfinityMode={trueInfinityMode} setTrueInfinityMode={setTrueInfinityMode}setProgressoInfinito={setProgressoInfinito}/>)}
      {screen === 'MAZE' && (<div key={mazeKey}><MazePage mazeLayout={mazeLayout} setScreen={setScreen} setGameResult={setGameResult} nivel={nivel} setScore={setScore} score={score} devMode={devMode}/></div>)}
      {screen === 'END' && (<End setScreen={setScreen} gameResult={gameResult} score={score} trueInfinityMode={trueInfinityMode} nivel={nivel} progressoInfinito={progressoInfinito}/>)}
      {screen === 'WINNER' && (<Win setScreen={setScreen} gameResult={gameResult} score={score} nivel={nivel} setNivel={setNivel}setMazeKey={setMazeKey} gerarNovoMaze={gerarNovoMaze} levelCheck={levelCheck} setLevelCheck={setLevelCheck} trueInfinityMode={trueInfinityMode} progressoInfinito={progressoInfinito} setProgressoInfinito={setProgressoInfinito}/>)}
      {screen === "SCORE" && <ScoreBoard setScreen={setScreen}/>}
    </div>
  );
}

export default App;
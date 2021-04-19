import './App.css';
import React, {useState} from 'react';
import {GAME_STATUS} from './constants';
import GameBoard from './components/gameboard.jsx';
import Popup from './components/popup.jsx';

function App() 
{
  
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.CREATING);
  const [gameResults, setGameResults] = useState({}); 
  
  const handleStatusUpdate = (newStatus, results) => 
  {
    setGameStatus(newStatus);
    if (newStatus === GAME_STATUS.FINISHED) 
    {
      setGameResults(results);
    }
  };

  return( 
  <div className="app">
      <header className="header">
        <h1 className="header-title">League of Memory</h1>
      </header>
      <div >
        <GameBoard gameStatus={gameStatus} onGameUpdate={handleStatusUpdate} />
        {gameStatus === GAME_STATUS.FINISHED && (<Popup onReset={handleStatusUpdate} results={gameResults} />)}
      </div>
      <footer className="footer">
        Created by Abraham Rivera
        <br/>
        Check my other apps on <a href="https://github.com/R-arzep">Github</a>
      </footer>
  </div>
  );
}

export default App;

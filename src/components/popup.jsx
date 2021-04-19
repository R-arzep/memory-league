import React from "react";
import { GAME_STATUS } from "../constants";
import './popup.css';

const Popup = (props) => 
{
  const handleReset = () => 
  {
    props.onReset(GAME_STATUS.CREATING);
  };

  return (
    <div className='root'>
      <div>Congratulations Summoner, you've won!</div>
      <div>
        <div>
          <b>Cards flipped:</b>
          {props.results.flips} times
        </div>
        <div>
          <b>Time taken:</b> {props.results.time}
        </div>
      </div>
      <button className='button' onClick={handleReset}>
        Play Again
      </button>
    </div>
  );
};

export default Popup;
import React, { useState, useEffect, useCallback, useRef } from "react";
import './gameboard.css';
import Card from "./card.jsx";
import GameService from "../services";
import { CARD_STATUS, GAME_STATUS, DECK_SIZE } from "../constants";

const DELAY = 800;

const GameBoard = ({gameStatus,onGameUpdate}) => 
{
    const [deck, setDeck] = useState({});
    const [isChecking, setIsChecking] = useState(false);
    const [firstCard, setFirstCard] = useState(null);
    const [secondCard, setSecondCard] = useState(null);
    const [faceUpCounter, setFaceUpCounter] = useState(0);

    const flipCounter = useRef(0);
    const [startTime, setStartTime] = useState(null);

    const resetCards = () => 
    {
        setFirstCard(null);
        setSecondCard(null);
        setIsChecking(false);
    };
    const checkPair = useCallback(() => 
    {
        if(firstCard && secondCard)
        {
            const first = { ...deck[firstCard.index] };
            const second = { ...deck[secondCard.index] };

            if (firstCard.id === secondCard.id) 
            {
                first.status = CARD_STATUS.MATCHED;
                second.status = CARD_STATUS.MATCHED;
            } 
            else 
            {
                first.status = CARD_STATUS.HIDDEN;
                second.status = CARD_STATUS.HIDDEN;
            }
            const newDeck =
            {
                ...deck,
                [firstCard.index]:first,
                [secondCard.index]:second
            };

            setTimeout( () => setDeck(newDeck),DELAY);
            setTimeout( () => resetCards(), DELAY);
            
        }
    }, [deck, firstCard, secondCard]);

    const toggleCard = (index, status) =>
    {
        const newDeck = {...deck};
        const newCard = {...newDeck[index]};
        newCard.status = status;

        newDeck[index] = newCard;
        setDeck(newDeck);
    };
    const handleClick = (index, id) => 
    {
        if(isChecking)return true;

        flipCounter.current++;
        if(faceUpCounter < 2)
        {
            const newCount = faceUpCounter + 1;
            const newCard = {index, id};
            setFaceUpCounter(newCount);

            if(newCount === 1)
            {
                setFirstCard(newCard);
            }
            else
            {
                setSecondCard(newCard);
                setIsChecking(true);
            }
            toggleCard(index, CARD_STATUS.SELECTED);
        }
    };
    const flipAllCards = useCallback(() => 
    {
        setDeck((prevDeck) => 
        {
          const lastCard = Object.keys(deck).find((key) => deck[key].status === CARD_STATUS.HIDDEN);
          if (lastCard) 
          {
            const remainder = { ...deck[lastCard], status: CARD_STATUS.SELECTED };
    
            const newDeck = 
            {
              ...deck,
              [lastCard]: remainder,
            };
            return newDeck;
          }
          return prevDeck;
        });
      }, [deck]);
    /**
   * Check if the all cards are matched and game is finished
   */
  const checkGameFinished = useCallback(() => 
  {
    console.log(flipCounter.current);
    if (faceUpCounter === 0) 
    {
      const matches = Object.keys(deck).filter((key) => deck[key].status === CARD_STATUS.MATCHED);
      // Game is finished
      if (matches.length === DECK_SIZE - 1) 
      {
        onGameUpdate(GAME_STATUS.FINISHED, 
        {
          flips: flipCounter.current,
          time: `${(new Date() - startTime) / 1000} seconds`,
        });
      }
    } 
    else if (faceUpCounter === 2) 
    {
      setFaceUpCounter(0);
      checkPair();
    }
  }, [checkPair, deck, faceUpCounter, onGameUpdate, startTime]);

  const initializeGame = useCallback(async () => 
  {
    onGameUpdate(GAME_STATUS.LOADING);
    setDeck(await GameService());
    flipCounter.current = 0;
    setStartTime(new Date());
    onGameUpdate(GAME_STATUS.IN_PROGRESS);
  }, [onGameUpdate]);
  useEffect(() => {
    console.log(gameStatus);
    // Set up the game
    if (gameStatus === GAME_STATUS.CREATING) {
      initializeGame();
    } else if (gameStatus === GAME_STATUS.IN_PROGRESS) {
      checkGameFinished();
    } else if (gameStatus === GAME_STATUS.FINISHED) 
    {
      flipAllCards();
    }
  }, [checkGameFinished, initializeGame, flipAllCards, gameStatus]);
  return (
    <div className='board'>
      {gameStatus === GAME_STATUS.LOADING
        ? "Loading..."
        : Object.entries(deck).map(([key, value]) => {
            return (
              <Card
                key={key}
                index={key}
                data={value}
                click={handleClick}
              />
            );
          })}
    </div>
  );
};

export default GameBoard;
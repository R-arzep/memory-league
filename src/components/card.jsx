import React,{useState} from 'react';
import './card.css';
import {CARD_STATUS} from '../constants';

const Card = ({data,click,index}) => 
{
    const [isLoaded, setIsLoaded] = useState(false);
    const {id , url, status} = data;
    const isSelected = status === CARD_STATUS.SELECTED;
    const isMatched = status === CARD_STATUS.MATCHED;
    const onCardClick = () => 
    {
        if(status === CARD_STATUS.HIDDEN){click(index , id)}
    }
    const handleImageLoad = () => setIsLoaded(true);

    return(
    <div className={`card ${isSelected?'selected':""} ${isMatched?'matched':""}`} onClick={onCardClick}>
        <div className='front'>
            <img src={url} alt="champion" onLoad={handleImageLoad}/>
        </div>
        <div className='back'>{!isLoaded && "Loading"}</div>
    </div>)
};

export default Card;
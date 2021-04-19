
import { CARD_STATUS, DECK_SIZE} from "../constants";

const BASE_URL = 'https://ddragon.leagueoflegends.com/cdn/img/champion/loading/';

const gameService = async () => 
{
    const urls = await getRandomUrl();
    const deck = urls.concat(urls);
    while( deck.length > DECK_SIZE){deck.pop()}
    const shuffledDeck = deck.sort( () => 0.5 - Math.random());
    return shuffledDeck;
}

async function fetchChamps()
{
    const res = await fetch('https://ddragon.leagueoflegends.com/cdn/11.8.1/data/en_US/champion.json');   
    const dataRaw = await res.json();
    const champions = Object.keys(dataRaw.data);
    return champions;
} 
async function fetchImages(champion)
{
    const apiUrl = `${BASE_URL}${champion}_0.jpg`;
    const res = await fetch(apiUrl);
    const image = await res.blob();
    const outsider = URL.createObjectURL(image);
    return outsider;
} 
async function getRandomUrl()
{
    const arrayUrl = [];
    const imageSet = new Set();
    const champList = await fetchChamps();
    while( imageSet.size < Math.ceil(DECK_SIZE / 2))
    {
        const i = Math.floor( Math.random() * champList.length) + 1;
        if (champList[i])
        {
            const champ = champList[i];
            const imgChamp = await fetchImages(champ);
            if (!imageSet.has(champ))
            {
                imageSet.add(champ);
                arrayUrl.push(
                    {
                        id: champ,
                        url: imgChamp,
                        status: CARD_STATUS.HIDDEN
                    });
            }
        }
    }
    return arrayUrl;
}

export default gameService;
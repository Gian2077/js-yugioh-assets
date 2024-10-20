const state =
{
    score:
    {
        playerScore: 0,
        cpuScore: 0,
        scoreBox: document.getElementById("score-points"),
    },
    cardSprites:
    {
        img: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),

    },
    fieldCards:
    {
        player: document.getElementById("player-field-card"),
        cpu: document.getElementById("cpu-field-card"),
    },
    actions:
    {
        button: document.getElementById("next-duel"),
    },
    side:
    {
    player: "player-cards",
    playerBox: document.querySelector("#player-cards"),
    cpu: "cpu-cards",
    cpuBox: document.querySelector("#cpu-cards"),
    },
};

const side =
{
    player: "player-cards",
    cpu: "cpu-cards",
};
const pathImages = "./src/assets/icons/"
const cardData =
[
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Papel",
        img: `${pathImages}dragon.png`,
        winOf: [1],
        loseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Pedra",
        img: `${pathImages}magician.png`,
        winOf: [2],
        loseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Tesoura",
        img: `${pathImages}exodia.png`,
        winOf: [0],
        loseOf: [1],
    },
]

async function getRandomCardId()
{
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide)
{
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if(fieldSide === side.player)
    {
        cardImage.addEventListener("mouseover", () =>
        {
            drawSelectedCard(IdCard);
        });

        cardImage.addEventListener('click', () =>
        {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }

    return cardImage;
}

async function setCardsField(cardId)
{
    await removeAllCardImages();
    let cpuCardId = await getRandomCardId();
    
    showCardsImages(true)
    await hideCardDetails()

    await drawCardsInField(cardId, cpuCardId)

    let duelResults = await checkDuelResults(cardId, cpuCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawButton(text)
{
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function updateScore()
{
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.cpuScore}`
}

async function checkDuelResults(playerCardId, cpuCardId)
{
    let duelResults = "Empate";
    let playerCard = cardData[playerCardId];
    if (playerCard.winOf.includes(cpuCardId))
    {
        duelResults = "Ganhou!";
        await playAudio("win");
        state.score.playerScore++;
    }
    if (playerCard.loseOf.includes(cpuCardId))
    {
        duelResults = "Perdeu =(";
        await playAudio("lose");
        state.score.cpuScore++;
    }

    return duelResults;
}

async function removeAllCardImages()
{
    let { cpuBox , playerBox} = state.side;
    let imgElements = cpuBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = playerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectedCard(index)
{
    state.cardSprites.img.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = `Atribute: ${cardData[index].type}`;
}

async function  drawCards(cardNumbers, fieldSide)
{
    for (let i = 0; i < cardNumbers; i++)
    {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        console.log(fieldSide)
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function drawCardsInField(cardId, cpuCardId)
{
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.cpu.src = cardData[cpuCardId].img;
}

async function showCardsImages(value)
{
    if(value === true)
    {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.cpu.style.display = "block";
    }
    if(value === false)
    {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.cpu.style.display = "none";
    }
}

async function hideCardDetails()
{
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
    state.cardSprites.img.src = "";
}

async function resetDuel()
{
    state.cardSprites.img.src = "";
    state.actions.button.style.display = "none";
    state.fieldCards.player.style.display = "none";
    state.fieldCards.cpu.style.display = "none";

    init();
}

async function playAudio(status)
{
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function init()
{
    showCardsImages(false)
    drawCards(5, side.player);
    drawCards(5, side.cpu);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();
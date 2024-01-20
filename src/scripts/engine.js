const state = {
    score: {
        playerScore: 0,
        cpuScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCard: {
        player: document.getElementById("player-field-card"),
        cpu: document.getElementById("cpu-field-card"),
    },
    playerSides: {
        player: "player-card",
        playerBox: document.querySelector("#player-card"),
        cpu: "cpu-card",
        cpuBox: document.querySelector("#cpu-card"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
    media: {
        bgm: document.getElementById("bgm"),
    }  
};

const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Papel",
        img: `${pathImages}dragon.png`,
        WinOf:[1],
        LoseOf:[2],
    },
    {
        id: 1,
        name: "Darck Magician",
        type: "Pedra",
        img: `${pathImages}magician.png`,
        WinOf:[2],
        LoseOf:[0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Tesoura",
        img: `${pathImages}exodia.png`,
        WinOf:[0],
        LoseOf:[1],
    },
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;    
};

async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    if (fieldSide === state.playerSides.player) {
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });

        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(idCard);
        });
    };

    return cardImage;
};

async function setCardsField(cardId) {
    await removeAllCardsImages();    

    let cpuCardId = await getRandomCardId();

    state.fieldCard.player.style.display = "block";
    state.fieldCard.cpu.style.display = "block";

    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";

    state.fieldCard.player.src = cardData[cardId].img;
    state.fieldCard.cpu.src = cardData[cpuCardId].img;

    let duelResult = await checkDuelResults(cardId, cpuCardId);

    await updateScore();
    await drawButton(duelResult);
};

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
};

async function updateScore() {
    state.score.scoreBox.innerText = 
        `Win: ${state.score.playerScore} | Lose: ${state.score.cpuScore}`;
}

async function checkDuelResults (playerCardId, cpuCardId) {
    let duelResuts = "Empate";
    let playerCard = cardData[playerCardId];
    if (playerCard.WinOf.includes(cpuCardId)) {
        duelResuts = "Ganhou";
        await playAudio("win");
        state.score.playerScore++;
    }    
    if (playerCard.LoseOf.includes(cpuCardId)) {
        duelResuts = "Perdeu";
        await playAudio("lose");
        state.score.cpuScore++;
    };

    return duelResuts;
};

async function removeAllCardsImages() {
    let { cpuBox, playerBox } = state.playerSides;
    let imageElements = cpuBox.querySelectorAll("img");
    imageElements.forEach((img) => img.remove());

    imageElements = playerBox.querySelectorAll("img");
    imageElements.forEach((img) => img.remove());
};

async function drawSelectCard (index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Atributo: " + cardData[index].type;
};

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        
        document.getElementById(fieldSide).appendChild(cardImage);
    };    
};

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCard.player.style.display = "none";
    state.fieldCard.cpu.style.display = "none";

    state.cardSprites.name.innerText = "Selecione uma";
    state.cardSprites.type.innerText = "CARTA";
    main();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.volume = 0.3;
    audio.play();
}
async function playBgm() {
    state.media.bgm.volume = 0.3;    
    state.media.bgm.play();    
}

function main() {
    state.fieldCard.player.style.display = "none";
    state.fieldCard.cpu.style.display = "none";
    drawCards(5, state.playerSides.player);
    drawCards(5, state.playerSides.cpu);
    playBgm();
};

main();

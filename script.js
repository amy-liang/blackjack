// Blackjack in JavaScript
// Via Pluralsight Javascript: Getting Started Tutorial

// DOM Variables
const dealerLabel = document.getElementById("dealerLabel");
const playerLabel = document.getElementById("playerLabel");
const resultLabel = document.getElementById("resultLabel");
const dealerSection = document.getElementById("dealerCards");
const playerSection = document.getElementById("playerCards");
const newGameButton = document.getElementById("newGameButton");
const hitButton = document.getElementById("hitButton");
const stayButton = document.getElementById("stayButton");

// Game Variables
const suits = ["Hearts","Clubs","Diamonds","Spades"];
const values = ["Ace","Two","Three","Four","Five","Six","Seven",
                "Eight","Nine","Ten","Jack","Queen","King"]

let gameStarted = false,
    gameOver = false,
    playerWon = false,
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [];

// Game Functions
function getCardValue(card){
    let val = -1;
    values.forEach(function(cardValue, index){
        if (cardValue == card && index > 9) {
            val = 10;
        } else if (cardValue == card) {
            val = index + 1;
        }
    });
    return val;
}

function getScore(cardArray){
    let score = 0;
    let hasAce = false;

    for (let i = 0; i < cardArray.length; i++) {
        let cardValue = getCardValue(cardArray[i].value);
        score += cardValue;
        if (cardArray[i].value === "Ace") {
            hasAce = true;
        }
    }

    if (hasAce && score + 10 <= 21) {
        return score + 10;
    }

    return score;
}

function updateScores(){
    dealerScore = getScore(dealerCards);
    playerScore = getScore(playerCards);
}

function getRandomCard(owner){
    let randomNum = Math.trunc(Math.random() * deck.length);
    let randomCard = deck[randomNum];
    deck.splice(randomNum, 1);

    addDivCard(randomCard.value, randomCard.suit, owner);

    return randomCard;
}

function getCardString(card){
    return card.value + " of " + card.suit;
}

function checkEndGame(){
    updateScores();
    if (gameOver){
        while(dealerScore < playerScore &&
              playerScore < 21 && dealerScore < 21){
                dealerCards.push(getRandomCard("dealer"));
                updateScores();
        }
    }

    if (playerScore > 21 || dealerScore == 21) {
        playerWon = false;
        gameOver = true;
    } else if (dealerScore > 21 || playerScore == 21){
        playerWon = true;
        gameOver = true;
    } else if (gameOver) {
        if (playerScore > dealerScore) {
            playerWon = true;
        } else {
            playerWon = false;
        }
    }

    newGameButton.style.display

}

function showGameStatus(){
    if (!gameStarted) {
        return;
    } 

    updateScores();

    dealerLabel.innerText = "Dealer Cards (Score: " + dealerScore + ")";
    playerLabel.innerText = "Player Cards (Score: " + playerScore + ")";

    if (gameOver) {
        newGameButton.style.display = "inline";
        hitButton.style.display = "none";
        stayButton.style.display = "none";
        if (playerWon) {
            resultLabel.innerHTML += "\n\nPLAYER WINS";
        } else {
            resultLabel.innerHTML += "\n\nDEALER WINS";
        }
    }

}

function newDeck(){
    deck = [];
    for (let i = 0; i < suits.length; i++){
        for (let j = 0; j < values.length; j++) {

            let card = { //card object
                suit: suits[i],
                value: values[j]
            };
            deck.push(card);
        }
    }
}

// DOM/Display Functions
function addDivCard(value, suit, owner){

    // Card itself
    let divHTML = document.createElement("div");
    divHTML.classList.add("card");

    const valueArray = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
    let valueText = valueArray[values.indexOf(value)];

    // Value

    let valueHTML = document.createElement("p");
    valueHTML.appendChild(document.createTextNode(valueText));
    valueHTML.classList.add("value");

    let suitText = "\u2665";

    if (suit === "Spades") {
        suitText = "\u2660";
    } else if (suit === "Diamonds"){
        suitText = "\u25C6";
    } else if (suit === "Clubs"){
        suitText = "\u2663";
    }

    // Suit

    let suitHTML = document.createElement("p");
    suitHTML.appendChild(document.createTextNode(suitText));
    suitHTML.classList.add("suit");

    // Colour

    if (suit === "Spades" || suit === "Clubs") {
        valueHTML.classList.add("blackCard");
        suitHTML.classList.add("blackCard");
    } else {
        valueHTML.classList.add("redCard");
        suitHTML.classList.add("redCard");
    }

    // Append to section

    divHTML.appendChild(valueHTML);
    divHTML.appendChild(suitHTML);

    if (owner === "dealer") {
        dealerSection.appendChild(divHTML);
    } else {
        playerSection.appendChild(divHTML);
    }
}

// Event Handlers
hitButton.addEventListener("click",function(){
    playerCards.push(getRandomCard("player"));
    checkEndGame();
    showGameStatus();
});

stayButton.addEventListener("click",function(){
    gameOver = true;
    checkEndGame();
    showGameStatus();
});

newGameButton.addEventListener("click",function(){
    dealerSection.innerHTML = "";
    playerSection.innerHTML = "";
    resultLabel.innerHTML = "";

    newGameButton.style.display = "none";
    hitButton.style.display = "inline";
    stayButton.style.display = "inline";

    document.getElementsByClassName("vcenter")[0].style.visibility = "visible";

    gameStarted = true;
    gameOver = false;
    playerWon = false;

    newDeck();
    dealerCards = [getRandomCard("dealer"),getRandomCard("dealer")];
    playerCards = [getRandomCard("player"),getRandomCard("player")];

    checkEndGame();
    showGameStatus();
});

// if dealer gets 5 cards, they win
// calculate tie
 // Array com as URLS das imagens
const imageUrls = [
    'img/r34.webp',
    'img/r35.jpg',
    'img/dodge1970.avif',
    'img/challenger.jpg',
    'img/eclipse.webp',
    'img/rx7.avif',
    'img/supra.jpg',
    'img/evo.avif'
];

const clickSound = new Audio('sounds/sfx-office-post-it.mp3');
const matchSound = new Audio('sounds/goodresult-82807.mp3');
const noMatchSound = new Audio('sounds/error-96563.mp3');
const winSound = new Audio('sounds/c6rrect-156911.mp3');

// Variaveis globais do jogo
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let gameStarted = false;
let startTime = null;
let timerInterval = null;

// Pega os elementos HTML que vamos usar
const gameBoard = document.getElementById('gameBoard');
const attemptsSpan = document.getElementById('attempts');
const timeSpan = document.getElementById('time');
const messageDiv = document.getElementById('message');
const resetBtn = document.getElementById('resetBtn');
const matchedPairsSpan = document.getElementById('matchedPairs');

// Função que embaralha um array (algoritimo Fisher-Yates)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j] = shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function createCardsArray() {
    const pairs = [...imageUrls, ...imageUrls];//Duplica cada imagem para jogadores
    return shuffleArray(pairs);//Embaralha as cartas
}

function createCardElement(imageUrl, index)  {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    card.dataset.image = imageUrl;

    card.innerHTML = `
    <div class="card-face card-back">?</div>
    <div class="card-face card-front">
        <img src="${imageUrl}" alt="Carta ${index}">
    </div>

    `; 

    card.addEventListener('click', () => flipCard(card));

    return card;
}

function flipCard(card) {
    if (!gameStarted) {
        startGame();
    }

    if (card.classList.add('flipped') ||
    card.classList.add('matched') ||
    flippedCards.length >= 2) {
     return;

    }

    card.classList.add('flipped');
    flippedCards.push(card);
    clickSound.currentTime = 0;
    clickSound.play();

    if (flippedCards.length === 2) {
        attempts++;
        attemptsSpan.textContent = attempts;

        setTimeout(checkMatch, 1000);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.image === card2.dataset.image) {
        matchSound.play();
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        matchedPairsSpan.textContent = matchedPairs;

        setTimeout(() => {
            card1.style.opacity = '0';
            card2.style.opacity = '0';
            card1.style.pointerEvents = 'none';
            card2.style.pointerEvents = 'none';
        }, 500);

        if (matchedPairs === 8) {
            endGame();
        }
    } else {
        noMatchSound.play();
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }

    flippedCards = [];
}

function startGame() {
    gameStarted = true;
    startTime = Date.now();

    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);

    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime %60;

    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}'`;
    timeSpan.textContent = formattedTime;
}

function endGame() {
    clearInterval(timerInterval);
    winSound.currentTime = 0;
    winSound,play();
    messageDiv.textContent = `🎉 Você ganhou em ${attempts} tentativas!`;
    messageDiv.classList.add('win-message');
    messageDiv.classList.add('show');
}

function resetGame() {
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    attempts = 0;
    gameStarted = false;
    startTime = null;

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    attemptsSpan.textContent = '0';
    timeSpan.textContent = '00:00';
    messageDiv.textContent = '';
    messageDiv.className = 'message';
    matchedPairsSpan.textContent = '0';

    initGame()
}

function initGame() {
    gameBoard.innerHTML = '';
    cards = createCardsArray();
    cards.forEach((imageUrls, index) => {
        const cardElement = createCardElement(imageUrls, index);
        gameBoard.appendChild(cardElement);
    });
}

resetBtn.addEventListener('click', resetGame);

initGame();

/*
=== GUIA RÁPIDO: for vs forEach ===

USE forEach QUANDO:
- Quer fazer algo com CADA item do array
- Não precisa parar no meio (break/continue)
- Código mais limpo e legível
- Exemplos: exibir dados, criar elementos HTML, aplicar função em todos

USE for QUANDO:
- Precisa de CONTROLE TOTAL do loop
- Pode precisar parar no meio (break) ou pular (continue)
- Precisa de performance máxima (for é mais rápido)
- Loop não é sobre arrays (contadores, condições complexas)
- Exemplos: buscar algo específico, loops com condições, otimização

RESUMO:
forEach = "Faça isso com cada item" (mais comum)
for = "Eu controlo exatamente como o loop funciona" (mais flexível)
*/
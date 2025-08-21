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
    card.classList.add('matched') |
    flippedCards.length >= 2) {
     return;

    }

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        attempts++;
        attemptsSpan.textContent = attempts;

        setTimeout(checkMatch, 1000);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.image === card2.dataset.image) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;

        if (matchedPairs === 8) {
            endGame();
        }
    } else {
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

    const formattedTime = `${minutes.toString().padStart(2, '0')}`;
    timeSpan.textContent = formattedTime;
}

function endGame() {
    clearInterval(timerInterval);
    messageDiv.textContent = `🎉 Você ganhou em ${attempts} tentativas!`;
    messageDiv.className = 'message-win-message';
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
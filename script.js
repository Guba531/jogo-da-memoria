// Array com as URLS das imagens
const imageUrls = [
    'img/r34.webp',
    'img/r35.jpg',
    'img/dodge1970.avif',
    'img/challenger.jpg',
    'img/1995_Mitsubishi_Eclipse.webp',
    'img/evo.webp',
    'img/supraMK4.jpg',
    'img/rx7.avif'
];

// Variaveis globais do jogo
let cards = [];
let flippedCards = [];
let matchedPair = 0;
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
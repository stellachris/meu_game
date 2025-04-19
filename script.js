// Selecionando os elementos HTML
let startButton = document.getElementById('startButton');
let gameArea = document.getElementById('gameArea');
let homer = document.getElementById('homer');
let donut = document.getElementById('donut');
let scoreDisplay = document.getElementById('score');
let lives = Array.from(document.getElementsByClassName('life'));
let gameOverMessage = document.getElementById('gameOverMessage');
let winMessage = document.getElementById('winMessage');
let restartButton = document.getElementById('restartButton');

// Variáveis do Jogo
let score = 0;
let currentLives = 3;
let gamePaused = false;
let donutsCaught = 0;
let homerSpeed = 30;
let donutInterval;

// Sons (Agora desabilitados)
let backgroundMusic = new Audio('audio/');
let catchSound = new Audio('audio/catch-sound.mp3');
let missSound = new Audio('audio/miss-sound.mp3');
let clickSound = new Audio('audio/click-sound.mp3');

// Definir o volume dos sons (se desejado)
backgroundMusic.volume = 0.1; // Música de fundo com volume baixo
catchSound.volume = 0.3; // Som de captura de donut
missSound.volume = 0.5; // Som de erro (missed donut)
clickSound.volume = 0.2; // Som de clique

// Iniciar o Jogo
startButton.addEventListener('click', startGame);

function startGame() {
    // Esconde a tela inicial e exibe a área do jogo
    gameArea.style.display = 'block';
    document.getElementById('startScreen').style.display = 'none';

    // Reinicia variáveis do jogo
    score = 0;
    currentLives = 3;
    donutsCaught = 0;
    scoreDisplay.innerText = `Pontos: ${score}`;
    lives.forEach(life => life.style.visibility = 'visible');
    gameOverMessage.style.display = 'none';
    winMessage.style.display = 'none';
    restartButton.style.display = 'none'; // Esconde o botão de reiniciar
    gamePaused = false; // Reinicia o estado do jogo
    document.addEventListener('keydown', moveHomer);

    // Inicia a música de fundo (se quiser)
    // backgroundMusic.play();
    // backgroundMusic.loop = true; // Música de fundo ficará em loop

    clickSound.play(); // Toca o som de clique ao iniciar
    generateDonut();
}

// Mover Homer
function moveHomer(e) {
    if (gamePaused) return; // Impede a movimentação se o jogo estiver pausado

    let homerLeft = parseInt(window.getComputedStyle(homer).left);
    let gameAreaWidth = gameArea.offsetWidth;
    let homerWidth = homer.offsetWidth;

    if (e.key === "ArrowLeft" && homerLeft > 0) {
        homer.style.left = homerLeft - homerSpeed + "px";
    }
    if (e.key === "ArrowRight" && homerLeft < gameAreaWidth - homerWidth) {
        homer.style.left = homerLeft + homerSpeed + "px";
    }
}

// Gerar Donuts
function generateDonut() {
    let xPosition = Math.random() * (gameArea.offsetWidth - donut.offsetWidth);
    donut.style.left = xPosition + "px";
    donut.style.top = "-50px"; // Começa acima da área visível

    let fallSpeed = 2 + Math.random() * 3; // Velocidade de queda do donut
    donutInterval = setInterval(function () {
        if (gamePaused) return; // Para o movimento dos donuts se o jogo estiver pausado

        let donutTop = parseInt(window.getComputedStyle(donut).top);
        if (donutTop < gameArea.offsetHeight) {
            donut.style.top = donutTop + fallSpeed + "px";
        } else {
            clearInterval(donutInterval);
            handleMissedDonut(); // Se o donut cair, perde uma vida
        }

        let donutRect = donut.getBoundingClientRect();
        let homerRect = homer.getBoundingClientRect();

        // Verifica se Homer pegou o donut
        if (
            donutRect.top + donutRect.height >= homerRect.top &&
            donutRect.left + donutRect.width >= homerRect.left &&
            donutRect.left <= homerRect.left + homerRect.width
        ) {
            handleCaughtDonut(); // Se Homer pegou o donut
        }
    }, 10);
}

// Quando Homer pegar o donut
function handleCaughtDonut() {
    score++;
    donutsCaught++;
    scoreDisplay.innerText = `Pontos: ${score}`;
    catchSound.play(); // Toca o som de captura de donut

    if (donutsCaught >= 3) {
        winGame(); // Se pegar 3 donuts, o jogo termina em vitória
    }

    clearInterval(donutInterval); // Remove o intervalo do donut anterior
    generateDonut(); // Gera um novo donut
}

// Quando Homer deixar o donut cair
function handleMissedDonut() {
    currentLives--;
    lives[currentLives].style.visibility = 'hidden';
    missSound.play(); // Toca o som de erro (quando o donut é perdido)

    if (currentLives === 0) {
        gameOver(); // Se não tiver mais vidas, fim de jogo
    } else {
        generateDonut(); // Se ainda tiver vidas, gera um novo donut
    }
}

// Fim do jogo (Game Over)
function gameOver() {
    gamePaused = true; // Pausa o jogo
    clearInterval(donutInterval);
    gameOverMessage.style.display = 'block';
    gameOverMessage.innerText = "Game Over!";
    restartButton.style.display = 'block'; // Mostra o botão de reiniciar
    // Pausa a música de fundo (se quiser)
    // backgroundMusic.pause();
    // backgroundMusic.currentTime = 0; // Reseta a música de fundo
}

// Vitória
function winGame() {
    gamePaused = true; // Pausa o jogo
    clearInterval(donutInterval);
    winMessage.style.display = 'block';
    winMessage.innerText = "Você Venceu!";
    restartButton.style.display = 'block'; // Mostra o botão de reiniciar
    // Pausa a música de fundo (se quiser)
    // backgroundMusic.pause();
    // backgroundMusic.currentTime = 0; // Reseta a música de fundo
}

// Reiniciar o Jogo
restartButton.addEventListener('click', function() {
    startGame(); // Reinicia o jogo
});

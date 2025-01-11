const p1ScoreEl = document.querySelector('.P1');
const p2ScoreEl = document.querySelector('.P2');
let game1Options = document.querySelectorAll('.box');
let game2Options = document.querySelectorAll('.pl2');
const allBoxes = [...game1Options, ...game2Options];
let p1Score = 0;
let p2Score = 0;
let gameOver = false;
let currentAudio = null;
let player1Choice = null;
let player2Choice = null;
let player1Images, player2Images;

// Event Listeners
game1Options.forEach(option => {
    option.addEventListener('click', () => {
        player1Choice = option.id.split('-')[1];
        console.log(`Player 1 choice: ${player1Choice}`);
        checkBothPlayersReady();
    });
});

game2Options.forEach(option => {
    option.addEventListener('click', () => {
        player2Choice = option.id.split('-')[1];
        console.log(`Player 2 choice: ${player2Choice}`);
        checkBothPlayersReady();
    });
});

// Game Logic
function determineWinner(p1, p2) {
    if (p1 === p2) return 'draw';
    if ((p1 === 'rock' && p2 === 'scissor') ||
        (p1 === 'paper' && p2 === 'rock') ||
        (p1 === 'scissor' && p2 === 'paper')) {
        return 'player1';
    }
    return 'player2';
}

function toggleGameOptions(enable) {
    allBoxes.forEach(option => option.style.pointerEvents = enable ? 'auto' : 'none');
}

function initializeGame() {
    const player1Card = document.querySelector('.card1');
    const player2Card = document.querySelector('.card2');
    if (!player1Card || !player2Card) {
        console.error('Cards not found!');
        return;
    }
    player1Images = player1Card.querySelectorAll('.svg');
    player2Images = player2Card.querySelectorAll('.svg');
    if (player1Images.length === 0 || player2Images.length === 0) {
        console.error('No images found inside cards!');
        return;
    }
}

function startShuffleAndPlayRound() {
    playMusic(false, false, true);
    let p1Interval = setInterval(() => {
        player1Images.forEach(img => img.style.display = 'none');
        player1Images[Math.floor(Math.random() * player1Images.length)].style.display = 'block';
    }, 300);

    let p2Interval = setInterval(() => {
        player2Images.forEach(img => img.style.display = 'none');
        player2Images[Math.floor(Math.random() * player2Images.length)].style.display = 'block';
    }, 300);

    setTimeout(() => {
        clearInterval(p1Interval);
        clearInterval(p2Interval);
        player1Images.forEach(img => img.style.display = 'none');
        player2Images.forEach(img => img.style.display = 'none');
        document.querySelector(`.card1 .svg[alt="${player1Choice}"]`).style.display = 'block';
        document.querySelector(`.card2 .svg[alt="${player2Choice}"]`).style.display = 'block';
        playRound(player1Choice, player2Choice);
    }, 3000);
}

function checkBothPlayersReady() {
    if (player1Choice && player2Choice) {
        toggleGameOptions(false);
        startShuffleAndPlayRound();
    }
}

function playRound(p1, p2) {
    if (gameOver) return;

    const winner = determineWinner(p1, p2);

    allBoxes.forEach(option => option.classList.remove('active', 'computer-choice'));
    allBoxes.forEach(option => {
        if (option.id.includes(p1)) option.classList.add('active');
        if (option.id.includes(p2)) option.classList.add('computer-choice');
    });

    setTimeout(() => {
        if (winner === 'player1') {
            playMusic(false, false, false, false, true);
            p1Score++;
            p1ScoreEl.textContent = `P1 - ${p1Score}`;
        } else if (winner === 'player2') {
            playMusic(false, false, false, false, false, true);
            p2Score++;
            p2ScoreEl.textContent = `${p2Score} - P2`;
        } else {
            playMusic(false, false, false, true);
            showNotification(`It’s a draw!🤣🤣`);
        }

        player1Choice = null;
        player2Choice = null;
        toggleGameOptions(true);

        if (p1Score === 5) {
            showNotification("Player 1 wins the game!", true);
            gameOver = true;
            playMusic(true);
            toggleGameOptions(false);
        } else if (p2Score === 5) {
            showNotification("Player 2 wins the game!", false, true);
            gameOver = true;
            playMusic(true);
            toggleGameOptions(false);
        }
    }, 1000);
}

// Initialize games
function setupGame(options, gameNumber) {
    options.forEach(option => {
        option.addEventListener('click', () => {
            const playerChoice = option.id.split('-')[1];
        });
    });
}

// Initialize games
setupGame(game1Options, 1);
setupGame(game2Options, 2);

// Function to show notifications
function showNotification(message, isFullScreen = false, isFullScreen2 = false) {
    const notification = document.createElement('div');
    notification.textContent = message;

    // Apply styles for full-screen notification
    if (isFullScreen) {
        notification.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(101, 106, 233, 0.52); color: white; display: flex; justify-content: center; align-items: center; font-size: 2rem; font-weight: bold; z-index: 10000;`;
    } else if (isFullScreen2) {
        notification.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(232, 67, 67, 0.52); color: white; display: flex; justify-content: center; align-items: center; font-size: 2rem; font-weight: bold; z-index: 10000;`;
    } else {
        notification.style.cssText = `position: absolute; top: 10px; right: 10px; background: #ffcc00; color: #000; padding: 10px 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); z-index: 1000;`;
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000); // Auto-dismiss after 3 seconds
}

// Add Reset Button
const resetButton = document.createElement('button');
resetButton.textContent = 'Reset Game';
resetButton.style.cssText = `position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); padding: 10px 20px; background-color: #fc5c8c; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);`;
document.body.appendChild(resetButton);

// Reset Scores and UI
resetButton.addEventListener('click', () => {
    p1Score = 0;
    p2Score = 0;
    gameOver = false;
    p1ScoreEl.textContent = `P1 - 0`;
    p2ScoreEl.textContent = `0 - P2`;
    allBoxes.forEach(option => option.classList.remove('active', 'computer-choice'));
    toggleGameOptions(true); // Re-enable game options

    // **Reset Image Visibility**
    const allCards = document.querySelectorAll('.card1, .card2');
    allCards.forEach(card => {
        const images = card.querySelectorAll('.svg');
        images.forEach(img => {
            img.style.display = 'none';
        });
    });

    showNotification('The game has been reset!');
});

// Function to play music when needed
function playMusic(win = false, lost = false, slogan = false, draw = false, p1add = false, p2add = false) {
    if (win) {
        currentAudio = new Audio('/audio/win.wav');
        currentAudio.play();
    } else if (lost) {
        currentAudio = new Audio('/audio/lost.wav');
        currentAudio.play();
    } else if (slogan) {
        currentAudio = new Audio('/audio/slogan.mp3');
        currentAudio.play();
    } else if (draw) {
        currentAudio = new Audio('/audio/draw.mp3');
        currentAudio.play();
    } else if (p1add) {
        currentAudio = new Audio('/audio/p1add.wav');
        currentAudio.play();
    } else if (p2add) {
        currentAudio = new Audio('/audio/p2add.wav');
        currentAudio.play();
    }
}

initializeGame();

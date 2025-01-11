const playBackgroundMusic = document.getElementById('BackgroundMusic');
playBackgroundMusic.volume = 0.3;

function toggleVolume() {
    const volumeIcon = document.getElementById('volume-icon');
    const backgroundMusic = document.getElementById('BackgroundMusic');

    if (backgroundMusic.paused) {
        backgroundMusic.play();
        volumeIcon.src = '/svg/volume-up-svgrepo-com.svg';  // Change icon to volume-up
    } else {
        backgroundMusic.pause();
        volumeIcon.src = '/svg/volume-off-svgrepo-com.svg';  // Change icon to volume-off
    }
}

// Get all elements
const p1ScoreEl = document.querySelector('.P1');
const p2ScoreEl = document.querySelector('.P2');
const game1Options = document.querySelectorAll('.bar1 .box');
const game2Options = document.querySelectorAll('.bar2 .box');
const allBoxes = [...game1Options, ...game2Options];
let p1Score = 0;
let p2Score = 0;
let gameOver = false;
let currentAudio = null; // Variable to store audio object

// Function to determine the winner
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) return 'draw';
    if (
        (playerChoice === 'rock' && computerChoice === 'scissor') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissor' && computerChoice === 'paper')
    ) {
        return 'player';
    }
    return 'computer';
}

// Function to get a random choice for the computer
function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissor'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

// Function to enable or disable game options
function toggleGameOptions(enable) {
    allBoxes.forEach(option => {
        option.style.pointerEvents = enable ? 'auto' : 'none';
    });
}

// Function to shuffle images and play the round
function shuffleImages(option, playerChoice) {
    if (gameOver) return; // Skip if game is over

    const box = option.closest('.game1') || option.closest('.game2');
    if (!box) {
        console.error('Box not found!');
        return; // Exit if the box is not found
    }

    const isPlayerGame = box.classList.contains('game1');
    const playerCard = isPlayerGame ? box.querySelector('.card1') : box.querySelector('.card2');
    const computerCard = document.querySelector('.card2');

    if (!playerCard || !computerCard) {
        console.error('Card1 or Card2 not found!');
        return;
    }

    const playerImages = playerCard.querySelectorAll('.svg');
    const computerImages = computerCard.querySelectorAll('.svg');

    if (playerImages.length === 0 || computerImages.length === 0) {
        console.error('No images found inside card!');
        return;
    }

    const playerImage = playerCard.querySelector(`.svg[alt="${playerChoice}"]`);
    const computerChoice = getComputerChoice();

    // Hide all images initially
    playerImages.forEach(img => img.style.display = 'none');
    computerImages.forEach(img => img.style.display = 'none');

    // Shuffle player images
    const playerInterval = setInterval(() => {
        playerImages.forEach(img => img.style.display = 'none');
        const randomImage = playerImages[Math.floor(Math.random() * playerImages.length)];
        randomImage.style.display = 'block';
    }, 300);

    // Shuffle computer images
    const computerInterval = setInterval(() => {
        computerImages.forEach(img => img.style.display = 'none');
        const randomImage = computerImages[Math.floor(Math.random() * computerImages.length)];
        randomImage.style.display = 'block';
    }, 300);

    // After 3 seconds, stop the shuffle and show the correct images
    setTimeout(() => {
        clearInterval(playerInterval);
        clearInterval(computerInterval);
        // Hide all images again before showing the correct ones
        playerImages.forEach(img => img.style.display = 'none');
        computerImages.forEach(img => img.style.display = 'none');

        // Show the correct player image
        if (playerImage) {
            playerImage.style.display = 'block';
        }

        // Show the correct computer image
        const computerImage = computerCard.querySelector(`.svg[alt="${computerChoice}"]`);
        if (computerImage) {
            computerImage.style.display = 'block';
        }

        playRound(playerChoice, allBoxes, computerChoice); // Pass computerChoice to playRound
    }, 3000); // Shuffle ends after 3 seconds
}

// Function to show notifications
function showNotification(message, isFullScreen = false, isFullScreen2 = false) {
    const notification = document.createElement('div');
    notification.textContent = message;

    // Apply styles for full-screen notification
    if (isFullScreen) {
        notification.style.cssText = `
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100vw; 
            height: 100vh; 
            background: rgba(101, 106, 233, 0.52); 
            color: white; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            font-size: 2rem; 
            font-weight: bold; 
            z-index: 10000;
        `;
    } else if (isFullScreen2) {
        notification.style.cssText = `
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100vw; 
            height: 100vh; 
            background: rgba(232, 67, 67, 0.52); 
            color: white; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            font-size: 2rem; 
            font-weight: bold; 
            z-index: 10000;
        `;
    } else {
        // Apply normal notification styles
        notification.style.cssText = `
            position: absolute; 
            top: 10px; 
            right: 10px; 
            background: #ffcc00;
            color: #000;
            padding: 10px 20px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            z-index: 1000;
        `;
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000); // Auto-dismiss after 3 seconds
}

// Add Reset Button
const resetButton = document.createElement('button');
resetButton.textContent = 'Reset Game';
resetButton.style.cssText = `
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    background-color: #fc5c8c;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
`;
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

// Ensure the images for both the player and computer are matched correctly
function playRound(playerChoice, gameOptions, computerChoice) {
    if (gameOver) return; // Skip if game is over

    const winner = determineWinner(playerChoice, computerChoice);

    gameOptions.forEach(option => option.classList.remove('active', 'computer-choice'));
    gameOptions.forEach(option => {
        if (option.id.includes(playerChoice)) option.classList.add('active');
        if (option.id.includes(computerChoice)) option.classList.add('computer-choice');
    });

    setTimeout(() => {
        console.log(`Player Choice: ${playerChoice}, Computer Choice: ${computerChoice}`);
        console.log(`Winner: ${winner}`);

        if (winner === 'player') {
            playMusic(false, false, false, false, true);
            p1Score++;
            p1ScoreEl.textContent = `P1 - ${p1Score}`;
        } else if (winner === 'computer') {
            playMusic(false, false, false, false, false, true);
            p2Score++;
            p2ScoreEl.textContent = `${p2Score} - P2`;
        } else {
            playMusic(false, false, false, true);
            showNotification(`It’s a draw!🤣🤣`);
        }

        // Check if a player wins the game
        if (p1Score === 5) {
            showNotification("You win the game!", true); // Full-screen notification
            gameOver = true;
            toggleGameOptions(false); // Disable game options
            playMusic(true); // Play music when Player 1 wins
        } else if (p2Score === 5) {
            showNotification("Bot wins the game!", false, true); // Full-screen notification
            gameOver = true;
            toggleGameOptions(false); // Disable game options
            playMusic(false, true); // Play music when Player 2 wins
        }
    }, 1000); // Update scores after shuffle is done
}

// Initialize games
function setupGame(options, gameNumber) {
    options.forEach(option => {
        option.addEventListener('click', () => {
            const playerChoice = option.id.split('-')[1];
            playMusic(false, false, true);
            shuffleImages(option, playerChoice);
        });
    });
}

// Initialize games
setupGame(game1Options, 1);
setupGame(game2Options, 2);

const game = document.getElementById('game');
const cat = document.getElementById('cat');
const scoreElement = document.getElementById('score');
const startMessage = document.getElementById('start-message');
const gameOverMessage = document.getElementById('game-over');

const fireworkContainer = document.createElement('div');
fireworkContainer.className = 'firework-container';
document.body.appendChild(fireworkContainer);

let gameStarted = false;
let gameOver = false;
let score = 0;
let catPosition = 250;
let velocity = 0;
let gravity = 0.5;
let obstacles = [];
let animationId;
let obstacleTimer;

function startGame() {
    if (gameOver) {
        resetGame();
    }
    gameStarted = true;
    startMessage.classList.add('hidden');
    gameOverMessage.classList.add('hidden');
    velocity = -8;
    createObstacle();
    obstacleTimer = setInterval(createObstacle, 2000);
    gameLoop();
}

function resetGame() {
    gameOver = false;
    score = 0;
    catPosition = 250;
    velocity = 0;
    scoreElement.textContent = `Score: ${score}`;
    obstacles.forEach(obstacle => obstacle.remove());
    obstacles = [];
    clearInterval(obstacleTimer);
    cancelAnimationFrame(animationId);
}

function checkCollision(catTop, catBottom, obstacleTop, gapHeight, obstacleLeft, obstacle) {
    // Only check collision if cat is within the horizontal bounds of the obstacle
    if (obstacleLeft < 90 && obstacleLeft > 40) {
        const obstacleHeight = parseInt(obstacle.style.height);
        // For top tube
        if (obstacleTop === 0) {
            if (catTop < obstacleHeight) {
                console.log('Collision with top tube');
                return true;
            }
        }
        // For bottom tube
        else {
            if (catBottom > 600 - obstacleHeight) {
                console.log('Collision with bottom tube');
                return true;
            }
        }
    }
    return false;
}

function createFirework(x, y) {
    const pyro = document.createElement('div');
    pyro.className = 'pyro';
    
    const before = document.createElement('div');
    before.className = 'before';
    
    const after = document.createElement('div');
    after.className = 'after';
    
    pyro.appendChild(before);
    pyro.appendChild(after);
    
    // Position the firework
    pyro.style.left = `${x}px`;
    pyro.style.top = `${y}px`;
    
    fireworkContainer.appendChild(pyro);
    
    // Remove the firework after animation completes
    setTimeout(() => {
        pyro.remove();
    }, 6000);
}

function gameLoop() {
    if (!gameStarted || gameOver) return;

    // Update cat position
    velocity += gravity;
    catPosition += velocity;
    cat.style.top = `${catPosition}px`;
    cat.style.transform = `rotate(${velocity * 2}deg)`;

    // Check collisions with top and bottom of the game area
    if (catPosition < 0 || catPosition > 550) {
        endGame();
        return;
    }

    // Move obstacles and check collisions
    obstacles.forEach((obstacle, index) => {
        const obstacleLeft = parseInt(obstacle.style.left);
        obstacle.style.left = `${obstacleLeft - 2}px`;

        // Check if obstacle is passed
        if (obstacleLeft === 48) {
            score++;
            scoreElement.textContent = `Score: ${score}`;
            // Create firework effect at the score position
            createFirework(48, catPosition);
        }

        // Check collision with obstacle
        if (obstacleLeft < 100 && obstacleLeft > 40) {
            const obstacleTop = parseInt(obstacle.style.top);
            const catTop = catPosition;
            const catBottom = catPosition + 40; // Cat height
            const gapHeight = 150; // Height of the gap

            if (checkCollision(catTop, catBottom, obstacleTop, gapHeight, obstacleLeft, obstacle)) {
                endGame();
                return;
            }
        }

        // Remove obstacle if it's off screen
        if (obstacleLeft < -60) {
            obstacle.remove();
            obstacles.splice(index, 1);
        }
    });

    animationId = requestAnimationFrame(gameLoop);
}

function createObstacle() {
    if (!gameStarted || gameOver) return;

    const gap = 150; // Gap between top and bottom obstacles
    const minHeight = 50;
    const maxHeight = 400;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

    const topObstacle = document.createElement('div');
    topObstacle.className = 'obstacle';
    topObstacle.style.height = `${topHeight}px`;
    topObstacle.style.top = '0';
    topObstacle.style.left = '400px';

    const bottomObstacle = document.createElement('div');
    bottomObstacle.className = 'obstacle';
    bottomObstacle.style.height = `${600 - topHeight - gap}px`;
    bottomObstacle.style.bottom = '0';
    bottomObstacle.style.left = '400px';

    game.appendChild(topObstacle);
    game.appendChild(bottomObstacle);
    obstacles.push(topObstacle, bottomObstacle);
}

function endGame() {
    gameOver = true;
    gameStarted = false;
    gameOverMessage.classList.remove('hidden');
    clearInterval(obstacleTimer);
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        if (!gameStarted) {
            startGame();
        } else if (!gameOver) {
            velocity = -8;
        }
    }
}); 
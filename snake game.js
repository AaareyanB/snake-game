const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

const MAX_SCORE = 256;
const FRAME_TIME = 125;

let score = 0;
let segments = [];
let gameOver = false;

const screenWidth = 32;
const screenHeight = 18;

let head = { x: 6, y: 9 };
let dir = { x: 1, y: 0 };

let berry = {
    x: Math.floor(Math.random() * screenWidth),
    y: Math.floor(Math.random() * screenHeight)
};


// Keyboard input
document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowLeft") {
        if (dir.x === 1) return;

        dir.x = -1;
        dir.y = 0;
    }

    if (event.key === "ArrowRight") {
        if (dir.x === -1) return;

        dir.x = 1;
        dir.y = 0;
    }

    if (event.key === "ArrowUp") {
        if (dir.y === 1) return;

        dir.x = 0;
        dir.y = -1;
    }

    if (event.key === "ArrowDown") {
        if (dir.y === -1) return;

        dir.x = 0;
        dir.y = 1;
    }

    if (event.key === "Escape") {
        gameOver = true;
    }

    // Restart
    if (event.key === " ") {
        score = 0;
        scoreDisplay.textContent = score;

        segments = [];
        gameOver = false;

        head = { x: 6, y: 9 };
        dir = { x: 1, y: 0 };

        berry = {
            x: Math.floor(Math.random() * screenWidth),
            y: Math.floor(Math.random() * screenHeight)
        };
    }
});


function gameLoop() {

    if (gameOver) {
        return;
    }

    // Move body
    for (let i = score; i > 0; i--) {
        segments[i] = segments[i - 1];
    }

    segments[0] = {
        x: head.x,
        y: head.y
    };

    // Move head
    head.x += dir.x;
    head.y += dir.y;


    // Border knockback and collision

    if (head.x >= screenWidth) {
        head.x = screenWidth - 2;

        for (let i = 0; i < score; i++) {
            segments[i].x--;
        }

        drawGame();
        gameOver = true;
        return;
    }


    if (head.x < 0) {
        head.x = 1;

        for (let i = 0; i < score; i++) {
            segments[i].x++;
        }

        drawGame();
        gameOver = true;
        return;
    }


    if (head.y >= screenHeight) {
        head.y = screenHeight - 2;

        for (let i = 0; i < score; i++) {
            segments[i].y--;
        }

        drawGame();
        gameOver = true;
        return;
    }


    if (head.y < 0) {
        head.y = 1;

        for (let i = 0; i < score; i++) {
            segments[i].y++;
        }

        drawGame();
        gameOver = true;
        return;
    }


    // Self collision
    for (let i = 0; i < score; i++) {

        if (
            head.x === segments[i].x &&
            head.y === segments[i].y
        ) {
            gameOver = true;

            console.log("GAME OVER");
            console.log("PRESS SPACE TO RESTART");
        }
    }


    // Berry collision
    if (head.x === berry.x && head.y === berry.y) {

        if (score < MAX_SCORE) {
            score++;
            scoreDisplay.textContent = score;
        }

        berry.x = Math.floor(Math.random() * screenWidth);
        berry.y = Math.floor(Math.random() * screenHeight);
    }


    // Draw everything
    drawGame();
}


function drawGame() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.strokeRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Draw berry
    ctx.fillRect(
        berry.x * 20,
        berry.y * 20,
        20,
        20
    );


    // Draw body
    for (let i = 0; i < score; i++) {

        ctx.fillRect(
            segments[i].x * 20,
            segments[i].y * 20,
            20,
            20
        );
    }


    // Draw head
    ctx.fillRect(
        head.x * 20,
        head.y * 20,
        20,
        20
    );
}


setInterval(gameLoop, FRAME_TIME);






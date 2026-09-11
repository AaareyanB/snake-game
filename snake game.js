const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

const MAX_SCORE = 253;
let FRAME_TIME = 125;
let gameInterval;

let score = 0;
let gameOver = false;

let segments = [
    { x: 5, y: 9 },
    { x: 4, y: 9 }
];

const screenWidth = 32;
const screenHeight = 18;

let head = { x: 6, y: 9 };
let dir = { x: 1, y: 0 };

let berry = {
    x: 0,
    y: 0
};


// =========================
// SPAWN BERRY
// =========================

function spawnBerry() {

    let validPosition = false;

    while (!validPosition) {

        berry.x = Math.floor(Math.random() * screenWidth);
        berry.y = Math.floor(Math.random() * screenHeight);

        validPosition = true;


        // Check head
        if (
            berry.x === head.x &&
            berry.y === head.y
        ) {

            validPosition = false;
        }


        // Check body
        for (let i = 0; i < segments.length; i++) {

            if (
                berry.x === segments[i].x &&
                berry.y === segments[i].y
            ) {

                validPosition = false;
                break;
            }
        }
    }
}


// =========================
// BUTTONS
// =========================

const speedOne = document.getElementById("speedOne");
const speedTwo = document.getElementById("speedTwo");
const speedThree = document.getElementById("speedThree");

const startButton = document.getElementById("startButton");
const gameOverButton = document.getElementById("gameOverButton");


// =========================
// CHANGE GAME SPEED
// =========================

function changeSpeed(speed) {

    FRAME_TIME = speed;

    clearInterval(gameInterval);

    gameInterval = setInterval(gameLoop, FRAME_TIME);
}


speedOne.addEventListener("click", function() {
    changeSpeed(125);
});


speedTwo.addEventListener("click", function() {
    changeSpeed(90);
});


speedThree.addEventListener("click", function() {
    changeSpeed(60);
});


// =========================
// RESET GAME
// =========================

function resetGame() {

    score = 0;
    scoreDisplay.textContent = score;

    segments = [
        { x: 5, y: 9 },
        { x: 4, y: 9 }
    ];

    gameOver = false;

    head = {
        x: 6,
        y: 9
    };

    dir = {
        x: 1,
        y: 0
    };

    spawnBerry();

    drawGame();
}


// =========================
// START BUTTON
// =========================

startButton.addEventListener("click", function() {

    resetGame();

});


// =========================
// END GAME BUTTON
// =========================

gameOverButton.addEventListener("click", function() {

    gameOver = true;

});


// =========================
// KEYBOARD INPUT
// =========================

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


    // Restart with Space
    if (event.key === " ") {

        resetGame();

    }
});


// =========================
// GAME LOOP
// =========================

function gameLoop() {

    if (gameOver) {
        return;
    }


    // =========================
    // MOVE BODY
    // =========================

    for (let i = segments.length - 1; i > 0; i--) {

        segments[i] = segments[i - 1];

    }


    segments[0] = {
        x: head.x,
        y: head.y
    };


    // Move head
    head.x += dir.x;
    head.y += dir.y;


    // =========================
    // BORDER KNOCKBACK
    // =========================

    if (head.x >= screenWidth) {

        head.x = screenWidth - 2;

        for (let i = 0; i < segments.length; i++) {
            segments[i].x--;
        }

        drawGame();
        gameOver = true;
        return;
    }


    if (head.x < 0) {

        head.x = 1;

        for (let i = 0; i < segments.length; i++) {
            segments[i].x++;
        }

        drawGame();
        gameOver = true;
        return;
    }


    if (head.y >= screenHeight) {

        head.y = screenHeight - 2;

        for (let i = 0; i < segments.length; i++) {
            segments[i].y--;
        }

        drawGame();
        gameOver = true;
        return;
    }


    if (head.y < 0) {

        head.y = 1;

        for (let i = 0; i < segments.length; i++) {
            segments[i].y++;
        }

        drawGame();
        gameOver = true;
        return;
    }


    // =========================
    // SELF COLLISION
    // =========================

    for (let i = 0; i < segments.length; i++) {

        if (
            head.x === segments[i].x &&
            head.y === segments[i].y
        ) {

            gameOver = true;

            console.log("GAME OVER");
            console.log("PRESS SPACE TO RESTART");

        }
    }


    // =========================
    // BERRY COLLISION
    // =========================

    if (head.x === berry.x && head.y === berry.y) {

        if (score < MAX_SCORE) {

            score++;

            scoreDisplay.textContent = score;

            // Add new segment at the tail
            segments.push({
                x: segments[segments.length - 1].x,
                y: segments[segments.length - 1].y
            });

            // Spawn berry somewhere not occupied by snake
            spawnBerry();
        }
    }


    // =========================
    // DRAW EVERYTHING
    // =========================

    drawGame();
}


// =========================
// DRAW SMOOTH BODY
// =========================

function drawSmoothBody() {

    if (segments.length === 0) {
        return;
    }

    ctx.beginPath();


    // Start at the head
    ctx.moveTo(
        head.x * 20 + 10,
        head.y * 20 + 10
    );


    // =========================
    // SMOOTH CURVES
    // =========================

    for (let i = 0; i < segments.length; i++) {

        const current = segments[i];

        const currentX = current.x * 20 + 10;
        const currentY = current.y * 20 + 10;


        // Last segment
        if (i === segments.length - 1) {

            ctx.lineTo(
                currentX,
                currentY
            );

            continue;
        }


        const next = segments[i + 1];

        const nextX = next.x * 20 + 10;
        const nextY = next.y * 20 + 10;


        // Midpoint between current and next
        const middleX = (currentX + nextX) / 2;
        const middleY = (currentY + nextY) / 2;


        // Smooth curve through the corner
        ctx.quadraticCurveTo(
            currentX,
            currentY,
            middleX,
            middleY
        );
    }


    // =========================
    // BODY STYLE
    // =========================

    ctx.strokeStyle = "#2a2a2c79";

    ctx.lineWidth = 20;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.stroke();
}


// =========================
// DRAW ROUNDED SEGMENT
// =========================

function drawRoundedSegment(x, y, radius) {

    ctx.beginPath();

    ctx.roundRect(
        x * 20 + 1,
        y * 20 + 1,
        18,
        18,
        radius
    );

    ctx.fill();
}


// =========================
// DRAW GAME
// =========================

function drawGame() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // =========================
    // DRAW BERRY
    // =========================

    ctx.beginPath();

    ctx.arc(
        berry.x * 20 + 10,
        berry.y * 20 + 10,
        8,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#6675fd";
    ctx.fill();


    // =========================
    // DRAW BODY
    // =========================

    drawSmoothBody();


    // =========================
    // DRAW HEAD
    // =========================

    ctx.fillStyle = "#2a2a2c79";

    drawRoundedSegment(
        head.x,
        head.y,
        8
    );
}


// =========================
// START GAME LOOP
// =========================

spawnBerry();

gameInterval = setInterval(gameLoop, FRAME_TIME);
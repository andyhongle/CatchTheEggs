const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const canvasBack = document.getElementById("backgroundCanvas");
const contextBack = canvasBack.getContext("2d");

//Timer for the Timeout - needed in order to clear it
let timer;

//Keeps track of hi score
let hiscore = 0;

//Background image, music track, and arrays of sounds.
//Arrays are needed so that the same sounds
//can overlap with each other
let background = new Image();
background.src = 'Images/kitchen.jpg';
let catchSounds = [];
let catchSoundCounter = 0;
for (let i = 0; i < 5; i++) {
    let catchSound = new Audio('Audio/eggsizzle.wav');
    catchSounds.push(catchSound);
}

let music = new Audio('Audio/MarimbaBoy.wav');
music.volume = 0.5;
music.loop = true;

const smashSounds = [];
let smashCounter = 0;
for (let i = 0; i < 5; i++) {
    let smash = new Audio();
    smash.src = 'Audio/eggcrack.wav';
    smashSounds.push(smash);
}

let player;
let eggs = [];
let numberofEggs = 5;

//Player constructor
function Player() {
    this.gameOver = false;
    this.score = 0;
    this.eggsCollected = 0;
    this.eggsMissed = 0;
    this.playerWidth = 160;
    this.playerHeight = 90;
    this.playerSpeed = 20;
    this.x = canvas.width / 2;
    this.y = canvas.height - this.playerHeight;
    this.playerImage = new Image();
    this.playerImage.src = 'Images/fryingpan.png';

    //Draws the player
    this.render = function () {
        context.drawImage(this.playerImage, this.x, this.y);
    }

    //Moves the player left
    this.moveLeft = function () {
        if (this.x > 0) {
            this.x -= this.playerSpeed;
        }
    }

    //Moves the player right
    this.moveRight = function () {
        if (this.x < canvas.width - this.playerWidth) {
            this.x += this.playerSpeed;
        }
    }
}

//Egg constructor
function Egg() {
    let min = 1
    let max = 2.25
    this.eggNumber = Math.random() * (max - min) + min
    this.eggType = "";
    this.eggWidth = 50;
    this.eggHeight = 50;
    this.eggImage = new Image();
    this.x = Math.random() * (canvas.width - this.eggWidth);
    this.y = Math.random() * -canvas.height - this.eggHeight;

    //Creates a different kind of egg depending on the egg number
    //which is generated randomly
    this.chooseEgg = function () {
        if (this.eggNumber >= 1 && this.eggNumber < 2) {
            this.eggType = "whiteegg";
            this.eggSpeed = 2.5;
            this.eggScore = 10;
            this.eggImage.src = 'Images/whiteegg.png';
        }
        else if (this.eggNumber >= 2) {
            this.eggType = "goldenegg";
            this.eggSpeed = 3;
            this.eggScore = 50;
            this.eggImage.src = 'Images/goldenegg.png';
        }

    }

    //Makes the egg descend.
    //While falling checks if the egg has been caught by the player
    //Or if it hit the floor.
    this.fall = function () {
        if (this.y < canvas.height - this.eggHeight) {
            this.y += this.eggSpeed;
        }
        else {
            smashSounds[smashCounter].play();
            if (smashCounter == 3) {
                smashCounter = 0;
            }
            else {
                smashCounter++;
            }

            player.eggsMissed += 1;
            this.changeState();
            this.chooseEgg();
        }
        this.checkIfCaught();
    }

    //Checks if the egg has been caught by the player
    //If it is caught, the player score and egg counter is increased, and
    //the current egg changes its state and becomes a different egg.
    this.checkIfCaught = function () {
        if (this.y >= player.y) {
            if ((this.x > player.x && this.x < (player.x + player.playerWidth)) ||
                (this.x + this.eggWidth > player.x && this.x + this.eggWidth < (player.x + player.playerWidth))) {
                catchSounds[catchSoundCounter].play();
                if (catchSoundCounter == 4) {
                    catchSoundCounter = 0;
                }
                else {
                    catchSoundCounter++;
                }

                player.score += this.eggScore;
                player.eggsCollected += 1;

                this.changeState();
                this.chooseEgg();
            }
        }
    }

    //Randomly updates the egg speed, egg number, which defines the type of egg
    //And also changes its x and y position on the canvas.
    this.changeState = function () {
        // this.eggNumber = Math.floor(Math.random() * 5);
        // this.eggSpeed = Math.floor(Math.random() * 3 + 1);
        this.x = Math.random() * (canvas.width - this.eggWidth);
        this.y = Math.random() * -canvas.height - this.eggHeight;
    }

    //Draws the egg.
    this.render = function () {
        context.drawImage(this.eggImage, this.x, this.y);
    }
}

//Adds controls. Left arrow to move left, right arrow to move right.
//ENTER to restart only works at the game over screen.
window.addEventListener("keydown", function (e) {
    e.preventDefault();
    if (e.keyCode == 37) {
        player.moveLeft();
    }
    else if (e.keyCode == 39) {
        player.moveRight();
    }
    else if (e.keyCode == 13 && player.gameOver == true) {
        main();
        window.clearTimeout(timer);
    }
});

main();

//Fills an array of eggs, creates a player and starts the game
function main() {
    contextBack.font = "bold 24px Arial";
    contextBack.fillStyle = "WHITE";
    player = new Player();
    eggs = [];

    for (let i = 0; i < numberofEggs; i++) {
        let egg = new Egg();
        egg.chooseEgg();
        eggs.push(egg);
    }

    startGame();
}

function startGame() {
    updateGame();
    window.requestAnimationFrame(drawGame);
}

//Checks for gameOver and makes each egg in the array fall down.
function updateGame() {
    music.play();
    if (player.eggsMissed >= 3) {
        player.gameOver = true;
    }

    for (let j = 0; j < eggs.length; j++) {
        eggs[j].fall();
    }
    timer = window.setTimeout(updateGame, 30);
}

//Draws the player and eggs on the screen as well as info in the HUD.
function drawGame() {
    if (player.gameOver == false) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        contextBack.clearRect(0, 0, canvasBack.width, canvasBack.height);

        contextBack.drawImage(background, 0, 0);
        player.render();

        for (let j = 0; j < eggs.length; j++) {
            eggs[j].render();
        }
        contextBack.fillText("SCORE: " + player.score, 50, 50);
        contextBack.fillText("HIGH SCORE: " + hiscore, 250, 50);
        contextBack.fillText("EGGS CAUGHT: " + player.eggsCollected, 750, 50);
        contextBack.fillText("EGGS MISSED: " + player.eggsMissed, 1050, 50);
    }
    else {
        //Different screen for game over.
        for (let i = 0; i < numberofEggs; i++) {
            eggs.pop();
        }

        if (hiscore < player.score) {
            hiscore = player.score;
            contextBack.fillText("NEW HIGH SCORE: " + hiscore, (canvas.width / 2) - 100, canvas.height / 2);
        }
        contextBack.fillText("PRESS ENTER TO RESTART", (canvas.width / 2) - 140, (canvas.height / 2) + 50);
        context.clearRect(0, 0, canvas.width, canvas.height);

    }
    window.requestAnimationFrame(drawGame);

}
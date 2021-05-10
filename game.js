const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const canvasBack = document.getElementById("backgroundCanvas");
const contextBack = canvasBack.getContext("2d");

let musicPaused = false;
let music = new Audio('Audio/parasail.mp3');
music.volume = 0.1;
music.loop = true;

const musicImage = document.getElementById('musicImage');
const musicButton = document.getElementById('musicButton');
musicButton.addEventListener("click", musicPause)

function musicPause() {
    if (musicPaused === true) {
        musicImage.src = 'Images/sound.png'
        music.play();
        music.loop = true;
        musicPaused = false

    } else {
        music.pause();
        musicImage.src = 'Images/mutesound.png'
        musicPaused = true;
    }
}

window.addEventListener("keydown", function(e) {
    music.play()

}, {once: true})

window.addEventListener("mousedown", function (e) {
    music.play()

}, { once: true })


let firstTime = true;

//Timer for the Timeout - needed in order to clear it
let timer;

//Keeps track of hi score
let hiscore = 0;

//Background image, music track, and arrays of sounds.
//Arrays are needed so that the same sounds
//can overlap with each other
let background = new Image();
background.src = 'Images/smallkitchen.jpeg';



let catchSounds = [];
let catchSoundCounter = 0;
for (let i = 0; i < 5; i++) {
    let catchSound = new Audio('Audio/eggsizzle.wav');
    catchSound.volume = 0.2;
    catchSounds.push(catchSound);
}

// welcome();

const smashSounds = [];
let smashCounter = 0;
for (let i = 0; i < 5; i++) {
    let smash = new Audio();
    smash.src = 'Audio/eggcrack.wav';
    smash.volume = 0.2;
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
    this.playerSpeed = 38;
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
    let max = 2.2
    this.eggNumber = Math.random() * (max - min) + min
    this.eggType = "";
    this.eggWidth = 50;
    this.eggHeight = 50;
    this.eggImage = new Image();
    this.x = Math.random() * (canvas.width - this.eggWidth);
    this.y = Math.random() * -canvas.height - this.eggHeight;

    //Creates a different kind of egg depending on the egg number
    //which is generated randomly
    // this.chooseEgg = function () {
    //     if (this.eggNumber >= 1 && this.eggNumber < 2) {
    //         this.eggType = "whiteegg";
    //         this.eggSpeed = 2.5;
    //         this.eggScore = 10;
    //         this.eggImage.src = 'Images/whiteegg.png';
    //     }
    //     else if (this.eggNumber >= 2) {
    //         this.eggType = "goldenegg";
    //         this.eggSpeed = 3.5;
    //         this.eggScore = 50;
    //         this.eggImage.src = 'Images/goldenegg.png';
    //     }
    // }

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
            // this.chooseEgg();
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
                // this.chooseEgg();
            }
        }
    }

    
    //changes its x and y position on the canvas.
    this.changeState = function () {
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
    else if (e.keyCode == 13 && firstTime === true) {
        firstTime = false
        main()
        window.clearTimeout(timer);
    }
    else if (e.keyCode == 32 && player.gameOver === true) {
        main()
        window.clearTimeout(timer);
    }
});
// firstVisit() 
main();
//Fills an array of eggs, creates a player and starts the game

function main() {
    contextBack.font = "bold 22px Arial";
    contextBack.fillStyle = "WHITE";
    player = new Player();
    eggs = [];

    // for (let i = 0; i < numberofEggs; i++) {
    //     let egg = new Egg();
    //     egg.chooseEgg();
    //     eggs.push(egg);
    // }

    // makes last egg a golden egg
    for (let i = 0; i < numberofEggs - 1; i++) {
        let egg = new Egg();
        
       egg.eggType = "whiteegg";
       egg.eggSpeed = 2.5;
       egg.eggScore = 10;
       egg.eggImage.src = 'Images/whiteegg.png';
       eggs.push(egg);
    }
    for (let i = numberofEggs; i === numberofEggs; i++) {
        let egg = new Egg();

        egg.eggType = "goldenegg";
        egg.eggSpeed = 3.5;
        egg.eggScore = 50;
        egg.eggImage.src = 'Images/goldenegg.png';
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
    if (player.eggsMissed >= 5) {
        player.gameOver = true;
    }
    // firstTime = false
    for (let j = 0; j < eggs.length; j++) {
        eggs[j].fall()
    }
    timer = window.setTimeout(updateGame, 30);
}



//Draws the player and eggs on the screen as well as info in the HUD.
function drawGame() {
    if (firstTime === true) {
        for (let i = 0; i < numberofEggs; i++) {
            eggs.pop();
        }
        contextBack.drawImage(background, 0, 0);
        contextBack.fillText("PRESS ENTER TO START", (canvas.width / 2) - 140, (canvas.height / 2) + 50);
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    else if (player.gameOver === false) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        contextBack.clearRect(0, 0, canvasBack.width, canvasBack.height);

        contextBack.drawImage(background, 0, 0);
        player.render();
        
        
        contextBack.fillText("SCORE: " + player.score, 25, 45);
        contextBack.fillText("HIGH SCORE: " + hiscore, 185, 45);
        contextBack.fillText("EGGS CAUGHT: " + player.eggsCollected, 520, 45);
        contextBack.fillText("EGGS MISSED: " + player.eggsMissed, 750, 45);
       
        
        for (let j = 0; j < eggs.length; j++) {
            eggs[j].render();
            
        }
    
    }
    else {
        //Different screen for game over.
        for (let i = 0; i < numberofEggs; i++) {
            eggs.pop();
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        contextBack.clearRect(0, 0, canvasBack.width, canvasBack.height);
        contextBack.drawImage(background, 0, 0);

        // cant figure out why this doesnt work
        if (hiscore < player.score) {
            hiscore = player.score;
            contextBack.fillText("NEW HIGH SCORE: ", (canvas.width / 2) - 140, (canvas.height / 2) + 50);
            console.log(player.score)
        }
        
        contextBack.fillText("SCORE: " + player.score, 25, 45);
        contextBack.fillText("HIGH SCORE: " + hiscore, 185, 45);
        contextBack.fillText("EGGS CAUGHT: " + player.eggsCollected, 520, 45);
        contextBack.fillText("EGGS MISSED: " + player.eggsMissed, 750, 45);
       

        contextBack.fillText("PRESS SPACE TO RESTART", (canvas.width / 2) - 140, (canvas.height / 2) + 50);
        context.clearRect(0, 0, canvas.width, canvas.height);

    }
    window.requestAnimationFrame(drawGame);

}









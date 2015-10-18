/*global Game, Board, check, RandomBlock, checkCollision, checkandclearlines, addtoBoard, checkHorizontalCollision, checkRotationCollision
 */
var game = new Game();
var board = new Board();
var block = RandomBlock(0, 8);
var next_block = RandomBlock(0, 0);

document.getElementById("score").innerHTML = board.score;

game.draw(block);
game.draw_next(next_block);

window.addEventListener("keydown", check, false);

var timer = setInterval(onTimerTick, 500);

//called every 0.5 seconds
function blockfall() {

    block.potentialpos.row += 1;
    game.draw(board);

    //if the block landed on the board
    if (checkCollision(block, board)) {
        block.potentialpos.row -= 1;

        //add it to the board
        addtoBoard(block, board);
        //check if we have any filled lines and clear them if it's the case
        checkandclearlines(board);

        board.score += 10;
        document.getElementById("score").innerHTML = board.score;

        //spawn the next block and create a new next block
        block = next_block;
        block.setpos(0, 8);
        game.clean_next();
        next_block = RandomBlock(0, 0);

        game.clean(board);
        game.draw(block);
        game.draw_next(next_block);
        game.draw(board);

        //check if the block spawn point is occupied
        if (checkCollision(block, board)) {
            //if it is then it's game over
            clearInterval(timer);
            window.removeEventListener("keydown", check);
            drawPauseScreen("GAME OVER");
            window.addEventListener("keydown", waitForReset);
        }
    }
    //if the block didn't collide with anything then let if fall
    else {
        game.clean(block);
        block.down();
        game.draw(block);
    }
}

// resets game when space bar is pressed
function waitForReset(e) {
    if (e.keyCode == "32") {
        game = new Game();
        board = new Board();
        block = RandomBlock(0, 8);
        next_block = RandomBlock(0, 0);
        document.getElementById("score").innerHTML = board.score;

        var ctx = $("canvas.canvas1")[0].getContext("2d");
        var ctx2 = $("canvas.canvas2")[0].getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx2.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        game.draw(block);
        game.draw_next(next_block);

        window.removeEventListener("keydown", waitForReset);
        window.addEventListener("keydown", check, false);

        timer = setInterval(onTimerTick, 500);
    }
}

function check(e) {

    //if the user presses R
    if (e.keyCode == "82") {
        //store the old rotation and get the next rotation
        var oldrot = block.rot;
        block.nextrotation = block.rotate();

        //if the block collides with the wall or board while rotating
        if (checkRotationCollision(block, board)) {
            //get to the old rotation
            block.nextrotation = 0;
            block.rot = oldrot;
        }
        //else draw the rotation on the canvas
        else {
            game.clean(block);
            block.shape = block.nextrotation;
            game.draw(block);
        }
    }

    //if the user presses left
    if (e.keyCode == "37") {
        //store the potential left position
        block.potentialpos.col -= 1;
        //if the block's potential left position collides with the wall or board
        if (checkHorizontalCollision(block, board)) {
            //then we revert to the actual position
            block.potentialpos.col += 1;
        }
        //else move the block to the left and draw it on the canvas
        else {
            game.clean(block);
            block.pos.col = block.potentialpos.col;
            game.draw(block);
        }

    }

    //if the user presses right
    if (e.keyCode == "39") {
        //store the potential right position
        block.potentialpos.col += 1;
        //if the block's potential right position collides with the wall or board
        if (checkHorizontalCollision(block, board)) {
            //then we revert to the actual position
            block.potentialpos.col -= 1;
        }
        //else move the block to the right and draw it on the canvas
        else {
            game.clean(block);
            block.pos.col = block.potentialpos.col;
            game.draw(block);
        }
    }

    //if the user presses down
    if (e.keyCode == "40") {
        blockfall();
    }

    // user pressed space bar
    if (e.keyCode == "32") {
        var boundWait;
        pauseGame();
    }
}

function pauseGame() {
    clearInterval(timer);
    window.removeEventListener("keydown", check);

    var ctx = $("canvas.canvas1")[0].getContext("2d");
    var ctx2 = $("canvas.canvas2")[0].getContext("2d");
    var save1 = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    var save2 = ctx2.getImageData(0, 0, ctx2.canvas.width, ctx2.canvas.height);

    boundWait = waitForResume.bind(this, save1, save2);
    window.addEventListener("keydown", boundWait);

    drawPauseScreen("GAME PAUSED");
}

function waitForResume(save1, save2, e) {
    if (e.keyCode == "32") {
        var ctx = $("canvas.canvas1")[0].getContext("2d");
        var ctx2 = $("canvas.canvas2")[0].getContext("2d");

        ctx.putImageData(save1, 0, 0);
        ctx2.putImageData(save2, 0, 0);

        window.removeEventListener("keydown", boundWait);
        window.addEventListener("keydown", check);

        timer = setInterval(onTimerTick, 500);
    }
}

function drawPauseScreen(text) {
    var ctx = $("canvas.canvas1")[0].getContext("2d");
    var ctx2 = $("canvas.canvas2")[0].getContext("2d");
    ctx.save();
    // dim canvas
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx2.globalAlpha = 0.5;
    ctx2.fillStyle = 'black';
    ctx2.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // display game over text
    ctx.globalAlpha = 1;
    ctx.font = "bold 40px Arial";
    ctx.fillStyle = 'red';
    var textWidth = text.length * 27;
    var x = ctx.canvas.width / 2 - textWidth / 2;
    var y = ctx.canvas.height / 2;
    ctx.fillText(text, x, y);
    ctx.restore();
}

//every 0.5 sec execute the blockfall function
function onTimerTick() {
    blockfall();
}

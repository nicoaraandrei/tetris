/*global Game, Board, check, RandomBlock, checkCollision, checkandclearlines, addtoBoard, checkHorizontalCollision, checkRotationCollision
 */
var game = new Game();
var board = new Board();
var block = RandomBlock(0, 0);
var next_block = RandomBlock(0, 0);
document.getElementById("score").innerHTML = "Score: " + board.score;
game.draw(block);
game.draw_next(next_block);
window.addEventListener("keydown", this.check, false);

var timer = setInterval(onTimerTick, 500); // 33 milliseconds = ~ 30 frames per sec

// Get property
$("canvas").css("backgroundColor");
// Set property
$("canvas").css({
    backgroundColor: "#E6E6FA"
});

function blockfall() {
    block.potentialpos.row += 1;
    game.draw(board);
    if (checkCollision(block, board)) {
        block.potentialpos.row -= 1;

        addtoBoard(block, board);
        checkandclearlines(board);
        board.score += 10;
        document.getElementById("score").innerHTML = "Score: " + board.score;

        block = next_block;
        game.clean_next();
        next_block = RandomBlock(0, 0);

        game.clean(board);
        game.draw(block);
        game.draw_next(next_block);
        game.draw(board);

        if (checkCollision(block, board)) {

            clearInterval(timer);
            alert("YOU LOST!");
        }
    } else {
        game.clean(block);
        block.down();
        game.draw(block);

    }
}

function check(e) {
    //console.log(e.keyCode);
    if (e.keyCode == "82") {
        //rotation
        var oldrot = block.rot;
        block.nextrotation = block.rotate();
        if (checkRotationCollision(block, board)) {
            block.nextrotation = 0;
            block.rot = oldrot;
        } else {
            game.clean(block);
            block.shape = block.nextrotation;
            game.draw(block);
        }
    }
    if (e.keyCode == "37") {
        //left
        block.potentialpos.col -= 1;
        if (checkHorizontalCollision(block, board)) {
            block.potentialpos.col += 1;
        } else {
            game.clean(block);
            block.pos.col = block.potentialpos.col;
            game.draw(block);
        }

    }
    if (e.keyCode == "39") {
        //right
        block.potentialpos.col += 1;
        if (checkHorizontalCollision(block, board)) {
            block.potentialpos.col -= 1;
        } else {
            game.clean(block);
            block.pos.col = block.potentialpos.col;
            game.draw(block);
        }
    }
    if (e.keyCode == "40") {
        //down
        blockfall();
    }
}

function onTimerTick() {
    blockfall();
}

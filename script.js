/*global Game, Board, check, RandomBlock, checkCollision, checkandclearlines, addtoBoard, checkHorizontalCollision, checkRotationCollision
 */
var game = new Game();
var board = new Board();
var block = RandomBlock(0, 0);
document.getElementById("score").innerHTML = board.score;
game.draw(block);
//tetris.draw(300,300);
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
        /*
        for (var i = 0; i < board.shape.length; i++) {
            console.log(board.shape[i]);
        }
        */
        checkandclearlines(board);
        board.score += 10;
        document.getElementById("score").innerHTML = board.score;
        block = RandomBlock(0, 0);
        game.draw(block);
        game.draw(board);
        if (checkCollision(block, board)) {

            clearInterval(timer);
            alert("YOU LOST!");
        }
        //block = new I(0,8);
    } else {
        game.clean(block);
        block.down();
        game.draw(block);

    }
}

function check(e) {
    //console.log(e.keyCode);
    if (e.keyCode == "82") {
        //  tetris.rotate(90);
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
        //  tetris.left();
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
        //  tetris.right();
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
        //  tetris.down();
        blockfall();
    }
    //console.log(tetris.x + ":" + tetris.y);
}

function onTimerTick() {
    //tetris.down();
    //console.log(board.rows + " : " + board.cols);
    blockfall();

}

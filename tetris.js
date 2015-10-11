//Create a 2D array
Array.matrix = function(numrows, numcols, initial) {
    var arr = [];
    for (var i = 0; i < numrows; ++i) {
        var columns = [];
        for (var j = 0; j < numcols; ++j) {
            columns[j] = initial;
        }
        arr[i] = columns;
    }
    return arr;
};

//return a random block object
function RandomBlock(x, y) {
    var option = Math.floor(Math.random() * 7) + 1;
    switch (option) {
        case 1:
            return new O(x, y);
        case 2:
            return new I(x, y);
        case 3:
            return new J(x, y);
        case 4:
            return new L(x, y);
        case 5:
            return new S(x, y);
        case 6:
            return new Z(x, y);
        case 7:
            return new T(x, y);
    }
}

//return a random hex color
function getRandomColor() {
    var letters = "0123456789ABCDEF".split("");
    var color = "#";
    for (var i = 0; i < 3; i++) {
        color += letters[Math.floor(Math.random() * 14)];
    }
    return color;
}

//main game class
function Game() {
    //draw the next block in the small canvas 
    this.draw_next = function(obj) {
        for (var i = 0; i < obj.shape.length; i++) {
            for (var j = 0; j < obj.shape[i].length; j++) {
                if (obj.shape[i][j] !== 0) {
                    $("canvas.canvas2").drawRect({
                        fillStyle: obj.color,
                        x: (j + obj.pos.col + 1) * 20 - 10,
                        y: (i + obj.pos.row + 1) * 20 - 10,
                        width: 20,
                        height: 20
                    });
                }
            }
        }
    };

    //clean the next block in the small canvas
    this.clean_next = function() {
        $("canvas.canvas2").clearCanvas({
            x: 40,
            y: 40,
            width: 80,
            height: 80
        });
    };

    //draw an object on the big canvas
    this.draw = function(obj) {
        var color;
        for (var i = 0; i < obj.shape.length; i++) {
            for (var j = 0; j < obj.shape[i].length; j++) {
                if (obj.shape[i][j] !== 0) {
                    if (obj instanceof Board) {

                        color = obj.colors[i][j];
                    } else {
                        color = obj.color;
                    }
                    $("canvas.canvas1").drawRect({
                        fillStyle: color,
                        x: (j + obj.pos.col + 1) * 20 - 10,
                        y: (i + obj.pos.row + 1) * 20 - 10,
                        width: 20,
                        height: 20
                    });
                }
            }
        }
    };

    //clean an object from the big canvas
    this.clean = function(obj) {

        for (var i = 0; i < obj.shape.length; i++) {
            for (var j = 0; j < obj.shape[i].length; j++) {
                if (obj.shape[i][j] !== 0) {
                    $("canvas.canvas1").clearCanvas({
                        x: (j + obj.pos.col + 1) * 20 - 10,
                        y: (i + obj.pos.row + 1) * 20 - 10,
                        width: 20,
                        height: 20
                    });
                }
            }
        }
    };
}

//adds a block in the board array
function addtoBoard(obj1, obj2) {
    for (var i = 0; i < obj1.shape.length; i++) {
        for (var j = 0; j < obj1.shape[i].length; j++) {
            if (obj1.shape[i][j] !== 0) {
                obj2.shape[i + obj1.pos.row][j + obj1.pos.col] = obj1.shape[i][j];
                obj2.colors[i + obj1.pos.row][j + obj1.pos.col] = obj1.color;
            }
        }
    }
}

//checks the block's collision with the wall/board when rotating
function checkRotationCollision(obj1, obj2) {
    for (var i = 0; i < obj1.nextrotation.length; i++) {
        for (var j = 0; j < obj1.nextrotation[i].length; j++) {
            if (obj1.nextrotation[i][j] !== 0) {
                if (i + obj1.potentialpos.col < 0) {
                    return true;
                }
                //check collision with right wall
                if (i + obj1.potentialpos.col >= obj2.shape[0].length) {
                    return true;
                }
                //check collision with the board
                if (obj2.shape[i + obj1.potentialpos.row][j + obj1.potentialpos.col] !== 0) {
                    return true;
                }
            }
        }
    }
}

//checks block's collision with the wall/board when going left or right
function checkHorizontalCollision(obj1, obj2) {
    for (var i = 0; i < obj1.shape.length; i++) {
        for (var j = 0; j < obj1.shape[i].length; j++) {
            if (obj1.shape[i][j] !== 0) {
                //check collision with left wall
                if (obj1.potentialpos.col < -1) {
                    return true;
                }
                //check collision with right wall
                if (obj1.potentialpos.col >= obj2.shape[0].length) {
                    return true;
                }
                //check collision with the board
                if (obj2.shape[i + obj1.potentialpos.row][j + obj1.potentialpos.col] !== 0) {
                    return true;
                }
            }
        }
    }
}

//checks block's collision with the wall's/board's floor
function checkCollision(obj1, obj2) {
    for (var i = 0; i < obj1.shape.length; i++) {
        for (var j = 0; j < obj1.shape[i].length; j++) {
            if (obj1.shape[i][j] !== 0) {
                //check if block is below field
                if (i + obj1.potentialpos.row >= obj2.shape.length) {
                    return true;
                }
                //check if colides a tile
                else if (obj2.shape[i + obj1.potentialpos.row][j + obj1.potentialpos.col] !== 0) {
                    return true;
                }

            }
        }
    }
    return false;
}

//clears the line when a block fills it
function checkandclearlines(obj1) {
    var count = 0;
    for (var i = 0; i < obj1.shape.length; i++) {
        var isFilled = true;
        for (var j = 0; j < obj1.shape[i].length; j++) {
            if (obj1.shape[i][j] === 0) {
                isFilled = false;
            }
        }

        if (isFilled) {
            game.clean(obj1);
            // remove the row with 1 on it
            obj1.shape.splice(i, 1);
            //add a new 0 row at top position
            obj1.shape.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            game.draw(obj1);
            count++;
        }
    }
    obj1.score += 50 * count;
}

function Board() {
    this.shape = Array.matrix(24, 17, 0);
    this.rows = 24;
    this.cols = 17;
    this.colors = Array.matrix(24, 17, "#111111");

    this.pos = {
        row: 0,
        col: 0
    };
    this.score = 0;
}

function Block(x, y) {
    this.x = x;
    this.y = y;
    this.rot = 0;
    this.nextrotation = 0;
    this.rotations = [];
    this.shape = this.rotations[this.rot];
    this.color = getRandomColor();

    this.pos = {
        row: this.x,
        col: this.y
    };

    this.potentialpos = {
        row: this.x,
        col: this.y
    };

    this.setpos = function(x, y) {
        this.x = x;
        this.y = y;
        this.pos = {
            row: this.x,
            col: this.y
        };

        this.potentialpos = {
            row: this.x,
            col: this.y
        };
    }

    this.left = function() {
        this.potentialpos.col -= 1;
    };

    this.right = function() {
        this.potentialpos.col += 1;
    };

    this.down = function() {
        this.pos.row = this.potentialpos.row;
        this.pos.col = this.potentialpos.col;
    };

}

Block.prototype.rotate = function(rot, nr_rot) {
    if (rot == nr_rot) {
        rot = 0;
    } else {
        rot++;
    }
    console.log("rot: " + rot);
    return rot;
};

function I(x, y) {
    Block.call(this, x, y);

    this.rotations = [
        [
            [1],
            [1],
            [1],
            [1]
        ],

        [
            [1, 1, 1, 1]
        ]
    ];

    this.shape = this.rotations[this.rot];

    this.rotate = function() {
        this.rot = Block.prototype.rotate(this.rot, 1);
        return this.rotations[this.rot];
    };
}


function O(x, y) {

    Block.call(this, x, y);

    this.rotations = [
        [
            [1, 1],
            [1, 1]
        ],
        [
            [1, 1],
            [1, 1]
        ]
    ];

    this.shape = this.rotations[0];

    this.rotate = function() {
        this.rot = Block.prototype.rotate(this.rot, 1);
        return this.rotations[this.rot];
    };
}

function J(x, y) {

    Block.call(this, x, y);

    this.rotations = [
        [
            [0, 1],
            [0, 1],
            [1, 1]
        ],

        [
            [1, 0, 0],
            [1, 1, 1]
        ],

        [
            [1, 1],
            [1, 0],
            [1, 0]
        ],

        [
            [1, 1, 1],
            [0, 0, 1]
        ]
    ];

    this.shape = this.rotations[this.rot];

    this.rotate = function() {
        this.rot = Block.prototype.rotate(this.rot, 3);
        return this.rotations[this.rot];
    };
}

function L(x, y) {

    Block.call(this, x, y);

    this.rotations = [
        [
            [1, 0],
            [1, 0],
            [1, 1]
        ],

        [
            [1, 1, 1],
            [1, 0, 0]
        ],

        [
            [1, 1],
            [0, 1],
            [0, 1]
        ],

        [
            [0, 0, 1],
            [1, 1, 1]
        ]
    ];

    this.shape = this.rotations[this.rot];

    this.rotate = function() {
        this.rot = Block.prototype.rotate(this.rot, 3);
        return this.rotations[this.rot];
    };
}

function T(x, y) {

    Block.call(this, x, y);

    this.rotations = [
        [
            [0, 1],
            [1, 1],
            [0, 1]
        ],

        [
            [0, 1, 0],
            [1, 1, 1]
        ],

        [
            [1, 0],
            [1, 1],
            [1, 0]
        ],

        [
            [1, 1, 1],
            [0, 1, 0]
        ]
    ];

    this.shape = this.rotations[this.rot];

    this.rotate = function() {
        this.rot = Block.prototype.rotate(this.rot, 3);
        return this.rotations[this.rot];
    };
}

function S(x, y) {

    Block.call(this, x, y);

    this.rotations = [
        [
            [0, 1, 1],
            [1, 1, 0]
        ],

        [
            [1, 0],
            [1, 1],
            [0, 1]
        ]
    ];

    this.shape = this.rotations[this.rot];

    this.rotate = function() {
        this.rot = Block.prototype.rotate(this.rot, 1);
        return this.rotations[this.rot];
    };
}

function Z(x, y) {

    Block.call(this, x, y);

    this.rotations = [
        [
            [1, 1, 0],
            [0, 1, 1]
        ],

        [
            [0, 1],
            [1, 1],
            [1, 0]
        ]
    ];

    this.shape = this.rotations[this.rot];

    this.rotate = function() {
        this.rot = Block.prototype.rotate(this.rot, 1);
        return this.rotations[this.rot];
    };
}

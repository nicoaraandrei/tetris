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

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function Game() {
    this.draw = function(obj) {
        for (var i = 0; i < obj.shape.length; i++) {
            //console.log("i: " + i);
            for (var j = 0; j < obj.shape[i].length; j++) {
                //console.log("j: " + obj.shape[i].length);
                if (obj.shape[i][j] !== 0) {
                    $('canvas').drawRect({
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
    this.clean = function(obj) {

        for (var i = 0; i < obj.shape.length; i++) {
            //console.log("i: " + i);
            for (var j = 0; j < obj.shape[i].length; j++) {
                //console.log("j: " + obj.shape[i].length);
                if (obj.shape[i][j] !== 0) {
                    $('canvas').clearCanvas({
                        fillStyle: getRandomColor(),
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

function addtoBoard(obj1, obj2) {
    for (var i = 0; i < obj1.shape.length; i++) {
        for (var j = 0; j < obj1.shape[i].length; j++) {
            if (obj1.shape[i][j] != 0) {
                obj2.shape[i + obj1.pos.row][j + obj1.pos.col] = obj1.shape[i][j];
            }
        }
    }
}

function checkRotationCollision(obj1, obj2) {
    for (var i = 0; i < obj1.nextrotation.length; i++) {
        for (var j = 0; j < obj1.nextrotation[i].length; j++) {
            if (obj1.nextrotation[i][j] != 0) {
                if (i + obj1.potentialpos.col < 0) {
                    return true;
                }
                //check collision with right wall
                if (i + obj1.potentialpos.col >= obj2.shape[0].length) {
                    return true;
                }
                //check collision with the board
                if (obj2.shape[i + obj1.potentialpos.row][j + obj1.potentialpos.col] != 0) {
                    return true;
                }
            }
        }
    }
}

function checkHorizontalCollision(obj1, obj2) {
    for (var i = 0; i < obj1.shape.length; i++) {
        for (var j = 0; j < obj1.shape[i].length; j++) {
            if (obj1.shape[i][j] != 0) {
                //console.log("potential col:" + obj1.potentialpos.col);
                //check collision with left wall
                if (obj1.potentialpos.col < -1) {
                    return true;
                }
                //check collision with right wall
                if (obj1.potentialpos.col >= obj2.shape[0].length) {
                    return true;
                }
                //check collision with the board
                if (obj2.shape[i + obj1.potentialpos.row][j + obj1.potentialpos.col] != 0) {
                    return true;
                }
            }
        }
    }
}

function checkCollision(obj1, obj2) {
    //console.log("Ravioli Ravioli: " + obj1.potentialpos.row + " : " + obj1.potentialpos.col);
    for (var i = 0; i < obj1.shape.length; i++) {
        for (var j = 0; j < obj1.shape[i].length; j++) {
            if (obj1.shape[i][j] != 0) {
                //check if block is below field
                if (i + obj1.potentialpos.row >= obj2.shape.length) {
                    return true;
                }
                //check if colides a tile
                else if (obj2.shape[i + obj1.potentialpos.row][j + obj1.potentialpos.col] != 0) {
                    //console.log("GIVE ME THE FORMUOLI");
                    //console.log("ravioli: " + obj2.shape[i + obj1.potentialpos.row][j + obj1.potentialpos.col]);
                    return true;
                }

            }
        }
    }
    return false;
}

function checkandclearlines(obj1) {
    var count = 0;
    for (var i = 0; i < obj1.shape.length; i++) {
        isFilled = true;
        count++;
        for (var j = 0; j < obj1.shape[i].length; j++) {
            if (obj1.shape[i][j] == 0) {
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
        }
    }
    obj1.score += 50 * count;
}

function Board() {
    this.shape = Array.matrix(24, 17, 0);
    this.rows = 24;
    this.cols = 17;
    this.pos = {
        row: 0,
        col: 0
    };
    this.score = 0;
}

function O(x, y) {
    this.shape = [
        [1, 1],
        [1, 1]
    ];
    this.pos = {
        row: x,
        col: y
    };

    this.potentialpos = {
        row: x,
        col: y
    };

    this.rotate = function() {};

    this.color = getRandomColor();

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

function I(x, y) {

    this.rot = Math.floor(Math.random() * 2);

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

    this.pos = {
        row: x,
        col: y
    };

    this.potentialpos = {
        row: x,
        col: y
    };

    this.color = getRandomColor();

    this.nextrotation = 0;

    this.rotate = function() {
        if (this.rot == 1) {
            this.rot = 0;
        } else {
            this.rot++;
        }
        console.log("rot: " + this.rot);
        return this.rotations[this.rot];
    };

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

function J(x, y) {

    this.rot = Math.floor(Math.random() * 4);

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

    this.pos = {
        row: x,
        col: y
    };

    this.potentialpos = {
        row: x,
        col: y
    };

    this.color = getRandomColor();

    this.nextrotation = 0;

    this.rotate = function() {
        if (this.rot == 3) {
            this.rot = 0;
        } else {
            this.rot++;
        }
        console.log("rot: " + this.rot);
        return this.rotations[this.rot];
    };

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

function L(x, y) {

    this.rot = Math.floor(Math.random() * 4);

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

    this.pos = {
        row: x,
        col: y
    };

    this.potentialpos = {
        row: x,
        col: y
    };

    this.color = getRandomColor();

    this.nextrotation = 0;

    this.rotate = function() {
        if (this.rot == 3) {
            this.rot = 0;
        } else {
            this.rot++;
        }
        console.log("rot: " + this.rot);
        return this.rotations[this.rot];
    };

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

function T(x, y) {

    this.rot = Math.floor(Math.random() * 4);

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

    this.pos = {
        row: x,
        col: y
    };

    this.potentialpos = {
        row: x,
        col: y
    };

    this.color = getRandomColor();

    this.nextrotation = 0;

    this.rotate = function() {
        if (this.rot == 3) {
            this.rot = 0;
        } else {
            this.rot++;
        }
        //console.log("rot: " + this.rot);
        return this.rotations[this.rot];
    };

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

function S(x, y) {

    this.rot = Math.floor(Math.random() * 2);

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

    this.pos = {
        row: x,
        col: y
    };

    this.potentialpos = {
        row: x,
        col: y
    };

    this.color = getRandomColor();

    this.nextrotation = 0;

    this.rotate = function() {
        if (this.rot == 1) {
            this.rot = 0;
        } else {
            this.rot++;
        }
        console.log("rot: " + this.rot);
        return this.rotations[this.rot];
    };

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

function Z(x, y) {

    this.rot = Math.floor(Math.random() * 2);

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

    this.pos = {
        row: x,
        col: y
    };

    this.potentialpos = {
        row: x,
        col: y
    };

    this.color = getRandomColor();

    this.nextrotation = 0;

    this.rotate = function() {
        if (this.rot == 1) {
            this.rot = 0;
        } else {
            this.rot++;
        }
        console.log("rot: " + this.rot);
        return this.rotations[this.rot];
    };

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

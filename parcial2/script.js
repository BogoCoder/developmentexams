// Coded by Samuel Pérez
// Web development course, Prof. Dora Suarez
// Universidad del Rosario
// 2019

// This code describes the logic behind a chess game, you can create chessboards, boxes, and pieces. You can move this pieces according to the rules.

function chessboard(turn){
    this.turn = turn || ""; // game turn, could be "white" || "black"
    this.boxes = []; // array of boxes
}

function box(column, row, chessboard){
    chessboard.boxes.push(this); //adds this new box to the chessboard boxes

    this.chessboard = chessboard; //we have to specify the chessboard as an instance of the box

    this.coordinate = { // coordinates of the form "A1", "B5", etc...
        column: column || "" , //"A" || "B" || "C" || "D" || "E" || "F" || "G" || "H" 
        row:  row || "" //1 || 2 || 3 || 4 || 5 || 6 || 7 || 8
    };

    this.piece = NaN;

    this.delete = function(){
        this.piece.active = false;
    }
}

function piece(box, color, name){
    box.piece.active = false; //if there is another piece in the box, we remove it

    this.active = true;

    if(this.color == box.chessboard.turn){
        this.enabled = true;
    }
    else this.enabled = false;

    if(!this.active){
        this.box = NaN;
    }
    else this.box = box || new box;

    this.box.piece = this; // we assign this piece to the input box

    this.color = color || ""; // "white" || "black"

    this.name = name || ""; //"pawn" || "rook" || "knight" || "bishop" || "king" || "queen"

    this.movement = function(){
        var movements = [];

        if(name == "pawn"){
            movements = pawn(this.box, this.color);
        }

        else if(name == "rook"){
            movements = rook(this.box);
        }

        else if(name == "bishop"){
            movements = bishop(this.box);
        }

        else if(name == "knight"){
            movements = knight(this.box);
        }

        else if(name == "king"){
            movements = king(this.box);
        }

        else if(name == "queen"){
            movements = queen(this.box);
        }
        return movements;
    }

    this.possibilities = function(){
        //remove movements with same color pieces
        var movements = this.movement();
           for(i = 0; i < movements.length; i++){
               for(k = 0; k < this.box.chessboard.boxes.length; k++){
                   if(this.color == this.box.chessboard.boxes[k].piece.color && !Number.isNaN(this.box.chessboard.boxes[k].piece)){
                        if(this.box.chessboard.boxes[k].coordinate.column == movements[i][0]){
                            if(this.box.chessboard.boxes[k].coordinate.row == movements[i][1]){
                                movements.splice(i,1);
                            }
                        }
                   }
                }
           }
        return movements;
    }

    this.move = function(new_box){
        var possibilities = this.possibilities();
        var diag;
        if(possibilities.includes(new_box.coordinate.column + new_box.coordinate.row)){ // if the new box is included in the possibilities
            if(!Number.isNaN(new_box.piece) && new_box.piece.color != this.color){ // if the new box has a piece and the piece color is different
                if(this.name == "pawn"){ // remember: if we have a pawn then he can only capture in the diagonal adjacent forward boxes
                    if(this.color == "white"){
                        diag = [columns[columns.indexOf(box.coordinate.column) + 1] + (box.coordinate.row + 1), columns[columns.indexOf(box.coordinate.column) - 1] + (box.coordinate.row + 1)];
                        if(diag.includes(new_box.coordinate.column + new_box.coordinate.row)){
                            new_box.piece.active = false;
                        }
                        else{
                            throw "A pawn can not capture forward";
                        }

                    }
                    else if(this.color == "black"){
                        diag = [columns[columns.indexOf(box.coordinate.column) + 1] + (box.coordinate.row - 1), columns[columns.indexOf(box.coordinate.column) - 1] + (box.coordinate.row - 1)];
                        if(diag.includes(new_box.coordinate.column + new_box.coordinate.row)){
                            new_box.piece.active = false;
                        }
                        else{
                            throw "A pawn can not capture forward";
                        }
                    }
                }
                else new_box.piece.active = false; // the other pieces can capture in any of their possibilities
            }
            // changing parameters
            this.box.piece = NaN;
            new_box.piece = this;
            this.box = new_box;
    
            if(this.enabled || this.color == "white"){
                this.box.chessboard.turn = "black";
            }
            else if(this.enabled || this.color == "black"){
                this.box.chessboard.turn = "white";
            }
            this.enabled = false;
        }

        else throw "You can not move there.";
    }
}

// pieces movement functions

function pawn(box, color){
    columns = 'abcdefgh'.toLocaleUpperCase().split('');
    columns.slice(0, 8);
    var movements = [];
    var obstacle;
    var diag;
    if(color === "white"){
        // there's a diagonal possible movement if there is a different color piece
        diag = [columns[columns.indexOf(box.coordinate.column) + 1] + (box.coordinate.row + 1), columns[columns.indexOf(box.coordinate.column) - 1] + (box.coordinate.row + 1)];

        for(i = 0; i < diag.length; i++){
            for(k = 0; k < box.chessboard.boxes.length; k++){
                if(color != box.chessboard.boxes[k].piece.color && !Number.isNaN(box.chessboard.boxes[k].piece)){
                     if(box.chessboard.boxes[k].coordinate.column == diag[i][0]){
                         if(box.chessboard.boxes[k].coordinate.row == diag[i][1]){
                            movements.push(diag[i]);
                         }
                     }
                }
            }
        }

        if(box.coordinate.row == 2){
            //removing boxes with obstacles
            for(k = 0; k < box.chessboard.boxes.length; k++){
                if(!Number.isNaN(box.chessboard.boxes[k].piece)){
                     if(box.chessboard.boxes[k].coordinate.column == box.coordinate.column){
                         if(box.chessboard.boxes[k].coordinate.row == 3){
                            obstacle = true;
                            break;
                         }
                     }
                }
            }
            if(!obstacle){
                movements = movements.concat([box.coordinate.column + 3, box.coordinate.column + 4]);
            }
        }
        else if(!Number.isNaN(box.coordinate.column + (box.coordinate.row + 1))){
            movements = movements.concat([box.coordinate.column + (box.coordinate.row + 1)]);
        }
    }
    
    else if(color === "black"){
        // there's a diagonal possible movement if there is a different color piece
        diag = [columns[columns.indexOf(box.coordinate.column) + 1] + (box.coordinate.row - 1), columns[columns.indexOf(box.coordinate.column) - 1] + (box.coordinate.row - 1)];

        for(i = 0; i <= diag.length; i++){
            for(k = 0; k < box.chessboard.boxes.length; k++){
                if(color != box.chessboard.boxes[k].piece.color && !Number.isNaN(box.chessboard.boxes[k].piece)){
                     if(box.chessboard.boxes[k].coordinate.column == diag[i][0]){
                         if(box.chessboard.boxes[k].coordinate.row == diag[i][1]){
                            movements.push(diag[i]);
                         }
                     }
                }
            }
        }

        if(box.coordinate.row == 7){
            //removing boxes with obstacles
            for(k = 0; k < box.chessboard.boxes.length; k++){
                if(!Number.isNaN(box.chessboard.boxes[k].piece)){
                     if(box.chessboard.boxes[k].coordinate.column == box.coordinate.column){
                         if(box.chessboard.boxes[k].coordinate.row == 6){
                            obstacle = true;
                            break;
                         }
                     }
                }
            }
            if(!obstacle){
                movements = movements.concat([box.coordinate.column + 6, box.coordinate.column + 5]);
            }
        }
        else if(!Number.isNaN(box.coordinate.column + (box.coordinate.row - 1))){
            movements = movements.concat([box.coordinate.column + (box.coordinate.row - 1)]);
        }
    }
    return movements;
}

function rook(box){
    columns = 'abcdefgh'.toLocaleUpperCase().split('');
    columns.slice(0, 8);
    var movements = [];
    var obstacle;

    //forward
    for(i = box.coordinate.row + 1; i <= 8; i++){
        obstacle = false;
        movements.push(box.coordinate.column + i);
        //removing boxes with obstacles
        for(k = 0; k < box.chessboard.boxes.length; k++){
            if(!Number.isNaN(box.chessboard.boxes[k].piece)){
                 if(box.chessboard.boxes[k].coordinate.column == box.coordinate.column){
                     if(box.chessboard.boxes[k].coordinate.row == i){
                        obstacle = true;
                        break;
                     }
                 }
            }
        }
        if(obstacle) break;
    }

    //backward
    for(i = box.coordinate.row - 1; i >= 1; i--){
        obstacle = false;
        movements.push(box.coordinate.column + i);
        for(k = 0; k < box.chessboard.boxes.length; k++){
            if(!Number.isNaN(box.chessboard.boxes[k].piece)){
                 if(box.chessboard.boxes[k].coordinate.column == box.coordinate.column){
                     if(box.chessboard.boxes[k].coordinate.row == i){
                        obstacle = true;
                        break;
                     }
                 }
            }
        }
        if(obstacle) break;
    }

    //right
    for(i = columns.indexOf(box.coordinate.column) + 1; i <= 7; i++){
        obstacle = false;
        movements.push(columns[i] + box.coordinate.row);
        for(k = 0; k < box.chessboard.boxes.length; k++){
            if(!Number.isNaN(box.chessboard.boxes[k].piece)){
                 if(box.chessboard.boxes[k].coordinate.column == columns[i]){
                     if(box.chessboard.boxes[k].coordinate.row == box.coordinate.row){
                        obstacle = true;
                        break;
                     }
                 }
            }
        }
        if(obstacle) break;
    }

    //left
    for(i = columns.indexOf(box.coordinate.column) - 1; i >= 0; i--){
        obstacle = false;
        movements.push(columns[i] + box.coordinate.row);
        for(k = 0; k < box.chessboard.boxes.length; k++){
            if(!Number.isNaN(box.chessboard.boxes[k].piece)){
                 if(box.chessboard.boxes[k].coordinate.column == columns[i]){
                     if(box.chessboard.boxes[k].coordinate.row == box.coordinate.row){
                        obstacle = true;
                        break;
                     }
                 }
            }
        }
        if(obstacle) break;
    }
    return movements;
}

function bishop(box){
    columns = 'abcdefgh'.toLocaleUpperCase().split('');
    columns.slice(0, 8);
    var movements = [];
    var obstacle;

    //diagonal movements
    var actual_column = columns.indexOf(box.coordinate.column);
    for(i = box.coordinate.row + 1; i <= 8; i++){
        obstacle = false;
        actual_column++;
        if(Number.isNaN(columns[actual_column] + i)) break;
        movements.push(columns[actual_column] + i);
        for(k = 0; k < box.chessboard.boxes.length; k++){
            if(!Number.isNaN(box.chessboard.boxes[k].piece)){
                 if(box.chessboard.boxes[k].coordinate.column == columns[actual_column]){
                     if(box.chessboard.boxes[k].coordinate.row == i){
                        obstacle = true;
                        break;
                     }
                 }
            }
        }
        if(obstacle) break;
    }

    var actual_column = columns.indexOf(box.coordinate.column);
    for(i = box.coordinate.row + 1; i <= 8; i++){
        obstacle = false;
        actual_column--;
        if(Number.isNaN(columns[actual_column] + i)) break;
        movements.push(columns[actual_column] + i);
        for(k = 0; k < box.chessboard.boxes.length; k++){
            if(!Number.isNaN(box.chessboard.boxes[k].piece)){
                 if(box.chessboard.boxes[k].coordinate.column == columns[actual_column]){
                     if(box.chessboard.boxes[k].coordinate.row == i){
                        obstacle = true;
                        break;
                     }
                 }
            }
        }
        if(obstacle) break;
    }

    var actual_column = columns.indexOf(box.coordinate.column);
    for(i = box.coordinate.row - 1; i >= 1; i--){
        obstacle = false;
        actual_column++;
        if(Number.isNaN(columns[actual_column] + i)) break;
        movements.push(columns[actual_column] + i);
        for(k = 0; k < box.chessboard.boxes.length; k++){
            if(!Number.isNaN(box.chessboard.boxes[k].piece)){
                 if(box.chessboard.boxes[k].coordinate.column == columns[actual_column]){
                     if(box.chessboard.boxes[k].coordinate.row == i){
                        obstacle = true;
                        break;
                     }
                 }
            }
        }
        if(obstacle) break;
    }

    var actual_column = columns.indexOf(box.coordinate.column);
    for(i = box.coordinate.row - 1; i >= 1; i--){
        obstacle = false;
        actual_column--;
        if(Number.isNaN(columns[actual_column] + i)) break;
        movements.push(columns[actual_column] + i);
        for(k = 0; k < box.chessboard.boxes.length; k++){
            if(!Number.isNaN(box.chessboard.boxes[k].piece)){
                 if(box.chessboard.boxes[k].coordinate.column == columns[actual_column]){
                     if(box.chessboard.boxes[k].coordinate.row == i){
                        obstacle = true;
                        break;
                     }
                 }
            }
        }
        if(obstacle) break;
    }
    return movements;
}

function knight(box){
    columns = 'abcdefgh'.toLocaleUpperCase().split('');
    columns.slice(0, 8);
    var movements = [];
    var actual_column = columns.indexOf(box.coordinate.column);

    //the knight can jump pieces, so we don't care about obstacles
    if(!(Number.isNaN(columns[actual_column + 2]) || (box.coordinate.row + 1) > 8)){
        movements.push(columns[actual_column + 2] + (box.coordinate.row + 1));
    }

    if(!(Number.isNaN(columns[actual_column + 1]) || (box.coordinate.row + 2) > 8)){
        movements.push(columns[actual_column + 1] + (box.coordinate.row + 2));
    }

    if(!(Number.isNaN(columns[actual_column - 2]) || (box.coordinate.row + 1) > 8)){
        movements.push(columns[actual_column - 2] + (box.coordinate.row + 1));
    }

    if(!(Number.isNaN(columns[actual_column - 1]) || (box.coordinate.row + 2) > 8)){
        movements.push(columns[actual_column - 1] + (box.coordinate.row + 2));
    }

    if(!(Number.isNaN(columns[actual_column + 2]) || (box.coordinate.row - 1) < 1)){
        movements.push(columns[actual_column + 2] + (box.coordinate.row - 1));
    }

    if(!(Number.isNaN(columns[actual_column + 1]) || (box.coordinate.row - 2) < 1)){
        movements.push(columns[actual_column + 1] + (box.coordinate.row - 2));
    }

    if(!(Number.isNaN(columns[actual_column - 2]) || (box.coordinate.row - 1) < 1)){
        movements.push(columns[actual_column - 2] + (box.coordinate.row - 1));
    }

    if(!(Number.isNaN(columns[actual_column - 1]) || (box.coordinate.row - 2) < 1)){
        movements.push(columns[actual_column - 1] + (box.coordinate.row - 2));
    }
    return movements;
}

function king(box){
    columns = 'abcdefgh'.toLocaleUpperCase().split('');
    columns.slice(0, 8);
    var movements = [];
    var actual_column = columns.indexOf(box.coordinate.column);

    //adjacent movements
    if(!(Number.isNaN(columns[actual_column + 1]))){
        movements.push(columns[actual_column + 1] + (box.coordinate.row));
    }

    if(!(Number.isNaN(columns[actual_column - 1]))){
        movements.push(columns[actual_column - 1] + (box.coordinate.row));
    }

    if(!(Number.isNaN(columns[actual_column]) || (box.coordinate.row + 1) > 8)){
        movements.push(columns[actual_column] + (box.coordinate.row + 1));
    }

    if(!(Number.isNaN(columns[actual_column]) || (box.coordinate.row - 1) < 1)){
        movements.push(columns[actual_column] + (box.coordinate.row - 1));
    }

    if(!(Number.isNaN(columns[actual_column + 1]) || (box.coordinate.row + 1) > 8)){
        movements.push(columns[actual_column + 1] + (box.coordinate.row + 1));
    }

    if(!(Number.isNaN(columns[actual_column - 1]) || (box.coordinate.row + 1) > 8)){
        movements.push(columns[actual_column - 1] + (box.coordinate.row + 1));
    }

    if(!(Number.isNaN(columns[actual_column + 1]) || (box.coordinate.row - 1) < 1)){
        movements.push(columns[actual_column + 1] + (box.coordinate.row - 1));
    }

    if(!(Number.isNaN(columns[actual_column - 1]) || (box.coordinate.row - 1) < 1)){
        movements.push(columns[actual_column - 1] + (box.coordinate.row - 1));
    }
    return movements;
}

function queen(box){
    columns = 'abcdefgh'.toLocaleUpperCase().split('');
    columns.slice(0, 8);
    var movements = [];
    var obstacle;

    //a combination of rook and bishop
    for(i = box.coordinate.row + 1; i <= 8; i++){
        obstacle = false;
        movements.push(box.coordinate.column + i);
        for(k = 0; k < box.chessboard.boxes.length; k++){
            if(!Number.isNaN(box.chessboard.boxes[k].piece)){
                 if(box.chessboard.boxes[k].coordinate.column == box.coordinate.column){
                     if(box.chessboard.boxes[k].coordinate.row == i){
                        obstacle = true;
                        break;
                     }
                 }
            }
        }
        if(obstacle) break;
    }

    for(i = box.coordinate.row - 1; i >= 1; i--){
        obstacle = false;
        movements.push(box.coordinate.column + i);
        for(k = 0; k < box.chessboard.boxes.length; k++){
            if(!Number.isNaN(box.chessboard.boxes[k].piece)){
                 if(box.chessboard.boxes[k].coordinate.column == box.coordinate.column){
                     if(box.chessboard.boxes[k].coordinate.row == i){
                        obstacle = true;
                        break;
                     }
                 }
            }
        }
        if(obstacle) break;
    }

    for(i = columns.indexOf(box.coordinate.column) + 1; i <= 7; i++){
        obstacle = false;
        movements.push(columns[i] + box.coordinate.row);
        for(k = 0; k < box.chessboard.boxes.length; k++){
            if(!Number.isNaN(box.chessboard.boxes[k].piece)){
                 if(box.chessboard.boxes[k].coordinate.column == columns[i]){
                     if(box.chessboard.boxes[k].coordinate.row == box.coordinate.row){
                        obstacle = true;
                        break;
                     }
                 }
            }
        }
        if(obstacle) break;
    }

    for(i = columns.indexOf(box.coordinate.column) - 1; i >= 0; i--){
        obstacle = false;
        movements.push(columns[i] + box.coordinate.row);
        for(k = 0; k < box.chessboard.boxes.length; k++){
            if(!Number.isNaN(box.chessboard.boxes[k].piece)){
                 if(box.chessboard.boxes[k].coordinate.column == columns[i]){
                     if(box.chessboard.boxes[k].coordinate.row == box.coordinate.row){
                        obstacle = true;
                        break;
                     }
                 }
            }
        }
        if(obstacle) break;
    }

    var actual_column = columns.indexOf(box.coordinate.column);
    for(i = box.coordinate.row + 1; i <= 8; i++){
        obstacle = false;
        actual_column++;
        if(Number.isNaN(columns[actual_column] + i)) break;
        movements.push(columns[actual_column] + i);
        for(k = 0; k < box.chessboard.boxes.length; k++){
            if(!Number.isNaN(box.chessboard.boxes[k].piece)){
                 if(box.chessboard.boxes[k].coordinate.column == columns[actual_column]){
                     if(box.chessboard.boxes[k].coordinate.row == i){
                        obstacle = true;
                        break;
                     }
                 }
            }
        }
        if(obstacle) break;
    }

    var actual_column = columns.indexOf(box.coordinate.column);
    for(i = box.coordinate.row + 1; i <= 8; i++){
        obstacle = false;
        actual_column--;
        if(Number.isNaN(columns[actual_column] + i)) break;
        movements.push(columns[actual_column] + i);
        for(k = 0; k < box.chessboard.boxes.length; k++){
            if(!Number.isNaN(box.chessboard.boxes[k].piece)){
                 if(box.chessboard.boxes[k].coordinate.column == columns[actual_column]){
                     if(box.chessboard.boxes[k].coordinate.row == i){
                        obstacle = true;
                        break;
                     }
                 }
            }
        }
        if(obstacle) break;
    }

    var actual_column = columns.indexOf(box.coordinate.column);
    for(i = box.coordinate.row - 1; i >= 1; i--){
        obstacle = false;
        actual_column++;
        if(Number.isNaN(columns[actual_column] + i)) break;
        movements.push(columns[actual_column] + i);
        for(k = 0; k < box.chessboard.boxes.length; k++){
            if(!Number.isNaN(box.chessboard.boxes[k].piece)){
                 if(box.chessboard.boxes[k].coordinate.column == columns[actual_column]){
                     if(box.chessboard.boxes[k].coordinate.row == i){
                        obstacle = true;
                        break;
                     }
                 }
            }
        }
        if(obstacle) break;
    }

    var actual_column = columns.indexOf(box.coordinate.column);
    for(i = box.coordinate.row - 1; i >= 1; i--){
        obstacle = false;
        actual_column--;
        if(Number.isNaN(columns[actual_column] + i)) break;
        movements.push(columns[actual_column] + i);
        for(k = 0; k < box.chessboard.boxes.length; k++){
            if(!Number.isNaN(box.chessboard.boxes[k].piece)){
                 if(box.chessboard.boxes[k].coordinate.column == columns[actual_column]){
                     if(box.chessboard.boxes[k].coordinate.row == i){
                        obstacle = true;
                        break;
                     }
                 }
            }
        }
        if(obstacle) break;
    }
    return movements;
}
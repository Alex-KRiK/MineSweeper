"use strict";
var width = 9;
var height = 9;
var eImages = [];
var emptyCellsCount = 0;
var minesCount = 13;
var flagCount = 0;
var PlaceMinesCount= 0; //count of placed mines
var CELL_MINE = 100;
var arrayFieldNumbers = [];

//draw mine field
var eContainer = document.getElementById("mine-field-container");
var eTable = document.createElement("table");
var eTbody = document.createElement("tbody");

for (var row = 0; row < height; row++) {
    var eTr = document.createElement("tr");
    eImages[row] = [];

    for (var col = 0; col < width; col++) {
        var eTd = document.createElement("td");
        var eImg = document.createElement("img");
        eImg.src = "images/field.jpg";
        eImg.dataset.col = col;
        eImg.dataset.row = row;
        eImages[row][col] = eImg;

        eTd.appendChild(eImg);
        eTr.appendChild(eTd);
    }
    eTbody.appendChild(eTr);
}
eTable.appendChild(eTbody);
eContainer.appendChild(eTable);

//button for reset game
var eButton = document.querySelector("button");
eButton.addEventListener("click", function () {
    document.location.reload();
});

//write in arrayFieldNumbers
for (var row = 0; row < height; row++) {
    arrayFieldNumbers[row] = [];
    for (var col = 0; col < width; col++) {
        arrayFieldNumbers[row][col] = 0;
    }
}
//document.write(arrayFieldNumbers.join());

//place the mines on the playing field
while (PlaceMinesCount != minesCount) {
    var row = Math.floor(Math.random() * height);
    var col = Math.floor(Math.random() * width);

    if (arrayFieldNumbers[row][col] === CELL_MINE) continue;
    arrayFieldNumbers[row][col] = CELL_MINE;
    PlaceMinesCount++;
}
//document.write(arrayFieldNumbers.join());

//place the numbers around the mines
for (var row = 0; row < height; row++) {
    for (var col = 0; col < width; col++) {

        if (arrayFieldNumbers[row][col] === CELL_MINE) {

            //top diagonal left
            if ((row > 0) && (col > 0) && (arrayFieldNumbers[row-1][col-1] != CELL_MINE)) {
                arrayFieldNumbers[row-1][col-1]++;
            }
            //top center
            if ((row > 0) && (arrayFieldNumbers[row-1][col] != CELL_MINE)) {
                arrayFieldNumbers[row-1][col]++;
            }
            //top diagonal right
            if ((row > 0) && (col < width-1) && (arrayFieldNumbers[row-1][col+1] != CELL_MINE)) {
                arrayFieldNumbers[row-1][col+1]++;
            }
            //right
            if ((col < width-1) && (arrayFieldNumbers[row][col+1] != CELL_MINE)) {
                arrayFieldNumbers[row][col + 1]++;
            }
            //bottom diagonal right
            if ((row < height-1) && (col < width-1) && (arrayFieldNumbers[row+1][col+1] != CELL_MINE)) {
                arrayFieldNumbers[row + 1][col + 1]++;
            }
            //bottom center
            if ((row < height-1) && (arrayFieldNumbers[row+1][col] != CELL_MINE)) {
                arrayFieldNumbers[row + 1][col]++;
            }
            //bottom diagonal left
            if ((row < height-1) && (col > 0) && (arrayFieldNumbers[row+1][col-1] != CELL_MINE)) {
                arrayFieldNumbers[row + 1][col - 1]++;
            }
            //left
            if ((col > 0) && (arrayFieldNumbers[row][col-1] != CELL_MINE)) {
                arrayFieldNumbers[row][col - 1]++;
            }
        }
    }
}
//document.write(arrayFieldNumbers.join());
//console.log(arrayFieldNumbers);

//right-clicked flags
for (var row = 0; row < height; row++) {
    for (var col = 0; col < width; col++) {
        var eImgCell = eImages[row][col];

        eImgCell.addEventListener("contextmenu", function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (flagCount < minesCount) {
            var element = event.target;
            element.src = "images/flag.jpg";
            flagCount++;

            //пытаюсь сделать чтобы райт-клик по флажку опять поле пустое на его месте прорисовывал.
            //eImages[row][col] = element; //Uncaught TypeError: Cannot set property '9' of undefined at HTMLImageElement.<anonymous>

            } else {
                alert('Число отмеченных клеток не должно превышать количества бомб на игровом поле (' + minesCount + ')');
            }
        });
    }
}

/*//right-clicked delete flag, paste field - no working
for (var row = 0; row < height; row++) {
    for (var col = 0; col < width; col++) {
        var eImgCell2 = eImages[row][col];

        eImgCell.addEventListener("contextmenu", function (event) {
        event.preventDefault();
        event.stopPropagation();

        var element = event.target;
        element.src = "images/field.jpg";
        flagCount--;
        });
    }
}*/

//Cell selection (click)
var click = function (row, col) {
    if (arrayFieldNumbers[row][col] === CELL_MINE) {
        eImages[row][col].src = "images/mine.jpg";
        setTimeout('alert("You lose! 0_o")', 100);
        setTimeout('document.location.reload()', 300);
    }   else {
        eImages[row][col].src = "images/" + arrayFieldNumbers[row][col] + ".jpg";
        emptyCellsCount++;

        if (emptyCellsCount === (width * height - CELL_MINE)) {
            GameWin();
        }

        if (arrayFieldNumbers[row][col] === 0) {
            findEmpty(row, col);
        }
    }
}

for (var row = 0; row < height; row++) {
    for (var col = 0; col < width; col++) {
        var eImgCell = eImages[row][col]; // eImgCell?

        eImgCell.addEventListener("click",
            function (event) {
                //event.preventDefault();
                //event.stopPropagation();
                var element = event.target;
                var col = parseInt(element.dataset.col);
                var row = parseInt(element.dataset.row);
                click(row, col);
            }
        );
    }
}

//searching and opening for empty cell
var findEmpty = function (row, col) {
    if (emptyCellsCount === (width * height - CELL_MINE)) {
        GameWin();
    }
    //check top diagonal left cell
    if ((row > 0) && (col > 0)) {
        eImages[row - 1][col - 1].src = "images/" + arrayFieldNumbers[row - 1][col - 1] + ".jpg";
        emptyCellsCount++;
/*        if (arrayFieldNumbers[row - 1][col - 1] === 0) {
            findEmpty(row - 1, col - 1);
        }*/
    }
    //check top cell
    if (row > 0) {
        eImages[row - 1][col].src = "images/" + arrayFieldNumbers[row - 1][col] + ".jpg";
        emptyCellsCount++;
/*        if (arrayFieldNumbers[row - 1][col] = 0) {
            findEmpty(row - 1, col);
        }*/
    }

    //check top diagonal right cell
    if ((row > 0) && (col < width - 1)) {
        eImages[row - 1][col + 1].src = "images/" + arrayFieldNumbers[row - 1][col + 1] + ".jpg";
        emptyCellsCount++;
/*        if (arrayFieldNumbers[row - 1][col + 1] = 0) {
            findEmpty(row - 1, col + 1);
        }*/
    }
    //check right cell
    if (col < width - 1) {
        eImages[row][col + 1].src = "images/" + arrayFieldNumbers[row][col + 1] + ".jpg";
        emptyCellsCount++;
/*        if (arrayFieldNumbers[row][col + 1] = 0) {
            findEmpty(row, col + 1);
        }*/
    }
    //check bottom diagonal right cell
    if ((row < height - 1) && (col < width - 1)) {
        eImages[row + 1][col + 1].src = "images/" + arrayFieldNumbers[row + 1][col + 1] + ".jpg";
        emptyCellsCount++;
/*        if (arrayFieldNumbers[row + 1][col + 1] = 0) {
            findEmpty(row + 1, col + 1);
        }*/
    }

    //check bottom cell
    if (row < height - 1) {
        eImages[row + 1][col].src = "images/" + arrayFieldNumbers[row + 1][col] + ".jpg";
        emptyCellsCount++;
/*        if (arrayFieldNumbers[row + 1][col] = 0) {
            findEmpty(row + 1, col);
        }*/
    }
    //check bottom diagonal left cell
    if ((row < height - 1) && (col > 0)) {
        eImages[row + 1][col - 1].src = "images/" + arrayFieldNumbers[row + 1][col - 1] + ".jpg";
        emptyCellsCount++;
/*        if (arrayFieldNumbers[row + 1][col - 1] = 0) {
            findEmpty(row + 1, col - 1);
        }*/
    }
    //check left cell
    if (col > 0) {
        eImages[row][col - 1].src = "images/" + arrayFieldNumbers[row][col - 1] + ".jpg";
        emptyCellsCount++;
/*        if (arrayFieldNumbers[row][col - 1] = 0) {
            findEmpty(row, col - 1);
        }*/
    }
}










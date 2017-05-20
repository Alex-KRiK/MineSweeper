"use strict";
var width = 9;
var height = 9;
var eImages = [];
var emptyCellsCount = 0;
var minesCount = 13;
var flagCount = 0;
var placeMinesCount= 0; //count of placed mines
var CELL_MINE = 100;
var arrayFieldNumbers = [];
var row, col;

//draw mine field
var eContainer = document.getElementById("mine-field-container");
var eTable = document.createElement("table");
var eTbody = document.createElement("tbody");

for (row = 0; row < height; row++) {
    var eTr = document.createElement("tr");
    eImages[row] = [];

    for (col = 0; col < width; col++) {
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
for (row = 0; row < height; row++) {
    arrayFieldNumbers[row] = [];
    for (col = 0; col < width; col++) {
        arrayFieldNumbers[row][col] = { number: 0, mine: false, flag: false };
    }
}

//place the mines on the playing field
while (placeMinesCount != minesCount) {
    row = Math.floor(Math.random() * height);
    col = Math.floor(Math.random() * width);

    if (arrayFieldNumbers[row][col].mine) continue;
    arrayFieldNumbers[row][col].mine = true;
    placeMinesCount++;
}

//place the numbers around the mines
for (row = 0; row < height; row++) {
    for (col = 0; col < width; col++) {

        if (arrayFieldNumbers[row][col].mine) {

            //top diagonal left
            if ((row > 0) && (col > 0) && (arrayFieldNumbers[row-1][col-1].mine === false)) {
                arrayFieldNumbers[row-1][col-1].number++;
            }
            //top center
            if ((row > 0) && (arrayFieldNumbers[row-1][col].mine === false)) {
                arrayFieldNumbers[row-1][col].number++;
            }
            //top diagonal right
            if ((row > 0) && (col < width-1) && (arrayFieldNumbers[row-1][col+1].mine === false)) {
                arrayFieldNumbers[row-1][col+1].number++;
            }
            //right
            if ((col < width-1) && (arrayFieldNumbers[row][col+1].mine === false)) {
                arrayFieldNumbers[row][col + 1].number++;
            }
            //bottom diagonal right
            if ((row < height-1) && (col < width-1) && (arrayFieldNumbers[row+1][col+1].mine === false)) {
                arrayFieldNumbers[row + 1][col + 1].number++;
            }
            //bottom center
            if ((row < height-1) && (arrayFieldNumbers[row+1][col].mine === false)) {
                arrayFieldNumbers[row + 1][col].number++;
            }
            //bottom diagonal left
            if ((row < height-1) && (col > 0) && (arrayFieldNumbers[row+1][col-1].mine === false)) {
                arrayFieldNumbers[row + 1][col - 1].number++;
            }
            //left
            if ((col > 0) && (arrayFieldNumbers[row][col-1].mine === false)) {
                arrayFieldNumbers[row][col - 1].number++;
            }
        }
    }
}
//console.log(arrayFieldNumbers);

//right-clicked flags
for (row = 0; row < height; row++) {
    for (col = 0; col < width; col++) {
        eImgCell = eImages[row][col];

        eImgCell.addEventListener("contextmenu", function (event) {
            event.preventDefault();
            event.stopPropagation();
            var element = event.target;
            var col = parseInt(element.dataset.col);
            var row = parseInt(element.dataset.row);

            if ((flagCount < minesCount) && !arrayFieldNumbers[row][col].flag) {
                arrayFieldNumbers[row][col].flag = true;
                element.src = "images/flag.jpg";
                flagCount++;
            } else if ((flagCount <= minesCount) && arrayFieldNumbers[row][col].flag) {
                arrayFieldNumbers[row][col].flag = false;
                element.src = "images/field.jpg";
                flagCount--;
            } else {
                alert("Число отмеченных флажками клеток не должно превышать количества бомб на игровом поле (" + minesCount + ")");
            }
        });
    }
}

//Cell selection (click)
var click = function (row, col) {
    if (arrayFieldNumbers[row][col].mine) {
        eImages[row][col].src = "images/mine.jpg";
        setTimeout('alert("You lose! 0_o")', 100);
        setTimeout('document.location.reload()', 300);
    }   else {
        eImages[row][col].src = "images/" + arrayFieldNumbers[row][col].number + ".jpg";
        arrayFieldNumbers[row][col].opened = true;
        emptyCellsCount++;

        if (emptyCellsCount === (width * height - CELL_MINE)) {
            GameWin();
        }

        if (arrayFieldNumbers[row][col].number === 0) {
            findEmpty(row, col);
        }
    }
}

for (row = 0; row < height; row++) {
    for (col = 0; col < width; col++) {
        var eImgCell = eImages[row][col]; // eImgCell? <img src="...">

        eImgCell.addEventListener("click",
            function (event) {
                event.preventDefault();
                event.stopPropagation();
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

    arrayFieldNumbers[row][col].opened = true;

    if (emptyCellsCount === (width * height - CELL_MINE)) {
        GameWin();
    }

    //check top diagonal left cell
    if ((row > 0) && (col > 0) && (arrayFieldNumbers[row - 1][col - 1].opened != true)) {
        eImages[row - 1][col - 1].src = "images/" + arrayFieldNumbers[row - 1][col - 1].number + ".jpg";
        arrayFieldNumbers[row - 1][col - 1].opened = true;
        emptyCellsCount++;
        if (arrayFieldNumbers[row - 1][col - 1].number === 0) {
            findEmpty(row - 1, col - 1);
        }
    }
    //check top cell
    if ((row > 0) && (arrayFieldNumbers[row - 1][col].opened != true)) {
        eImages[row - 1][col].src = "images/" + arrayFieldNumbers[row - 1][col].number + ".jpg";
        emptyCellsCount++;
        if (arrayFieldNumbers[row - 1][col].number === 0) {
            findEmpty(row - 1, col);
        }
    }
    //check top diagonal right cell
    if ((row > 0) && (col < width - 1) && (arrayFieldNumbers[row - 1][col + 1].opened != true)) {
        eImages[row - 1][col + 1].src = "images/" + arrayFieldNumbers[row - 1][col + 1].number + ".jpg";
        emptyCellsCount++;
        if (arrayFieldNumbers[row - 1][col + 1].number === 0) {
            findEmpty(row - 1, col + 1);
        }
    }
    //check right cell
    if ((col < width - 1) && (arrayFieldNumbers[row][col + 1].opened != true)) {
        eImages[row][col + 1].src = "images/" + arrayFieldNumbers[row][col + 1].number + ".jpg";
        emptyCellsCount++;
        if (arrayFieldNumbers[row][col + 1].number === 0) {
            findEmpty(row, col + 1);
        }
    }
    //check bottom diagonal right cell
    if ((row < height - 1) && (col < width - 1) && (arrayFieldNumbers[row + 1][col + 1].opened != true)) {
        eImages[row + 1][col + 1].src = "images/" + arrayFieldNumbers[row + 1][col + 1].number + ".jpg";
        emptyCellsCount++;
        if (arrayFieldNumbers[row + 1][col + 1].number === 0) {
            findEmpty(row + 1, col + 1);
        }
    }
    //check bottom cell
    if ((row < height - 1) && (arrayFieldNumbers[row + 1][col].opened != true)) {
        eImages[row + 1][col].src = "images/" + arrayFieldNumbers[row + 1][col].number + ".jpg";
        emptyCellsCount++;
        if (arrayFieldNumbers[row + 1][col].number === 0) {
            findEmpty(row + 1, col);
        }
    }
    //check bottom diagonal left cell
    if ((row < height - 1) && (col > 0) && (arrayFieldNumbers[row + 1][col - 1].opened != true)) {
        eImages[row + 1][col - 1].src = "images/" + arrayFieldNumbers[row + 1][col - 1].number + ".jpg";
        emptyCellsCount++;
        if (arrayFieldNumbers[row + 1][col - 1].number === 0) {
            findEmpty(row + 1, col - 1);
        }
    }
    //check left cell
    if ((col > 0) && (arrayFieldNumbers[row][col - 1].opened != true)) {
        eImages[row][col - 1].src = "images/" + arrayFieldNumbers[row][col - 1].number + ".jpg";
        emptyCellsCount++;
        if (arrayFieldNumbers[row][col - 1].number === 0) {
            findEmpty(row, col - 1);
        }
    }
};











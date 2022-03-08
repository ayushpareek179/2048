function runAfterLoading() {
  const gridDisplay = document.querySelector(".grid");
  const scoreDisplay = document.querySelector("#score");
  const resultDisplay = document.querySelector("#result");
  const width = 4;
  let score = 0;
  let squares = [];
  // create the board's squares and fill the innerHTML
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.innerHTML = 0;
      gridDisplay.appendChild(square);
      squares.push(square);
    }
    generate();
    generate();
    // call twice as soon as the board is ready
  }
  createBoard();
  // for inserting 2 into a random unused position
  function generate() {
    let valRanges = [];
    for (let i = 0; i < width * width; i++) {
      if (squares[i].innerHTML == 0) {
        valRanges.push(i);
      }
    }
    let randomNumber = Math.floor(Math.random() * valRanges.length);
    // console.log(typeof squares[randomNumber].innerHTML); - a string
    if (valRanges.length == 0) {
      hasLost(); // the grid IS full
    } else {
      squares[valRanges[randomNumber]].innerHTML = 2;
      hasLost(); // the grid might be full
    }
    textColor();
  }
  // function generate(){ - original, infinite loop problem
  // let randomNumber = Math.floor(Math.random() * squares.length);
  // if (squares[randomNumber].innerHTML == 0) {
  //   squares[randomNumber].innerHTML = 2;
  //   hasLost();
  // } else generate();
  // textColor();
  // }
  // used when the → button is pressed
  function swipeRight() {
    for (let i = 0; i < width * width; i++) {
      if (i % 4 === 0) {
        // grabbing the row using the first column, one row at a time
        let c1 = squares[i].innerHTML;
        let c2 = squares[i + 1].innerHTML;
        let c3 = squares[i + 2].innerHTML;
        let c4 = squares[i + 3].innerHTML;
        let row = [parseInt(c1), parseInt(c2), parseInt(c3), parseInt(c4)];
        // elements that have to be pushed to the right
        let nonZeros = row.filter(function (ele) {
          return ele !== 0;
        });
        let numZeros = width - nonZeros.length;
        // create an array with zeroes stacked to the left and concatenate the non-zero elements
        let newRow = Array(numZeros).fill(0).concat(nonZeros);
        // assign the newRow to the current row
        for (let j = 0; j < width; j++) {
          squares[i + j].innerHTML = newRow[j];
        }
      }
    }
  }
  // used when the ← button is pressed
  function swipeLeft() {
    for (let i = 0; i < width * width; i++) {
      if (i % 4 === 0) {
        // grabbing the row using the first column, one row at a time
        let c1 = squares[i].innerHTML;
        let c2 = squares[i + 1].innerHTML;
        let c3 = squares[i + 2].innerHTML;
        let c4 = squares[i + 3].innerHTML;
        let row = [parseInt(c1), parseInt(c2), parseInt(c3), parseInt(c4)];
        // elements that have to be pushed to the left
        let nonZeros = row.filter(function (ele) {
          return ele !== 0;
        });
        let numZeros = width - nonZeros.length;
        // create an array with non-zero elements and concatenate the zeroes to the right
        let newRow = nonZeros.concat(Array(numZeros).fill(0));
        // assign the newRow to the current row
        for (let j = 0; j < width; j++) {
          squares[i + j].innerHTML = newRow[j];
        }
      }
    }
  }
  // used when → or ← buttons are pressed
  function combineRow() {
    // should not check on/after 15th element
    for (let i = 0; i < width * width - 1; i++) {
      if (i % 4 !== 3 && squares[i].innerHTML === squares[i + 1].innerHTML) {
        squares[i].innerHTML = 2 * squares[i].innerHTML;
        squares[i + 1].innerHTML = 0;
        score += parseInt(squares[i].innerHTML);
        scoreDisplay.innerHTML = score;
      }
    }
    hasWon();
  }
  // used when ↑ or ↓ buttons are pressed
  function combineColumn() {
    // should not check on/after 12th element
    for (let i = 0; i < width * (width - 1); i++) {
      if (squares[i].innerHTML === squares[i + width].innerHTML) {
        squares[i].innerHTML = 2 * squares[i].innerHTML;
        squares[i + width].innerHTML = 0;
        score += parseInt(squares[i].innerHTML);
        scoreDisplay.innerHTML = score;
      }
    }
    hasWon();
  }
  // used when the ↓ button is pressed
  function swipeDown() {
    for (let i = 0; i < width; i++) {
      let r1 = squares[i].innerHTML;
      let r2 = squares[i + width].innerHTML;
      let r3 = squares[i + width * 2].innerHTML;
      let r4 = squares[i + width * 3].innerHTML;
      let column = [parseInt(r1), parseInt(r2), parseInt(r3), parseInt(r4)];
      let nonZeros = column.filter(function (ele) {
        return ele !== 0;
      });
      let numZeros = width - nonZeros.length;
      let newCol = Array(numZeros).fill(0).concat(nonZeros);
      for (let j = 0; j < width; j++) {
        squares[i + width * j].innerHTML = newCol[j];
      }
    }
  }
  // used when the ↑ button is pressed
  function swipeUp() {
    for (let i = 0; i < width; i++) {
      let r1 = squares[i].innerHTML;
      let r2 = squares[i + width].innerHTML;
      let r3 = squares[i + width * 2].innerHTML;
      let r4 = squares[i + width * 3].innerHTML;
      let column = [parseInt(r1), parseInt(r2), parseInt(r3), parseInt(r4)];
      let nonZeros = column.filter(function (ele) {
        return ele !== 0;
      });
      let numZeros = width - nonZeros.length;
      let newCol = nonZeros.concat(Array(numZeros).fill(0));
      for (let j = 0; j < width; j++) {
        squares[i + width * j].innerHTML = newCol[j];
      }
    }
  }
  // when the → button is pressed
  function keyRight() {
    swipeRight();
    combineRow();
    swipeRight();
    generate();
  }
  // when the ← button is pressed
  function keyLeft() {
    swipeLeft();
    combineRow();
    swipeLeft();
    generate();
  }
  // when the ↓ button is pressed
  function keyDown() {
    swipeDown();
    combineColumn();
    swipeDown();
    generate();
  }
  // when the ↑ button is pressed
  function keyUp() {
    swipeUp();
    combineColumn();
    swipeUp();
    generate();
  }
  // checks which key has been pressed
  function control(e) {
    const take = e.keyCode || e.key || e.which; // to ensure compatibility
    if (take === 39) {
      keyRight();
    } else if (take === 37) {
      keyLeft();
    } else if (take === 40) {
      keyDown();
    } else if (take === 38) {
      keyUp();
    }
  }
  document.addEventListener("keyup", control);
  function hasWon() {
    for (let i = 0; i < width * width; i++) {
      if (squares[i].innerHTML == 2048) {
        resultDisplay.innerHTML = "You have won 🎇";
        document.removeEventListener("keyup", control);
      }
    }
  }
  function hasLost() {
    if (!(zeroCheck() || horCheck() || verCheck())) {
      resultDisplay.innerHTML = "You've lost 😢";
      document.removeEventListener("keyup", control);
    }
  }
  // if the grid has any zeroes
  function zeroCheck() {
    for (let i = 0; i < width * width; i++) {
      if (squares[i].innerHTML == 0) {
        return true;
      }
    }
    return false;
  }
  // if there are tiles that can be combined horizontally
  function horCheck() {
    for (let i = 0; i < width * width; i++) {
      if (i % width !== 3) {
        if (squares[i].innerHTML == squares[i + 1].innerHTML) {
          return true;
        }
      }
    }
    return false;
  }
  // if there are tiles that can be combined vertically
  function verCheck() {
    for (let i = 0; i < width * (width - 1); i++) {
      if (squares[i].innerHTML == squares[i + width].innerHTML) {
        return true;
      }
    }
    return false;
  }
  // styling the tiles
  function textColor() {
    for (let i = 0; i < width * width; i++) {
      let x = squares[i];
      switch (squares[i].innerHTML) {
        case "0":
          x.style.backgroundColor = "rgb(238, 228, 218)";
          x.style.color = "rgba(238, 228, 218, 0.35)";
          break;
        case "2":
          x.style.backgroundColor = "#eee4da";
          x.style.color = "black";
          break;
        case "4":
          x.style.backgroundColor = "#eee1c9";
          x.style.color = "black";
          break;
        case "8":
          x.style.backgroundColor = "#f3b27a";
          x.style.color = "white";
          break;
        case "16":
          x.style.backgroundColor = "#f69664";
          x.style.color = "white";
          break;
        case "32":
          x.style.backgroundColor = "#f77c5f";
          x.style.color = "white";
          break;
        case "64":
          x.style.backgroundColor = "#f75f3b";
          x.style.color = "white";
          break;
        case "128":
          x.style.backgroundColor = "#edd073";
          x.style.color = "white";
          break;
        case "256":
          x.style.backgroundColor = "#edcc62";
          x.style.color = "white";
          break;
        case "512":
          x.style.backgroundColor = "#edc950";
          x.style.color = "white";
          break;
        case "1024":
          x.style.backgroundColor = "rgb(237, 197, 63)";
          x.style.color = "white";
          break;
        case "2048":
          x.style.backgroundColor = "rgb(237, 194, 46)";
          x.style.color = "white";
          break;
      }
    }
  }
}
document.addEventListener("DOMContentLoaded", runAfterLoading);

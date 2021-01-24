//Battleship coding exercise from Head First Javascript Programming guide. 

const view = {
  displayMessage: function (msg) {
    const messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },

  displayHit: function (location) {
    const cell = document.getElementById(location);
    cell.setAttribute("class", "hit");

  },

  displayMiss: function (location) {
    const cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
};


const model = {
  boardSize: 7,
  numShips: 3,
  shipsSunk: 0,
  shipLength: 3,
  ships: [
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
  ],

  fire: function (guess) {
    for (let i = 0; i < this.numShips; i++) {
      let ship = this.ships[i];
      let index = ship.locations.indexOf(guess);
      if (index >= 0) {
        if (ship.hits[index] === "hit") {
          view.displayMessage("This location has already been hit.");
          return false;
        }
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("HIT!");
        if (this.isSunk(ship)) {
          view.displayMessage("You sank my battleship!");
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("You Missed!");
    return false;
  },
  isSunk: function (ship) {
    for (let i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },

  generateShipLocations: function () {
    let locations;
    for (let i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      }
      while (this.collision(locations));
      this.ships[i].locations = locations;
      console.log(locations.map(location => String.fromCharCode(location / 10 + 65) + location % 10))
    }
  },

  generateShip: function () {
    const direction = Math.floor(Math.random() * 2);
    let row;
    let col;
    if (direction === 1) {
      //Generate a starting location for a horizontal ship
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
    } else {
      //Generate a starting location for a vertical ship
      row = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
      col = Math.floor(Math.random() * this.boardSize);
    }

    const newShipLocations = [];
    for (let i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        //add location to array for new horizontal ship
        newShipLocations.push(row + "" + (col + i));
      } else {
        //add location to array for vertical ship
        newShipLocations.push((row + i) + "" + col);
      }
    }
    return newShipLocations;
  },

  collision: function (locations) {
    for (let i = 0; i < this.numShips; i++) {
      let ship = this.ships[i]; //this "ships in the above is just locations"
      for (let j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  }
};


function init() {
  const fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  const guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeypress;

  model.generateShipLocations();
}

function parseGuess(guess) { //C3
  const alphabet = ["A", "B", "C", "D", "E", "F", "G"];

  if (guess === null || guess.length !== 2) {
    alert("Oops, please enter a letter and a number on the board. [" + guess + "]");
  } else {
    const firstChar = guess.charAt(0);
    const row = alphabet.indexOf(firstChar); //give me the index of letter C if the guess is C3
    const column = guess.charAt(1); //second chara in the guess --> 3

    if (isNaN(row) || isNaN(column)) {
      alert("Oops that isn't on the board. isNaN");
    } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
      alert("Oops, that's off the board!");
    } else {
      return row + column;
    }
  }
  return null;
}

const controller = {
  guesses: 0,

  processGuess: function (guess) {
    let location = parseGuess(guess); //this guess has been parsed and verified
    if (location) {
      this.guesses++; //this just counts all the valid guesses
      let hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("You sank all my battleshiops, in " + this.guesses + " guesses")
      }
    }
  }
};


function handleFireButton() {
  const guessInput = document.getElementById("guessInput");
  const guess = guessInput.value.toUpperCase();
  controller.processGuess(guess);
  guessInput.value = "";
}

function handleKeypress(e) {
  const fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}

window.onload = init;







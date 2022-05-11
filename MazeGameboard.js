import Gameboard from "./Gameboard.js";
import MazeTile from "./MazeTile.js";
import Tile from "./Tile.js";

export default class MazeGameboard extends Gameboard {
  #name;
  #controlsPanel;
  #width;
  #rowsCount;
  #colsCount;
  #gameboardDOM;

  #gameboardWorking = false;
  #mazeReady=true;
  #mouseId = null;
  #gameboardHidden = false;
  #mouseDown = false;

  #gameButtons = ["play", "drill", "mouse", "cheese", "reset"];
  #tilesArray = [];

  constructor(name, controlsPanel, width, rowsCount, colsCount) {
    super();
    this.#name = name;
    this.#controlsPanel = controlsPanel;
    this.#width = width;
    this.#rowsCount = rowsCount;
    this.#colsCount = colsCount;

    for (let row = 0; row < this.#rowsCount; row++) {
      for (let col = 0; col < this.#colsCount; col++) {
        const id = row * this.#colsCount + col;

        this.#tilesArray.push(
          new MazeTile(
            id,
            this,
            this.#width / this.#colsCount,
            this.#width / this.#colsCount
          )
        );
      }
    }
  }

  get buttons() {
    return this.#gameButtons;
  }

  get gameboardHTML() {
    return `
      <div class="gameboard ${this.#name}-gameboard" 
      style="grid-template-columns: 
      repeat(${this.#colsCount}, 1fr);">
        ${this.#tilesArray
          .map((tile) => {
            return tile.tileHTML;
          })
          .join("")}
      </div>
      <div class="${this.#name}-modal">
          <div class="modal-image"></div>
          <div class="modal-message">YOU FOUND CHEESE!!</div>
      </div>
      `;
  }

  grabGameboard() {
    this.#gameboardDOM = document.querySelector(`.${this.#name}-gameboard`);
    this.#tilesArray.forEach((tile) => {
      tile.grabTile();
    });

    this.#generateMaze(this.#colsCount > 15 ? 0.3 : 1);
  }

  #resetGameboard() {
    this.#gameboardHidden = false;
    this.#mazeReady=false;
    this.#tilesArray.forEach((tile) => {
      tile.path = false;
      tile.cheese = false;
      tile.reveal("full");
    });
  }

  #generateMaze(speed) {
    // send gameboard is working
    this.#mazeReady=true

    this.#resetGameboard();

    let remainingTiles = [];

    for (let row = 1; row < this.#rowsCount; row += 2) {
      for (let col = 1; col < this.#colsCount; col += 2) {
        const id = row * this.#colsCount + col;

        remainingTiles.push(id);
      }
    }

    const stackTiles = [remainingTiles.shift()];

    const drill = () => {
      const currentTile = stackTiles.pop();

      this.#tilesArray[currentTile].path = true;
      this.#tilesArray[currentTile].reveal("drill-head");

      const possibleMoves = remainingTiles.reduce((acc, tile) => {
        if (
          tile === currentTile + 2 ||
          tile === currentTile - 2 ||
          tile === currentTile + 2 * this.#colsCount ||
          tile === currentTile - 2 * this.#colsCount
        ) {
          acc.push(tile);
        }

        return acc;
      }, []);

      const drillNext = () => {
        const randomMove = Math.floor(Math.random() * possibleMoves.length);
        const nextMove = possibleMoves[randomMove];
        const wallBetween = (currentTile + possibleMoves[randomMove]) / 2;

        stackTiles.push(currentTile);
        stackTiles.push(nextMove);

        remainingTiles = remainingTiles.filter((tile) => {
          return tile !== nextMove;
        });

        this.#tilesArray[nextMove].path = true;
        this.#tilesArray[nextMove].reveal("drill-head");
        this.#tilesArray[wallBetween].path = true;
        this.#tilesArray[wallBetween].reveal("drill-tail");
        this.#tilesArray[currentTile].path = true;
        this.#tilesArray[currentTile].reveal("drill-tail");
      };

      const drillBack = () => {
        const wallBetween =
          (currentTile + stackTiles[stackTiles.length - 1]) / 2;

        this.#tilesArray[currentTile].reveal("full");
        if (wallBetween) {
          this.#tilesArray[wallBetween].reveal("full");
        }
      };

      possibleMoves.length > 0 ? drillNext() : drillBack();

      // Send message gameboard not working
    };

    if (speed > 0) {
      const drillInterval = setInterval(() => {
        drill();
        if (stackTiles.length === 0) {
          clearInterval(drillInterval);
        }
      }, speed * 100);
      return;
    }

    while (stackTiles.length > 0) {
      drill();
    }
  }

  #revealPath(id) {
    const revealStraight = () => {
      const moveDirections = [+1, -1, +this.#colsCount, -this.#colsCount];

      moveDirections.forEach((dir) => {
        if (this.#tilesArray[id + dir].cheese) {
          youFoundCheese();

          //   here goes win process

          // this.#tilesArray[id + dir].cheese(false)
        }

        this.#tilesArray[id + dir].reveal("full");

        if (this.#gameboardHidden && this.#tilesArray[id + dir].path) {
          this.#tilesArray[id + 2 * dir].reveal("part");
        }
      });
    };

    const revealDiagonal = () => {
      const diagonalDirections = [
        +this.#colsCount + 1,
        +this.#colsCount - 1,
        -this.#colsCount + 1,
        -this.#colsCount - 1,
      ];

      diagonalDirections.forEach((dir) => {
        this.#tilesArray[id + dir].reveal("part");
      });
    };

    const youFoundCheese = () => {
      document.querySelector(`.${this.#name}-modal`).style.display = "grid";
      setTimeout(() => {
        document.querySelector(`.${this.#name}-modal`).style.display = "none";
      }, 1000);
    };

    revealStraight();
    if (this.#gameboardHidden) {
      revealDiagonal();
    }
  }

  #placeCheese(speed) {
    this.#tilesArray.forEach((tile) => {
      tile.cheese = false;
    });

    const num = this.#colsCount > 15 ? 3 : 1;
    let i = 0;

    const randomCheese = () => {
      const randomId = Math.floor(Math.random() * this.#tilesArray.length);

      this.#tilesArray[randomId].path && !this.#tilesArray[randomId].cheese
        ? ((this.#tilesArray[randomId].cheese = true), i++)
        : randomCheese();
    };

    if (speed > 0) {
      const placeCheeseInterval = setInterval(() => {
        randomCheese();

        if (i === num) {
          clearInterval(placeCheeseInterval);

          // send gameboard not working
        }
      }, speed * 500);
      return;
    }

    while (i < num) {
      randomCheese();
    }
  }

  #mouse() {
    this.#mouseId = this.#colsCount + 1;
    let mouseTileId = this.#mouseId;

    this.#tilesArray[this.#mouseId].reveal("mouse");
    this.#revealPath(this.#mouseId);

    const eventMouseDown = () => {
      this.#gameboardDOM.addEventListener("mousedown", (e) => {
        e.preventDefault();
        if (e.target.classList.contains("tile-path-mouse")) {
          this.#mouseDown = true;
        }
      });

      this.#gameboardDOM.addEventListener("dragstart", (e) => {
        e.preventDefault();
      });
    };

    const eventMouseUp = () => {
      window.addEventListener("mouseup", (e) => {
        e.preventDefault();
        this.#mouseDown = false;
      });
    };

    const eventMouseOver = () => {
      this.#gameboardDOM.addEventListener("mouseover", (e) => {
        e.preventDefault();

        const possibleMoves = [
          this.#mouseId + 1,
          this.#mouseId - 1,
          this.#mouseId + this.#colsCount,
          this.#mouseId - this.#colsCount,
        ];

        if (
          this.#mouseDown &&
          this.#tilesArray[e.target.dataset.id].path &&
          possibleMoves.includes(parseInt(e.target.dataset.id))
        ) {
          this.#mouseId = parseInt(e.target.dataset.id);
          this.#tilesArray[this.#mouseId].reveal("mouse");
          this.#revealPath(this.#mouseId);
        }
      });
    };

    // const eventMouseClick = () => {
    //   this.#gameboardDOM.addEventListener("click", (e) => {
    //     e.preventDefault();

    //     const possibleMoves = [
    //       mouseTileId + 1,
    //       mouseTileId - 1,
    //       mouseTileId + this.#colsCount,
    //       mouseTileId - this.#colsCount,
    //     ];

    //     if (
    //     //   this.#tilesArray[e.target.dataset.id].path &&
    //       possibleMoves.includes(parseInt(e.target.dataset.id))
    //     ) {
    //       mouseTileId = parseInt(e.target.dataset.id);
    //       this.#tilesArray[mouseTileId].reveal("mouse");
    //       this.#revealPath(mouseTileId);
    //     }
    //   });
    // };

    eventMouseDown();
    eventMouseUp();
    eventMouseOver();
    // eventMouseClick();
  }

  #hideGameboard() {
    this.#gameboardHidden = true;
    let hiddenPath = [];

    for (let row = 1; row < this.#rowsCount; row += 2) {
      for (let col = 1; col < this.#colsCount; col += 2) {
        const id = row * this.#colsCount + col;

        hiddenPath.push(id);
      }
    }
    this.#tilesArray.forEach((tile) => {
      tile.reveal("hidden-wall");
    });
    hiddenPath.forEach((id) => {
      this.#tilesArray[id].reveal("hidden-path");
    });
  }

  buttonClicked(id) {
    switch (id) {
      case 0:
        this.#generateMaze(0);
        this.#placeCheese(0);
        this.#hideGameboard();
        this.#mouse();

        break;
      case 1:
        this.#generateMaze(this.#colsCount > 15 ? 0.3 : 1);
        break;
      case 2:
        this.#mouseId
          ? (this.#tilesArray[this.#mouseId].reveal("full"),
            (this.#mouseId = null))
          : this.#mouse();
        break;
      case 3:
        this.#placeCheese(1);
        break;
      case 4:
        this.#resetGameboard();
        break;
    }
  }
}

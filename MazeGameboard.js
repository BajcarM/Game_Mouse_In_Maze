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
      <div class="gameboard ${this.#name}-gameboard">
        ${this.#tilesArray
          .map((tile) => {
            return tile.tileHTML;
          })
          .join("")}
      </div>
      `;
  }

  grabGameboard() {
    this.#gameboardDOM = document.querySelector(`.${this.#name}-gameboard`);
    this.#tilesArray.forEach((tile) => {
      tile.grabTile();
    });

    this.#generateMaze(1);
  }

  #generateMaze(speed) {
    // send gameboard is working

    this.#tilesArray.forEach((tile) => {
      tile.path = false;
      tile.reveal("full");
    });

    let remainingTiles = [];

    for (let row = 1; row < this.#rowsCount; row += 2) {
      for (let col = 1; col < this.#colsCount; col += 2) {
        const id = row * this.#colsCount + col;

        remainingTiles.push(id);
      }
    }

    const stackTiles = [remainingTiles.shift()];

    const drill = setInterval(() => {
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

      if (stackTiles.length === 0) {
        clearInterval(drill);

        // Send message gameboard not working
      }
    }, speed * 100);
  }

  #revealPath(id) {
    const revealStraight = () => {
      const moveDirections = [+1, -1, +this.#colsCount, -this.#colsCount];

      moveDirections.forEach((dir) => {
        this.#tilesArray[id + dir].reveal("full");

        if (this.#tilesArray[id + dir].path) {
          this.#tilesArray[id + 2 * dir].reveal("part");
        }

        if (this.#tilesArray[id + dir].cheese) {
          console.log("you found cheese");

          //   here goes win process

          // this.#tilesArray[id + dir].cheese(false)
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

    revealStraight();
    revealDiagonal();
  }

  #placeCheeses(num) {
    let i = 0;
    const placeCheese = setInterval(() => {
      const emptyPathsIds = this.#tilesArray.filter((tile) => {
        if (tile.path && !tile.cheese()) {
          return tile.id();
        }
      });

      const randomId = Math.floor(Math.random() * emptyPathsIds.length);

      this.#tilesArray[randomId].cheese(true);

      //   Control panel cheese remaining Count
      //    + animation...

      i++;

      if (i === num) {
        clearInterval(placeCheese);

        // send gameboard not working
      }
    }, 500);
  }

  #mouse() {
    let mouseTileId = this.#colsCount + 1;

    this.#tilesArray[mouseTileId].reveal("mouse");
    this.#revealPath(mouseTileId);

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
          mouseTileId + 1,
          mouseTileId - 1,
          mouseTileId + this.#colsCount,
          mouseTileId - this.#colsCount,
        ];

        if (
          this.#mouseDown &&
          this.#tilesArray[e.target.dataset.id].path &&
          possibleMoves.includes(parseInt(e.target.dataset.id))
        ) {
          mouseTileId = parseInt(e.target.dataset.id);
          this.#tilesArray[mouseTileId].reveal("mouse");
          this.#revealPath(mouseTileId);
        }
      });
    };

    const eventMouseClick = () => {
      this.#gameboardDOM.addEventListener("click", (e) => {
        e.preventDefault();
        

        const possibleMoves = [
          mouseTileId + 1,
          mouseTileId - 1,
          mouseTileId + this.#colsCount,
          mouseTileId - this.#colsCount,
        ];

        if (
          this.#tilesArray[e.target.dataset.id].path &&
          possibleMoves.includes(parseInt(e.target.dataset.id))
        ) {
          mouseTileId = parseInt(e.target.dataset.id);
          this.#tilesArray[mouseTileId].reveal("mouse");
          this.#revealPath(mouseTileId);
        }
      });
    };

    eventMouseDown();
    eventMouseUp();
    eventMouseOver();
    eventMouseClick();
  }

  buttonClicked(id) {
    switch (id) {
      case 1:
        this.#generateMaze(1);
        break;
      case 2:
        this.#mouse();

        break;
    }
  }
}

export default class Gameboard {
  #name;
  #controlsPanel;
  #gameboardDOM;
  #height;
  #width;
  #rowsCount;
  #colsCount;

  #gameboardWorking = false;

  #gameButtons = [];
  #tilesArray = [];

  constructor(name, controlsPanel, height, width, rowsCount, colsCount) {
    this.#name = name;
    this.#controlsPanel = controlsPanel;
    this.#height = height;
    this.#width = width;
    this.#rowsCount = rowsCount;
    this.#colsCount = colsCount;
  }

  get working() {
    return this.#gameboardWorking;
  }

  // Nebo nastavit working na controlsPanelu a odsud jen posílat start a stop

  //   Mozna se budou hodit set height a width a tak

  set height(height) {
    this.#height = height;
  }

  get gameboardHTML() {
    return `
      <div class="gameboard ${this.#name}-gameboard">
        ${this.#tilesArray
          .map((tile) => {
            return tile.tileHTML();
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
  }
}

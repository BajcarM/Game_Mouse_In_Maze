import Button from "./Button.js";

export default class ControlsPanel {
  #gameSectionDOM;

  #gameControlsDOM;
  #containerGameboardDOM;
  #gamesAvailable = [
    //   { name: "mouse in maze", load: () => {} }
  ];

  #gameSelected;

  #mainButtonsLabels = ["choose", "confirm"];

  #buttonsMain = [];
  #buttonsGame = [];

  constructor(gameSectionDOM, gamesAvailable) {
    this.#gameSectionDOM = gameSectionDOM;
    this.#gamesAvailable = gamesAvailable;

    this.#mainButtonsLabels.forEach((label, index) => {
      this.#buttonsMain.push(new Button(index, label, "main", this));
    });

    // add some choose field

    this.#gameSectionDOM.innerHTML = `
        <div class="container-controls">
            <div class="controls-main">
                ${this.#buttonsMain
                  .map((button) => {
                    return button.buttonHTML;
                  })
                  .join("")}
            </div>
            <div class="controls-game">
            </div>
        </div>
        <div class="container-gameboard">
            <div class="gameboard"></div>
        </div>`;

    this.#buttonsMain.forEach((button) => {
      button.grabButton();
      button.listenForClick();
    });

    this.#containerGameboardDOM = document.querySelector(
      ".container-gameboard"
    );
    this.#gameControlsDOM = document.querySelector(".controls-game");
  }

  buttonClicked(id) {
    console.log("button clicked " + id);
  }
}

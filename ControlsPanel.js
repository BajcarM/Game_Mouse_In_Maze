import Button from "./Button.js";
import MazeGameboard from "./MazeGameboard.js";

export default class ControlsPanel {
  #gameSectionDOM;
  #containerControlsDOM;
  #containerGameboardDOM;
  #gamesArray = [
    //   { name: "mouse in maze", load: () => {} }
  ];

  #mainButtonsLabels = ["choose", "confirm"];

  #buttonsMain = [];
  #buttonsGame = [];

  constructor(gameSectionDOM) {
    this.#gameSectionDOM = gameSectionDOM;

    this.#mainButtonsLabels.forEach((label, index) => {
      this.#buttonsMain.push(new Button(index, label, "main", this));
    });

    // add some choose field

    this.#gameSectionDOM.innerHtml = `
        <div class="container-controls">
            <div class="controls-main">
                ${this.#buttonsMain
                  .map((button) => {
                    return button.buttonHTML();
                  })
                  .join("")}
            </div>
            <div class="controls-game">
            </div>
        </div>
        <div class="container-gameboard">
            <div class="gameboard"></div>
        </div>
        `;

        
  }
}

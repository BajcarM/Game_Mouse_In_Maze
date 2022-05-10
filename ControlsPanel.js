import Button from "./Button.js";

export default class ControlsPanel {
  #gameSectionDOM;

  #gameControlsDOM;
  #containerGameboardDOM;
  #gamesAvailable = [
    //   { name: "mouse in maze", load: () => {} }
  ];

  #gameSelected;

  #mainButtonsLabels = ["select"];

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
                <select name="games" id="game-select">
                    <option value="">--Choose a game--</option>                    
                    ${this.#gamesAvailable
                      .map((game, index) => {
                        return `
                            <option value="${index}">
                            ${game.label}
                            </option>`;
                      })
                      .join("")} 
                </select>
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
    switch (id) {
      case 0:
        const gameIndex = document.getElementById("game-select").value;
        if (gameIndex) {
          this.loadGame(this.#gamesAvailable[gameIndex]);
        }
        break;
    }
  }

  loadGame(game) {
    let height, width, rowsCount, colsCount;

    // Media queries a zapsat velikost a orientaci

    switch (game.name) {
      case "maze":
        height = 500;
        width = 900;
        rowsCount = 5;
        colsCount = 9;

        break;

      default:
        break;
    }

    const loadGameboard = () => {
      this.#gameSelected = new game.gameboard(
        game.name,
        this,
        
        width,
        rowsCount,
        colsCount
      );

     

      this.#containerGameboardDOM.innerHTML = this.#gameSelected.gameboardHTML;
      this.#gameSelected.grabGameboard();
      
    };

    const loadButtons = () => {
      this.#gameSelected.buttons.forEach((label, index) => {
        this.#buttonsGame.push(
          new Button(index, label, "game", this.#gameSelected)
        );
        
      });

      this.#gameControlsDOM.innerHTML = `
                  ${this.#buttonsGame
                    .map((button) => {
                      return button.buttonHTML;
                    })
                    .join("")}`;
      this.#buttonsGame.forEach((button) => {
        button.grabButton();
        button.listenForClick();

        
      });

    
    };

    loadGameboard();
    loadButtons();
  }
}

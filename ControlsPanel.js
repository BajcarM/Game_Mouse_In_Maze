import Button from "./Button.js";
import Menu from "./Menu.js";
import Joystick from "./Joystick.js";

export default class ControlsPanel {
  #gameSectionDOM;

  #gameControlsDOM;
  #joystick;
  #containerGameboardDOM;
  #gamesAvailable = [
    //   { name: "mouse in maze", load: () => {} }
  ];

  #gameSelected;

  #mainMenu;
  #buttonsGame = [];

  constructor(gameSectionDOM, gamesAvailable) {
    this.#gameSectionDOM = gameSectionDOM;
    this.#gamesAvailable = gamesAvailable;

    console.log(gamesAvailable.reduce((acc, game) => {
        acc.push(game.label);
        return acc;
      }, []));

    this.#mainMenu = new Menu(
      gamesAvailable.reduce((acc, game) => {
        acc.push(game.label);
        return acc;
      }, []),
      this
    );

    this.#joystick = new Joystick(120, this);

    this.#gameSectionDOM.innerHTML = `
        <div class="container-controls">
            <div class="controls-main">                
                ${this.#mainMenu.menuHTML}
            </div>
            <div class="controls-game">
            </div>
        </div>
        ${this.#joystick.joystickHTML}
        <div class="container-gameboard">
            <div class="gameboard"></div>
        </div>`;

    this.#mainMenu.grabMenu();
    this.#mainMenu.addListeners();

    this.#joystick.grabJoystick();
    this.#joystick.listenForTouch();
    this.#joystick.listenForClick();

    this.#containerGameboardDOM = document.querySelector(
      ".container-gameboard"
    );
    this.#gameControlsDOM = document.querySelector(".controls-game");
  }

  menuSelected(id) {
    this.loadGame(this.#gamesAvailable[id]);
  }

  loadGame(game) {
    let height, width, rowsCount, colsCount;

    // Media queries a zapsat velikost a orientaci

    const mediaCheck = () => {
      const queryMax500W = window.matchMedia("(max-width: 500px)");
      const queryMax500H = window.matchMedia("(max-height: 500px)");
      const queryMin500W = window.matchMedia("(min-width: 500px)");
      const queryMin1000W = window.matchMedia("(min-width: 1000px)");

      switch (game.name) {
        case "maze":
          queryMax500W.matches || queryMax500H.matches
            ? ((height = 330),
              (width = 330),
              (rowsCount = 11),
              (colsCount = 11))
            : ((height = 750),
              (width = 1050),
              (rowsCount = 15),
              (colsCount = 21));

          break;

        default:
          break;
      }
    };

    mediaCheck();

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
    this.#joystick.targetGameboard = game;
  }
}

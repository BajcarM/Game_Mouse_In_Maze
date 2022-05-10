import ControlsPanel from "./ControlsPanel.js";
import MazeGameboard from "./MazeGameboard.js";

const gameSectionDOM = document.querySelector(".section-game");

const gamesAvailable = [
  {
    name: "mouse in maze",
    gameboard: MazeGameboard,
  },
];

const controlsPanel = new ControlsPanel(gameSectionDOM, gamesAvailable);

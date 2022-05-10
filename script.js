import ControlsPanel from "./ControlsPanel.js";
import Gameboard from "./Gameboard.js";
import MazeGameboard from "./MazeGameboard.js";

const gameSectionDOM = document.querySelector(".section-game");

const gamesAvailable = [
  {
    name: "maze",
    label: "Mouse in maze",
    gameboard: MazeGameboard,
  },
];

const controlsPanel = new ControlsPanel(gameSectionDOM, gamesAvailable);

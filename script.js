import ControlsPanel from "./ControlsPanel.js";
import Gameboard from "./Gameboard.js";
import MazeGameboard from "./MazeGameboard.js";
import Joystick from "./Joystick.js";

const gameSectionDOM = document.querySelector(".section-game");

const gamesAvailable = [
  {
    name: "maze",
    label: "Mouse in maze",
    gameboard: MazeGameboard,
  },
];

const controlsPanel = new ControlsPanel(gameSectionDOM, gamesAvailable);


// const joystick = new Joystick(0)

// document.querySelector('.section-game').innerHTML+=`
// <div class="joystick-wrap">
//     <div class="joystick"></div>
// </div>
// `

// joystick.grabJoystick()
// joystick.listenForTouch()
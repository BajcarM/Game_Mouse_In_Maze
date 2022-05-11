import Tile from "./Tile.js";

export default class MazeTile extends Tile {
  #id;
  //   #parentGameboard;
  //   #height;
  //   #width;
  #tileDOM;

  #path;
  #cheese;

  constructor(id, parentGameboard, height, width) {
    super(id, parentGameboard, height, width);
    this.#id = id;
    // this.#parentGameboard = parentGameboard;
    // this.#height = height;
    // this.#width = width;
    this.#path = false;
    this.#cheese = false;
  }

  get cheese() {
    return this.#cheese;
  }
  set cheese(boolean) {
    this.#cheese = boolean;

    if (boolean) {
      this.#tileDOM.className = `tile tile-path-cheese`;
      return;
    }
    if (this.#path) {
      this.#tileDOM.className = `tile tile-path-true`;
    }
  }

  get path() {
    return this.#path;
  }
  set path(boolean) {
    this.#path = boolean;
  }

  grabTile() {
    this.#tileDOM = document.querySelector(`[data-id="${this.#id}"]`);
  }

  reveal(arg) {
    switch (arg) {
      case "full":
        this.#tileDOM.style.opacity = "100%";

        if (this.#cheese) {
          // Here goes win algoritm for cheese, meybe parentGameboard function you foun cheese...

          this.#cheese = false;
          break;
        }
        this.#tileDOM.className = `tile tile-path-${this.#path}`;
        break;

      case "part":
        this.#tileDOM.style.opacity = "70%";
        this.#tileDOM.className = `tile tile-path-${this.#path}`;

        if (this.#cheese) {
          this.#tileDOM.className = `tile tile-path-cheese`;
        }
        break;

      case "hidden-wall" || "hidden-path":
        // this.#tileDOM.classList.add(arg);
        this.#tileDOM.className = `tile tile-path-${arg}`;
        // this.#tileDOM.style.opacity = "30%";
        break;

      // dat default asi
      default:
        //   case "drill-head" || "drill-tail" || "mouse":
        this.#tileDOM.className = `tile tile-path-${arg}`;
        break;
    }
  }
}

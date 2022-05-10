import Tile from "./Tile.js";

export default class MazeTile extends Tile {
  #height;
  #width;
  #tileDOM;

  #path;
  #cheese;

  constructor(id, parentGameboard) {
    super(id, parentGameboard);
    this.#path = false;
    this.#cheese = false;
  }

  get cheese() {
    return this.#cheese;
  }
  set cheese(boolean) {
    this.#cheese = boolean;
  }

  get path() {
    return this.#path;
  }
  set path(boolean) {
    this.#path = boolean;
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
        this.#tileDOM.style.opacity = "50%";
        this.#tileDOM.className = `tile tile-path-${this.#path}`;

        if (this.#cheese) {
          this.#tileDOM.className = `tile tile-path-cheese`;
        }
        break;

      case "drill-head" || "drill-tail" || "mouse":
        this.#tileDOM.className = `tile tile-path-${arg}`;
        break;

      case "hidden-wall" || "hidden-path":
        this.#tileDOM.classList.add(arg);
        break;
    }
  }
}

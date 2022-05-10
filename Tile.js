export default class Tile {
  #id;
  #height;
  #width;
  #tileDOM;
  #parentGameboard;

  constructor(id, parentGameboard) {
    this.#id = id;
    this.#parentGameboard = parentGameboard;
  }

  get id() {
    return this.#id;
  }

  get tileHTML() {
    return `<div class="tile" data-id="${this.#id}">`;
  }

  set height(height) {
    this.#height = height;
    this.#tileDOM.style.height = `${this.#height}px`;
  }

  set width(width) {
    this.#width = width;
    this.#tileDOM.style.width = `${this.#width}px`;
  }

  set parentGameboard(parentGameboard) {
    this.#parentGameboard = parentGameboard;
  }

  grabTile() {
    this.#tileDOM = document.querySelector(`[data-id="${this.#id}"]`);
  }

  recolor(color) {
    this.#tileDOM.style.backgroundColor = color;
  }
}

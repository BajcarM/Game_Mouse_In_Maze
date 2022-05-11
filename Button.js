export default class Button {
  #id;
  #label;
  #buttonDOM;
  #butonSet;
  #buttonTarget;

  constructor(id, label, buttonSet, buttonTarget) {
    this.#id = id;
    this.#label = label;
    this.#butonSet = buttonSet;
    this.#buttonTarget = buttonTarget;
  }

  get buttonHTML() {
    return `
        <button type="button" class="button-${this.#butonSet} 
        button-${this.#label}">
            <div class="button-icon"></div>
            <div class="button-label">${this.#label}</div>
        </button>`;
  }

  grabButton() {
    this.#buttonDOM = document.querySelector(`.button-${this.#label}`);
  }

  listenForClick() {
    this.#buttonDOM.addEventListener("click", () => {
      this.#buttonTarget.buttonClicked(this.#id);
    });

    this.#buttonDOM.addEventListener("touchstart", () => {
        this.#buttonTarget.buttonClicked(this.#id);
      });
  
      
  }
}

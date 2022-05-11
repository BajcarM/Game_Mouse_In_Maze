export default class Menu {
  #items;
  #targetControlsPanel;
  #selectedDOM;
  #listDOM;

  constructor(items, targetControlsPanel) {
    this.#items = items;
    this.#targetControlsPanel = targetControlsPanel;
  }

  get menuHTML() {
    return `
        <div class="menu-container">
            <div class="menu-selected">
                --Choose a game--
            </div>
            <ul class="menu-list">
                ${this.#items
                  .map((item, index) => {
                    return `
                        <li class="menu-item" data-menu="${index}">
                        ${item}
                        </li>`;
                  })
                  .join("")}
            </ul>
        </div>`;
  }

  grabMenu() {
    this.#selectedDOM = document.querySelector(".menu-selected");
    this.#listDOM = document.querySelector(".menu-list");
  }

  addListeners() {
    this.#selectedDOM.addEventListener("click", () => {
      this.#listDOM.classList.toggle("menu-open");
    });

    this.#selectedDOM.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.#listDOM.classList.toggle("menu-open");
    });

    this.#listDOM.addEventListener("click", (e) => {
      this.#listDOM.classList.toggle("menu-open");
      this.#selectedDOM.textContent = e.target.textContent;
      this.#targetControlsPanel.menuSelected(e.target.dataset.menu);
    });

    this.#listDOM.addEventListener("touchstart", (e) => {
      e.preventDefault();

      this.#listDOM.classList.toggle("menu-open");
      this.#selectedDOM.textContent = e.target.textContent;
      this.#targetControlsPanel.menuSelected(e.target.dataset.menu);
    });
  }
}

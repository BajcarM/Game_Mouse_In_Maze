export default class Joystick {
  #height;
  #width;
  #targetGameboard;
  #targetControlsPanel;
  #joystickWrapDOM;
  #joystickDOM;

  #touching = false;

  constructor(height, targetControlsPanel) {
    this.#height = height;
    this.#width = height;

    this.#targetControlsPanel = targetControlsPanel;
  }

  get joystickHTML() {
    return `
      <div class="joystick-wrap" 
      style="height: ${this.#height}px; width: ${this.#height}px">
          <div class="joystick" 
          style="height: ${this.#height / 2}px; width: ${this.#height / 2}px">
          </div>
      </div>
      `;
  }

  set targetGameboard(gameboard) {
    this.#targetGameboard = gameboard;
  }

  grabJoystick() {
    this.#joystickWrapDOM = document.querySelector(".joystick-wrap");
    this.#joystickDOM = document.querySelector(".joystick");
  }

  listenForTouch() {
    let joystickDir;
    let signalToGameboard;

    const wrapBounding = this.#joystickWrapDOM.getBoundingClientRect();
    this.#joystickDOM.style.top = `
        ${wrapBounding.top + this.#height / 4}px`;
    this.#joystickDOM.style.left = `
        ${wrapBounding.left + this.#height / 4}px`;

    this.#joystickWrapDOM.addEventListener("touchstart", (e) => {
      //   e.preventDefault();

      this.#touching = true;
      signalToGameboard = setInterval(() => {
        if (this.#targetGameboard) {
          this.#targetGameboard.arrowKey(joystickDir);
        }
      }, 100);
    });

    window.addEventListener("touchend", (e) => {
      e.preventDefault();
      this.#touching = false;
      clearInterval(signalToGameboard);

      const wrapBounding = this.#joystickWrapDOM.getBoundingClientRect();
      this.#joystickDOM.style.top = `
          ${wrapBounding.top + this.#height / 4}px`;
      this.#joystickDOM.style.left = `
          ${wrapBounding.left + this.#height / 4}px`;
    });

    this.#joystickWrapDOM.addEventListener("touchmove", (e) => {
      e.preventDefault();

      let x = e.touches[0].pageX;
      let y = e.touches[0].pageY;

      const wrapBounding = this.#joystickWrapDOM.getBoundingClientRect();

      const diffX = x - (wrapBounding.left + wrapBounding.width / 2);
      const diffY = y - (wrapBounding.top + wrapBounding.height / 2);

      const followFinger = () => {
        if (
          diffX * diffX + diffY * diffY <
          (wrapBounding.height / 2) * (wrapBounding.height / 2)
        ) {
          this.#joystickDOM.style.top = `${y - this.#height / 4}px`;
          this.#joystickDOM.style.left = `${x - this.#height / 4}px`;
        }
      };

      const computeDirection = () => {
        if (diffY < -Math.abs(diffX)) {
          joystickDir = 0;
        }
        if (diffY > Math.abs(diffX)) {
          joystickDir = 2;
        }
        if (diffX < -Math.abs(diffY)) {
          joystickDir = 1;
        }
        if (diffX > Math.abs(diffY)) {
          joystickDir = 3;
        }
      };

      followFinger();

      if (!this.#touching) {
        return;
      }

      computeDirection();
    });
  }

  listenForClick() {
    // let joystickDir;
    // let signalToGameboard;
    // let wrapBounding = this.#joystickWrapDOM.getBoundingClientRect();

    // this.#joystickWrapDOM.addEventListener("mousedown", (e) => {
    //   e.preventDefault();
    //   document.querySelector("body").style.cursor = "none";
    //   this.#touching = true;
    //   signalToGameboard = setInterval(() => {
    //     if (this.#targetGameboard) {
    //       this.#targetGameboard.arrowKey(joystickDir);
    //     }
    //   }, 100);
    // });

    // window.addEventListener("mouseup", (e) => {
    //   e.preventDefault();
    //   this.#touching = false;
    //   clearInterval(signalToGameboard);
    //   document.querySelector("body").style.cursor = "initial";
    //   this.#joystickDOM.style.top = `
    //       ${wrapBounding.top + this.#height / 4}px`;
    //   this.#joystickDOM.style.left = `
    //       ${wrapBounding.left + this.#height / 4}px`;
    // });

    // this.#joystickWrapDOM.addEventListener("mousemove", (e) => {
    //   e.preventDefault();
    //   wrapBounding = this.#joystickWrapDOM.getBoundingClientRect();
    //   let x = e.offsetX;
    //   let y = e.offsetY;
    //   const diffX = wrapBounding.width / 2 - x;
    //   const diffY = wrapBounding.height / 2 - y;
    //   const followFinger = () => {
    //     if (
    //       diffX * diffX + diffY * diffY <
    //       (wrapBounding.height / 2) * (wrapBounding.height / 2)
    //     ) {
    //       this.#joystickDOM.style.top = `
    //       ${wrapBounding.top + y - this.#height / 4}px`;
    //       this.#joystickDOM.style.left = `
    //       ${wrapBounding.left + x - this.#height / 4}px`;
    //     }
    //   };
    //   const computeDirection = () => {
    //     if (diffY < -Math.abs(diffX)) {
    //       joystickDir = 2;
    //     }
    //     if (diffY > Math.abs(diffX)) {
    //       joystickDir = 0;
    //     }
    //     if (diffX < -Math.abs(diffY)) {
    //       joystickDir = 3;
    //     }
    //     if (diffX > Math.abs(diffY)) {
    //       joystickDir = 1;
    //     }
    //   };
    //   if (!this.#touching) {
    //     return;
    //   }
    //   followFinger();
    //   computeDirection();
    // });
  }
}

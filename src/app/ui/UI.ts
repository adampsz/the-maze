import Stats from "./Stats";
import Inventory from "./Inventory";
import h from "./h";

export default class UI {
  stats = new Stats();
  inventory = new Inventory();

  element: HTMLElement;

  constructor() {
    const ui = this;

    this.element = h(
      ".status",
      this.stats.element,
      h(".spacer"),
      h(
        ".controls",
        h("button", "E", {
          click() {
            ui.inventory.open();
          },
        })
      )
    );

    this.stats.update({ health: 0.3, armor: 0.9 });
  }
}

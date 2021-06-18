import Stats from "./Stats";
import Inventory from "./Inventory";
import h from "./h";
import Player from "../Player";

export default class UI {
  stats: Stats;
  inventory: Inventory;

  element: HTMLElement;

  constructor(player: Player) {
    const ui = this;

    this.stats = new Stats();
    this.inventory = new Inventory(player.inventory);

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

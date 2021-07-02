import { Player } from "../model";

import Inventory from "./Inventory";
import Stats from "./Stats";
import h from "./h";

import { getMaxStatValue } from "../model/items/ItemFactory";

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

    this.update(player);
  }

  update(player: Player) {
    const health = player.stats.get("health") / 100;
    const armor = player.stats.get("armor") / getMaxStatValue("armor");
    this.stats.update({
      health: health,
      armor: armor,
    });
  }
}

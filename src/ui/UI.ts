import { Player, Stats } from "../model";

import InventoryUI from "./Inventory";
import StatsUI from "./Stats";
import h from "./h";

export default class UI {
  model: Player;

  stats: StatsUI;
  inventory: InventoryUI;

  element: HTMLElement;

  constructor(player: Player) {
    const ui = this;

    this.model = player;

    this.stats = new StatsUI();
    this.inventory = new InventoryUI(player);

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

    this.update();
  }

  update() {
    const health = this.model.stat("health") / Stats.max("health");
    const armor = this.model.stat("armor") / Stats.max("armor");

    this.stats.update({
      health: health,
      armor: armor,
    });
  }
}

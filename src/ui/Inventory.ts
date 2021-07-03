import { Player, Inventory, Item, UsableItem, WearableItem } from "../model";

import Dialog from "./Dialog";
import h from "./h";

export default class InventoryUI extends Dialog {
  player: Player;
  data: Inventory;

  list: HTMLElement;
  slots: HTMLElement;

  constructor(player: Player) {
    const list = h("div");
    const slots = h("div");

    super(h("div", slots, h("hr"), list), {
      text: "Ok",
      action: (dialog) => {
        dialog.close();
      },
    });

    this.player = player;
    this.data = player.inventory;
    this.list = list;
    this.slots = slots;

    this.update();
  }

  open() {
    this.update();
    super.open();
  }

  update() {
    this.list.innerHTML = this.slots.innerHTML = "";

    for (let item of this.data.contents())
      this.list.appendChild(this.renderItem(item, false));

    for (let item of this.data.equipped())
      this.slots.appendChild(this.renderItem(item, true));
  }

  renderItem(item: Item, equipped: boolean) {
    return h(".item", item.name, {
      click: () => this.itemClicked(item, equipped),
    });
  }

  itemClicked(item: Item, equipped: boolean) {
    const actions = [
      {
        text: "Cancel",
        action: (dialog: Dialog) => {
          dialog.close();
        },
      },
    ];

    if (item instanceof WearableItem) {
      actions.push({
        text: equipped ? "Unequip" : "Equip",
        action: (dialog: Dialog) => {
          equipped ? this.data.unequip(item) : this.data.equip(item);
          this.update();
          dialog.close();
        },
      });
    }

    if (item instanceof UsableItem) {
      actions.push({
        text: "Use",
        action: (dialog: Dialog) => {
          item.action(this.player);
          this.data.take(item);
          this.update();
          dialog.close();
        },
      });
    }

    this.child(new Dialog(item.name, ...actions)).open();
  }
}

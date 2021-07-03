import Stats from "../Stats";
import UsableItem from "./UsableItem";
import WearableItem, { Slot } from "./WearableItem";

export default class ItemFactory {
  static id = 1;

  create() {
    ItemFactory.id += 1;
    const sumChances = ItemFactory.items.reduce(
      (sum, current) => sum + current[1],
      0
    );
    const randIndex = Math.floor(Math.random() * 2 * sumChances);
    let sum = 0;

    for (const item of ItemFactory.items) {
      if (sum <= randIndex && randIndex < sum + item[1])
        return item[0].length == 3
          ? new WearableItem(...item[0])
          : new UsableItem(...item[0]);

      sum += item[1];
    }

    return null;
  }

  static items: [[string, Stats] | [string, Stats, Slot], number][] = [
    [["Armor 1", new Stats({ speed: 1, armor: 5 }), Slot.armor], 50],
    [["Armor 2", new Stats({ speed: 2, armor: 10 }), Slot.armor], 10],
    [["Armor 3", new Stats({ speed: 3, armor: 20 }), Slot.armor], 5],
    [["Helmet 1", new Stats({ speed: 3, armor: 2 }), Slot.helmet], 7],
    [["Helmet 2", new Stats({ speed: 2, armor: 6 }), Slot.helmet], 57],
    [["Helmet 3", new Stats({ speed: -1, armor: 10 }), Slot.helmet], 51],
    [["Weapon 1", new Stats({ damage: 15, speed: 1 }), Slot.weapon], 100],
    [["Weapon 2", new Stats({ damage: 15, speed: 1 }), Slot.weapon], 50],
    [["Weapon 3", new Stats({ damage: 25, speed: 1 }), Slot.weapon], 20],
    [["Torch 1", new Stats({ view: 10 }), Slot.torch], 75],
    [["Torch 2", new Stats({ view: 15 }), Slot.torch], 35],
    [["Torch 3", new Stats({ view: 20 }), Slot.torch], 5],
    [["Potion 1", new Stats({ health: 10 })], 35],
    [["Potion 2", new Stats({ health: 15 })], 25],
    [["Potion 3", new Stats({ health: 20 })], 15],
  ];
}

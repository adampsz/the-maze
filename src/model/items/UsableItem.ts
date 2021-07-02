import Item from "./Item";
import Stats from "../Stats";

export default class UsableItem extends Item {
  stats: Stats;

  constructor(name: string, stats: Stats) {
    super(name);

    this.stats = stats;
  }
}

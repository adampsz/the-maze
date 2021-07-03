import Item from "./Item";
import Stats from "../Stats";
import Player from "../Player";

export default class UsableItem extends Item {
  stats: Stats;

  constructor(name: string, stats: Stats) {
    super(name);

    this.stats = stats;
  }

  action(player: Player) {
    player.stats.add(this.stats);
  }
}

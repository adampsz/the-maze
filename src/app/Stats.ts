export default class Stats {
  stats: Map<string, number>;

  constructor(stats?: Map<string, number>) {
    if (stats) this.stats = stats;
    else this.stats = new Map();
  }

  add(stats: Stats | { [key: string]: number }): void {
    let statsToAdd: Map<string, number>;
    if (stats instanceof Object) statsToAdd = new Map(Object.entries(stats));
    else statsToAdd = stats;
    for (let [key, value] of statsToAdd) {
      const oldValue = this.stats.get(key);
      if (typeof oldValue !== "undefined") {
        const newValue = oldValue + value;
        this.stats.set(key, newValue);
      } else {
        this.stats.set(key, value);
      }
    }
  }

  get(stat: string): number | undefined {
    return this.stats.get(stat);
  }
}

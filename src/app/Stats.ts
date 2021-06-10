export default class Stats {
  private _stats: Map<string, number>;

  constructor(stats?: Map<string, number>) {
    if (stats) this._stats = stats;
    else this._stats = new Map();
  }

  public get stats(): Map<string, number> {
    return this._stats;
  }

  public add(stats: Stats | { [key: string]: number }): void {
    let statsToAdd: Map<string, number>;
    if (stats instanceof Object)
      statsToAdd = new Map(Object.entries(stats.stats));
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
}

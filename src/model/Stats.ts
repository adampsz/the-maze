export interface StatsData {
  health?: number;
  armor?: number;
  damage?: number;
  speed?: number;
  view?: number;

  [other: string]: number | undefined;
}

export type Stat = keyof StatsData;

export default class Stats {
  private stats: StatsData;

  constructor(stats: StatsData = {}) {
    this.stats = stats;
  }

  clone() {
    return new Stats({ ...this.stats });
  }

  add(stats: Stats | StatsData): void {
    let statsToAdd = stats instanceof Stats ? stats.stats : stats;

    for (let [key, value] of Object.entries(statsToAdd))
      if (value) {
        const oldValue = this.get(key);
        const maxValue = Stats.max(key);

        this.set(key, Math.min(oldValue + value, maxValue));
      }
  }

  get(stat: Stat): number {
    return this.stats[stat] ?? 0;
  }

  set(stat: Stat, value: number): void {
    this.stats[stat] = value;
  }

  static max(stat: string): number {
    return Stats.MAX.get(stat) || Infinity;
  }

  private static MAX = new Stats({
    health: 100,
    armor: 30,
  });
}

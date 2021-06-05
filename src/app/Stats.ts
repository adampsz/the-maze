export default class Stats {
    stats: Map<string, number>;
    constructor(stats: Map<string, number>) {
        this.stats = stats;
    }

    add(stats: Stats): void{
        //TODO - może jakoś inaczej staty trzymać?
    }
}
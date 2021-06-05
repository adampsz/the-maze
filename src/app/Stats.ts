export default class Stats {
    private _stats: Map<string, number>;

    constructor(stats: Map<string, number>) {
        this._stats = stats;
    }

    public get stats(): Map<string, number>{
        return this._stats;
    }

    public add(stats: Stats): void{
        for (let [key, value] of stats.stats) {
            const oldValue = this.stats.get(key);
            if(typeof oldValue !== 'undefined'){
                const newValue = oldValue + value;
                this.stats.set(key, newValue);
            }else{
                this.stats.set(key, value);
            }
        }
    }
}
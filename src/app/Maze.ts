import Block from "./Block";

export default class Maze {
    private mazeMap: Block[][];
    constructor(source: String) {
        this.mazeMap = this.generate(source);
    }

    generate(source: String): Block[][]{
        //TODO - może jakoś inaczej mapę trzymać?
    }
}
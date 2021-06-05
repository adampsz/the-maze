export default abstract class Block {
    isWall: boolean;

    constructor(isWall: boolean) {
        this.isWall = isWall;
    }
}
import Block from "./Block";
import Player from "./Player";

export default abstract class ActionBlock extends Block {
    constructor(isWall: boolean) {
        super(isWall);
    }

    abstract playerAction(player: Player): void;
}
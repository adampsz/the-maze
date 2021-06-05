import Player from "./Player";

export default abstract class Entity {
    abstract goto(x: number, y: number): void;
    abstract dropItems(entity: Entity): void;
}
import Vector from "./Vector";

export default abstract class Entity {
    private _position: Vector;
    
    constructor(position: Vector){
        this._position = position;
    }

    abstract goto(x: number, y: number): void;
    abstract dropItems(entity: Entity): void; // A może to nie powinno być abstrakcyjne? Złodziej może nam dropnąć i my możemy złodziejowi
    
    public get position(): Vector{
        return this._position;
    }

    public moveUp(): void{
        this._position.y -= 1;
    }
    
    public moveLeft(): void{
        this._position.x -= 1;
    }
    
    public moveRight(): void{
        this._position.x += 1;
    }
    
    public moveDown(): void{
        this._position.y += 1;
    }
}
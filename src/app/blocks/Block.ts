import Vector from "../Vector";

export default abstract class Block {
  private _isWall: boolean;
  private _size = new Vector(32, 32); // Może jakoś inaczej?
  private _position: Vector;

  constructor(isWall: boolean, position: Vector) {
    this._isWall = isWall;
    this._position = position;
  }

  public get position(): Vector {
    return this._position;
  }

  public get size(): Vector {
    return this._size;
  }

  public get isWall(): boolean {
    return this._isWall;
  }

  public collision(other: Block): boolean {
    // Ostre nierówności?
    return (
      this.position.x < other.position.x + other.size.x &&
      this.position.x + this.size.x > other.position.x &&
      this.position.y < other.position.y + other.size.y &&
      this.position.y + this.size.y > other.position.y
    );
  }
}

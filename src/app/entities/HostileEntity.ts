import Entity from "./Entity";
import Player from "../Player";
import { Texture } from "pixi.js";

export default abstract class HostileEntity extends Entity {
  constructor(texture: Texture) {
    super(texture);
  }

  abstract attack(entity: Entity): void;
}

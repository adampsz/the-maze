export default class Keyboard {
  private keys = new Set<string>();

  constructor() {
    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
  }

  private keydown = (event: KeyboardEvent) => {
    this.keys.add(event.key);
  };

  private keyup = (event: KeyboardEvent) => {
    this.keys.delete(event.key);
  };

  pressed(key: string): boolean {
    return this.keys.has(key);
  }

  any(...keys: string[]): boolean {
    return keys.some((key) => this.pressed(key));
  }

  destroy() {
    window.removeEventListener("keydown", this.keydown);
    window.removeEventListener("keyup", this.keyup);
  }
}

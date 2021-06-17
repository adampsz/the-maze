/**
 * Klasa obsługująca klawiaturę.
 */
export default class Keyboard {
  private keys = new Set<string>();

  constructor() {
    document.addEventListener("keydown", this.keydown);
    document.addEventListener("keyup", this.keyup);
  }

  private keydown = (event: KeyboardEvent) => {
    this.keys.add(event.key);
  };

  private keyup = (event: KeyboardEvent) => {
    this.keys.delete(event.key);
  };

  /**
   * Sprawdza, czy klawisz jest obecnie wciśnięty. Nazwa klawisza pochodzi
   * z [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key).
   * @param key Nazwa klawisza.
   */
  pressed(key: string): boolean {
    return this.keys.has(key);
  }

  /**
   * Sprawdza, czy którykolwiek z klawiszy jest obecnie wciśnięty. Zapis `keyboard.any('a', 'ArrowLeft')`
   * jest równoważny `keyboard.pressed('a') || keyboard.pressed('ArrowLeft')`.
   * @param keys Lista klawiszy.
   */
  any(...keys: string[]): boolean {
    return keys.some((key) => this.pressed(key));
  }

  /**
   * Sprawdza, czy klawisz jest wciśnięty, jednocześnie zmieniając status klawisza na "zwolniony".
   * Używana, aby wykonać akcję jednorazowo.
   * @param key Nazwa klawisza.
   */
  handle(key: string): boolean {
    if (this.keys.has(key)) {
      this.keys.delete(key);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Niszczy obiekt.
   */
  destroy() {
    window.removeEventListener("keydown", this.keydown);
    window.removeEventListener("keyup", this.keyup);
  }
}

/**
 * Konfiguracja sprężyny.
 */
export interface SpringConfig {
  /**
   * Czas jednego okresu harmonicznego (w ms).
   */
  duration: number;
  /**
   * Określa szybkość wytracania energii przez sprężynę. Wartość 0 oznacza,
   * że sprężyna nie wytraca energii i oscyluje w nieskończoność. Wartość 1
   * oznacza, że sprężyna wytraca całą energię po czasie jednego okresu,
   * zatrzymując się.
   */
  ratio: number;
}

/**
 * Prosta symulacja dynamiki sprężyn (oscylatora harmonicznego).
 */
export default class Spring {
  private static EPS = 0.001;

  /** Wartość sprężyny */
  value = 0;
  /** Wartość, do której dąży sprężyna */
  target = 0;
  /** Prędkość sprężyny */
  velocity = 0;

  private k = 0;
  private c = 0;

  /**
   * Tworzy nową sprężynę.
   * @param config Konfiguracja sprężyny
   * @param value Początkowa wartość sprężyny
   */
  constructor(config: SpringConfig, value?: number) {
    this.setConfig(config);
    this.target = this.value = value ?? 0;
  }

  /**
   * Zmienia konfigurację sprężyny.
   * @param config Nowa konfiguracja sprężyny.
   */
  setConfig(config: SpringConfig): this {
    this.k = (4 * Math.PI ** 2) / (config.duration / 1000) ** 2;
    this.c = 2 * config.ratio * Math.sqrt(this.k);

    return this;
  }

  /**
   * Sprawdza, czy sprężyna jest w spoczynku.
   */
  isAtRest(): boolean {
    return (
      Math.abs(this.value - this.target) < Spring.EPS &&
      Math.abs(this.velocity) < Spring.EPS
    );
  }

  /**
   * Aktualizuje stan sprężyny.
   * @param delta czas (w ms) od ostatniej aktualizacji
   */
  update(delta: number): this {
    if (this.isAtRest()) {
      this.value = this.target;
      this.velocity = 0;
      return this;
    }

    let d = delta / 1000;

    const { k, c } = this;

    let x = this.value - this.target;
    let v = this.velocity;
    let a = -(k * x + c * v);

    const MAX_DELTA = Math.min(10 / k, (1 / 60) * 4);
    while (d > MAX_DELTA) {
      d -= MAX_DELTA;
      x += v * MAX_DELTA;
      v += a * MAX_DELTA;
      a = -(k * x + c * v);
    }

    v += a * d;
    x += v * d;

    this.value = x + this.target;
    this.velocity = v;

    return this;
  }
}

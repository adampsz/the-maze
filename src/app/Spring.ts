export interface SpringConfig {
  duration: number;
  ratio: number;
}

export default class Spring {
  private static EPS = 0.001;

  value = 0;
  target = 0;
  velocity = 0;
  k = 0;
  c = 0;

  constructor(config: SpringConfig, value?: number) {
    this.setConfig(config);
    this.set(value ?? 0);
  }

  setConfig(config: SpringConfig): this {
    this.k = (4 * Math.PI ** 2) / (config.duration / 1000) ** 2;
    this.c = 2 * config.ratio * Math.sqrt(this.k);

    return this;
  }

  isAtRest(): boolean {
    return (
      Math.abs(this.value - this.target) < Spring.EPS &&
      Math.abs(this.velocity) < Spring.EPS
    );
  }

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

  set(x: number): this {
    this.value = x;
    this.target = x;
    return this;
  }

  reset(): this {
    this.value = this.target;
    this.velocity = 0;
    return this;
  }

  move(x: number, delta: number): this {
    this.velocity = ((x - this.value) / delta) * 1000;
    this.value = x;
    return this;
  }
}

import { Block, GenericBlock, DoorBlock, ChestBlock } from "./blocks";
import { Entity, Archer, Monster, Thief } from "./entities";
import { Key } from "./items";

class EntityFactory {
  private id = 1;

  spawn(x: number, y: number) {
    this.id += 1;

    switch (Math.floor(Math.random() * 3)) {
      case 0:
        return new Thief(this.id, x, y);
      case 1:
        return new Archer(this.id, x, y);
      case 2:
      default:
        return new Monster(this.id, x, y);
    }
  }
}

export default class Generator {
  blocks: Block[][];
  entities: Entity[] = [];

  entityFactory = new EntityFactory();

  constructor(levels: number) {
    const size = 2 ** levels - 1;

    this.blocks = new Array(size + 2)
      .fill(0)
      .map(() => new Array(size + 2).fill(GenericBlock.floor));

    for (let i = 0; i <= size + 1; i++) {
      this.blocks[i][0] = GenericBlock.wall;
      this.blocks[i][size + 1] = GenericBlock.wall;
      this.blocks[0][i] = GenericBlock.wall;
      this.blocks[size + 1][i] = GenericBlock.wall;
    }

    this.descend((size + 1) / 2, (size + 1) / 2, levels - 1, 0, true);
  }

  rotate(x: number, y: number, rot: number): [number, number] {
    const [rx, ry] = [
      [+x, +y],
      [-y, +x],
      [-x, -y],
      [+y, -x],
    ][rot % 4];

    return [rx, ry];
  }

  makeTransform(cx: number, cy: number, rot: number) {
    return (x: number, y: number): [number, number] => {
      const [rx, ry] = this.rotate(x, y, rot);
      return [cx + rx, cy + ry];
    };
  }

  makeSetter(cx: number, cy: number, rot: number) {
    const t = this.makeTransform(cx, cy, rot);
    return (x: number, y: number, block: Block) => {
      const [rx, ry] = t(x, y);
      this.blocks[rx][ry] = block;
    };
  }

  shouldDescend(level: number) {
    if (!Generator.levels[level] || Generator.levels[level].length == 0)
      return true;

    if (level <= 1) return false;

    const total = Generator.levels
      .slice(0, level + 1)
      .reduce((x, y) => x + y.length, 0);

    return Math.random() < (Generator.levels[level].length / total) ** level;
  }

  descend(
    cx: number,
    cy: number,
    levels: number,
    rot: number,
    mirror: boolean
  ) {
    if (!this.shouldDescend(levels))
      return this.generate(cx, cy, levels, rot, mirror);

    const tr = this.makeTransform(cx, cy, rot);
    const set = this.makeSetter(cx, cy, rot);
    const s = 2 ** levels - 1;

    for (let i = 0; i <= s; i++) {
      set(+i, 0, GenericBlock.wall);
      set(-i, 0, GenericBlock.wall);
      set(0, +i, GenericBlock.wall);
      set(0, -i, GenericBlock.wall);
    }

    set(0, 1, GenericBlock.floor);
    set(+s, 0, GenericBlock.floor);
    set(-s, 0, GenericBlock.floor);

    const t = 2 ** (levels - 1) - 1;

    this.descend(...tr(-t - 1, -t - 1), levels - 1, rot + 3, !mirror);
    this.descend(...tr(-t - 1, +t + 1), levels - 1, rot + 0, mirror);
    this.descend(...tr(+t + 1, +t + 1), levels - 1, rot + 0, mirror);
    this.descend(...tr(+t + 1, -t - 1), levels - 1, rot + 1, !mirror);
  }

  generate(
    cx: number,
    cy: number,
    levels: number,
    rot: number,
    mirror: boolean
  ) {
    const templates = Generator.levels[levels];
    const template = templates[Math.floor(Math.random() * templates.length)];

    const set = this.makeSetter(cx, cy, rot);
    const t = 2 ** levels - 1;

    template
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line, y) =>
        line.split("").map((ch, x) => {
          set(mirror ? x - t : t - x, y - t, this.makeBlock(ch));
        })
      );
  }

  makeBlock(ch: string) {
    switch (ch) {
      case "D":
        return new DoorBlock(0);
      case "C":
        return new ChestBlock([new Key(0)]);
      case "d":
        return new DoorBlock(1);
      case "c":
        return new ChestBlock([new Key(1)]);
      case "#":
        return GenericBlock.wall;
      case ".":
      default:
        return GenericBlock.floor;
    }
  }

  // Poziomy używane do generowania labiryntu
  // Wejście do poziomu jest w górnym lewym rogu, a wyjście w górnym prawym.
  static levels = [
    [],
    [
      `
        ...
        ...
        ...
      `,
      `
        ...
        .#.
        ...
      `,
    ],
    [
      `
        .D.....
        .######
        .#.....
        .#.###.
        .#..C#.
        .#####.
        .......
      `,
      `
        ...#...
        ...#...
        ...D...
        ...#...
        ...#...
        ...#...
        ..C#...
      `,
      `
        ..C#...
        ...#...
        ...d...
        ...####
        ...D...
        ...#...
        ...#c..
      `,
      `
        .#.....
        .#....#
        .....#.
        ..#....
        ###....
        ....##.
        ...##..
      `,
    ],
    [],
  ];
}

import { Block, GenericBlock, DoorBlock, ChestBlock } from "./blocks";
import { Entity, EntityFactory } from "./entities";
import { Item, Key, ItemFactory, WearableItem } from "./items";

function rotate(x: number, y: number, rot: number): [number, number] {
  const [rx, ry] = [
    [+x, +y],
    [-y, +x],
    [-x, -y],
    [+y, -x],
  ][rot % 4];

  return [rx, ry];
}

export default class Generator {
  blocks: Block[][];
  entities: Entity[] = [];

  entityFactory = new EntityFactory();
  itemFactory = new ItemFactory();

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

    this.blocks[1][2] = this.generateChest(4);
  }

  setBlock(x: number, y: number, block: Block) {
    this.blocks[y][x] = block;
  }

  makeTransform(cx: number, cy: number, rot: number) {
    return (x: number, y: number): [number, number] => {
      const [rx, ry] = rotate(x, y, rot);
      return [cx + rx, cy + ry];
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
    const s = 2 ** levels - 1;

    for (let i = 0; i <= s; i++) {
      this.setBlock(...tr(+i, 0), GenericBlock.wall);
      this.setBlock(...tr(-i, 0), GenericBlock.wall);
      this.setBlock(...tr(0, +i), GenericBlock.wall);
      this.setBlock(...tr(0, -i), GenericBlock.wall);
    }

    this.setBlock(...tr(+0, 1), GenericBlock.floor);
    this.setBlock(...tr(+s, 0), GenericBlock.floor);
    this.setBlock(...tr(-s, 0), GenericBlock.floor);

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

    const tr = this.makeTransform(cx, cy, rot);
    const t = 2 ** levels - 1;

    template
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line, y) =>
        line.split("").map((ch, x) => {
          this.makeBlock(...tr(mirror ? x - t : t - x, y - t), ch);
        })
      );
  }

  generateChest(maxItems = 1, initial: Item[] = []): ChestBlock {
    let items = [...initial];

    for (let i = 0; i < maxItems; i++) {
      const item = this.itemFactory.create();
      if (item) items.push(item);
    }

    return new ChestBlock(items);
  }

  generateEntity(x: number, y: number): Entity {
    const spawnedEntity = this.entityFactory.spawn(x, y);
    const generatedItem = this.itemFactory.create();
    if (generatedItem) {
      spawnedEntity.inventory.collect(generatedItem);
      if (generatedItem instanceof WearableItem)
        spawnedEntity.inventory.equip(generatedItem);
    }
    return spawnedEntity;
  }

  makeBlock(x: number, y: number, ch: string) {
    const factory =
      {
        "#": () => GenericBlock.wall,
        ".": () => GenericBlock.floor,

        D: () => new DoorBlock(0),
        C: () => this.generateChest(1, [new Key(0)]),
        d: () => new DoorBlock(1),
        c: () => this.generateChest(0, [new Key(1)]),

        x: () => {
          const entity = this.generateEntity(x, y);
          this.entities.push(entity);
          return GenericBlock.floor;
        },
      }[ch] ?? (() => GenericBlock.wall);

    this.setBlock(x, y, factory());
  }

  // Poziomy używane do generowania labiryntu
  // Wejście do poziomu jest w górnym lewym rogu, a wyjście w górnym prawym.
  static levels = [
    [],
    [
      `
        ...
        .x.
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
        .x..##.
        ...##..
      `,
    ],
    [],
  ];
}

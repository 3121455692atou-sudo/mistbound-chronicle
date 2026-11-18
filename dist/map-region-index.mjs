/** Rendering-only spatial index. Never owns, drops, regenerates or simulates world tiles. */
export class MapRegionIndex {
  constructor(records, cellSize = 512) {
    if (!Number.isFinite(cellSize) || cellSize <= 0) throw new TypeError('Invalid map region size.');
    this.records = records;
    this.cellSize = cellSize;
    this.regions = new Map();
    for (let index = 0; index < records.length; index++) {
      const record = records[index];
      if (!Number.isFinite(record.x) || !Number.isFinite(record.y)) throw new TypeError('Invalid map record position.');
      const key = `${Math.floor(record.x / cellSize)},${Math.floor(record.y / cellSize)}`;
      const region = this.regions.get(key) || [];
      region.push({ record, index });
      this.regions.set(key, region);
    }
  }

  /** The exact old open-rectangle filter, retaining its original painter order. */
  query(x, y, halfWidth, halfHeight) {
    if (![x, y, halfWidth, halfHeight].every(Number.isFinite) || halfWidth <= 0 || halfHeight <= 0) return [];
    const inside = record => Math.abs(record.x - x) < halfWidth && Math.abs(record.y - y) < halfHeight;
    const minX = Math.floor((x - halfWidth) / this.cellSize), maxX = Math.floor((x + halfWidth) / this.cellSize);
    const minY = Math.floor((y - halfHeight) / this.cellSize), maxY = Math.floor((y + halfHeight) / this.cellSize);
    // Finite camera values can still lose integer precision or overflow division.
    if (![minX, maxX, minY, maxY].every(Number.isSafeInteger)) return this.records.filter(inside);
    const cells = (maxX - minX + 1) * (maxY - minY + 1);
    // A zoomed-out or unusual large viewport must not iterate an unbounded empty grid.
    if (cells >= this.regions.size) return this.records.filter(inside);
    const regions = [];
    let candidates = 0;
    for (let row = minY; row <= maxY; row++) for (let column = minX; column <= maxX; column++) {
      const region = this.regions.get(`${column},${row}`);
      if (region) { regions.push(region); candidates += region.length; }
    }
    // Preserve the cheaper contiguous scan when the visible box spans most of the world.
    if (candidates >= this.records.length / 2) return this.records.filter(inside);
    const found = [];
    for (const region of regions) for (const entry of region) if (inside(entry.record)) found.push(entry);
    found.sort((a, b) => a.index - b.index);
    return found.map(entry => entry.record);
  }
}

/** Accumulate in existing painter order to preserve floating-point sums exactly. */
export function collectNationLands(records) {
  const lands = new Map();
  for (const record of records) {
    if (!record.visible || !record.tile.ownerId) continue;
    const land = lands.get(record.tile.ownerId) || { x: 0, y: 0, n: 0 };
    land.x += record.x; land.y += record.y - record.lift; land.n++;
    lands.set(record.tile.ownerId, land);
  }
  return lands;
}

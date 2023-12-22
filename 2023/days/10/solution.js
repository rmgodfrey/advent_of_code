import {
  compose,
  inputFetcher,
  log,
  map,
  splitOnNewLines,
  sum,
} from '/helpers.js';

const getInput = inputFetcher('/2023/days/10/input.txt');

const getStartPosition = input => {
  let rowIndex = 0;
  for (const row of input) {
    if (row.includes('S')) {
      return { row: rowIndex, col: row.indexOf('S'), shape: getShape(rowIndex, row.indexOf('S'), input) };
    }
    rowIndex++;
  }
}

const connectorsFromAbove = ['|', 'F', '7'];
const connectorsFromBelow = ['|', 'J', 'L'];
const connectorsFromLeft = ['-', 'F', 'L'];
const connectorsFromRight = ['-', '7', 'J'];

const getShape = (row, col, input) => {
  const adjacentSpots = getAdjacentSpots(row, col, input);
  if (connectorsFromAbove.includes(adjacentSpots.above) && connectorsFromRight.includes(adjacentSpots.right)) {
    return 'L';
  }
  if (connectorsFromAbove.includes(adjacentSpots.above) && connectorsFromBelow.includes(adjacentSpots.below)) {
    return '|';
  }
  if (connectorsFromAbove.includes(adjacentSpots.above) && connectorsFromLeft.includes(adjacentSpots.left)) {
    return 'J';
  }
  if (connectorsFromRight.includes(adjacentSpots.right) && connectorsFromBelow.includes(adjacentSpots.below)) {
    return 'F';
  }
  if (connectorsFromRight.includes(adjacentSpots.right) && connectorsFromLeft.includes(adjacentSpots.left)) {
    return '-';
  }
  if (connectorsFromBelow.includes(adjacentSpots.below) && connectorsFromLeft.includes(adjacentSpots.left)) {
    return '7';
  }
}

const getAdjacentSpots = (row, col, input) => {
  const height = input.length;
  const width = input[0].length;
  const spots = {};
  if (row - 1 >= 0) spots.above = input[row - 1][col];
  if (row + 1 < height) spots.below = input[row + 1][col];
  if (col - 1 >= 0) spots.left = input[row][col - 1];
  if (col + 1 < width) spots.right = input[row][col + 1];
  return spots;
}

const travel = (current, start, count, input, pathTiles, source = null) => {
  // console.log(current);
  // if (current.row === start.row && current.col === start.col && count > 0) return count;
  // const connections = getConnections(current, input);
  // for (const connectionDir of Object.keys(connections)) {
  //   if (connectionDir === source) continue;
  //   const next = (
  //     connectionDir === 'above' ? [current.row - 1, current.col] :
  //     connectionDir === 'below' ? [current.row + 1, current.col] :
  //     connectionDir === 'left' ? [current.row, current.col - 1] :
  //     connectionDir === 'right' ? [current.row, current.col + 1] : undefined
  //   );
  //   return travel(
  //     { row: next[0], col: next[1], shape: connections[connectionDir] },
  //     start,
  //     count + 1,
  //     input,
  //     { above: 'below', below: 'above', left: 'right', right: 'left' }[connectionDir],
  //   );
  // }


  while (current.row !== start.row || current.col !== start.col || count === 0) {
    const connections = getConnections(current, input);
    let next, dir;
    for (const connectionDir of Object.keys(connections)) {
      if (connectionDir === source) continue;
      next = (
        connectionDir === 'above' ? [current.row - 1, current.col] :
        connectionDir === 'below' ? [current.row + 1, current.col] :
        connectionDir === 'left' ? [current.row, current.col - 1] :
        connectionDir === 'right' ? [current.row, current.col + 1] : undefined
      );
      dir = connectionDir;
    }
    current = { row: next[0], col: next[1], shape: connections[dir] };
    count = count + 1;
    source = { above: 'below', below: 'above', left: 'right', right: 'left' }[dir];
  }
  return count;
}

const getConnections = ({ row, col, shape }, input) => {
  const adjacentSpots = getAdjacentSpots(row, col, input);
  const result = {};
  if (connectorsFromBelow.includes(shape) && connectorsFromAbove.includes(adjacentSpots.above)) {
    result.above = adjacentSpots.above;
  }
  if (connectorsFromLeft.includes(shape) && connectorsFromRight.includes(adjacentSpots.right)) {
    result.right = adjacentSpots.right;
  }
  if (connectorsFromAbove.includes(shape) && connectorsFromBelow.includes(adjacentSpots.below)) {
    result.below = adjacentSpots.below;
  }
  if (connectorsFromRight.includes(shape) && connectorsFromLeft.includes(adjacentSpots.left)) {
    result.left = adjacentSpots.left;
  }
  return result;
}

const getShapeForStartPosition = ({ input, start, pathTiles }) => {
  const result = [];
  for (const row of input) {
    result.push(row.replace('S', start.shape));
  }
  return { input: result, start, pathTiles };
}

const processInput = compose(
  splitOnNewLines,
);

const getEdgeTiles = (input) => {
  const edgeTiles = [];
  for (const [i, row] of input.entries()) {
    for (const [j, col] of Array.from(row).entries()) {
      if (i === 0 || j === 0) {
        edgeTiles.push({ row: i, col: j });
      }
    }
  }
  return edgeTiles;
}

const findOuterTiles = (startTiles, input, pathTiles) => {
  const totalTiles = startTiles.map(
    tile => ({ ...tile, shape: input[tile.row][tile.col] })
  );
  let tiles = startTiles;
  while (tiles.length) {
    let nextTiles = [];
    for (const tile of tiles) {
      const adjacentSpots = getAdjacentSpots(tile.row, tile.col, input);
      for (const dir of Object.keys(adjacentSpots)) {
        let nextTile;
        if (dir === 'above') {
          nextTile = { row: tile.row - 1, col: tile.col };
        }
        if (dir === 'below') {
          nextTile = { row: tile.row + 1, col: tile.col };
        }
        if (dir === 'left') {
          nextTile = { row: tile.row, col: tile.col - 1 };
        }
        if (dir === 'right') {
          nextTile = { row: tile.row, col: tile.col + 1 };
        }
        if (
          !pathTiles.some(tile => tile.row === nextTile.row && tile.col === nextTile.col)
          && !totalTiles.some(tile => tile.row === nextTile.row && tile.col === nextTile.col)
        ) {
          totalTiles.push({ ...nextTile, shape: input[nextTile.row][nextTile.col] });
          nextTiles.push(nextTile);
        }
      }
    }
    tiles = nextTiles;
  }
  return { outerTiles: totalTiles, pathTiles, input };
}

const travel2 = (current, start, count, input, pathTiles, source = null) => {
  while (current.row !== start.row || current.col !== start.col || count === 0) {
    pathTiles.push({ row: current.row, col: current.col });
    const connections = getConnections(current, input);
    let next, dir;
    for (const connectionDir of Object.keys(connections)) {
      if (connectionDir === source) continue;
      next = (
        connectionDir === 'above' ? [current.row - 1, current.col] :
        connectionDir === 'below' ? [current.row + 1, current.col] :
        connectionDir === 'left' ? [current.row, current.col - 1] :
        connectionDir === 'right' ? [current.row, current.col + 1] : undefined
      );
      dir = connectionDir;
    }
    current = { row: next[0], col: next[1], shape: connections[dir] };
    count = count + 1;
    source = { above: 'below', below: 'above', left: 'right', right: 'left' }[dir];
  }
  return { input, pathTiles };
}

const expandInput = ({ input, pathTiles }) => {
  const newRows = [];
  const newPathTiles = [];
  for (const [i, row] of input.entries()) {
    const rowOutput = [];
    for (const [j, col] of Array.from(row).entries()) {
      rowOutput.push(col);
      if (pathTiles.some(tile => tile.row === i && tile.col === j)) {
        newPathTiles.push({ row: i * 2, col: j * 2});
        if (col === 'F' || col === '-' || col === 'L') {
          rowOutput.push('-');
          newPathTiles.push({ row: i * 2, col: j * 2 + 1 });
        } else {
          rowOutput.push('*');
        }
      } else {
        rowOutput.push('*');
      }
    }
    newRows.push(rowOutput.join(''));
    const nextRowOutput = [];
    for (const [j, col] of Array.from(row).entries()) {
      if (pathTiles.some(tile => tile.row === i && tile.col === j)) {
        if (col === '7' || col === '|' || col === 'F') {
          nextRowOutput.push('|');
          newPathTiles.push({ row: i * 2 + 1, col: j * 2 });
        } else {
          nextRowOutput.push('*');
        }
      } else {
        nextRowOutput.push('*');
      }
      nextRowOutput.push('*');
    }
    newRows.push(nextRowOutput.join(''));
  }
  return { input: newRows, pathTiles: newPathTiles };
}

const getStarTilesNumber = (input, outerTiles) => {

  let n = 0;
  for (const [i, row] of input.entries()) {
    for (const [j, col] of Array.from(row).entries()) {
      if (col === '*' && !outerTiles.some(tile => tile.row === i && tile.col === j)) {
        n++;
      }
    }
  }
  return n;
}

const partOne = compose(
  input => ({
    input: input,
    start: getStartPosition(input),
    pathTiles: [],
  }),
  getShapeForStartPosition,
  ({ input, start }) => travel(start, start, 0, input),
  result => result / 2,
);

const partTwo = compose(
  input => ({
    input: input,
    start: getStartPosition(input),
    pathTiles: [],
  }),
  getShapeForStartPosition,
  ({ input, start, pathTiles }) => travel2(start, start, 0, input, pathTiles),
  expandInput,
  log,
  ({ input, pathTiles }) => findOuterTiles(getEdgeTiles(input), input, pathTiles),
  ({ pathTiles, outerTiles, input }) => {
    console.log(input);
    const innerTilesNumber = (
      input.length * input[0].length
      - pathTiles.length
      - outerTiles.length
      - getStarTilesNumber(input, outerTiles)
    );
    return innerTilesNumber;
  }
);

export { getInput, processInput, partOne, partTwo };

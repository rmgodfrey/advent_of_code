import {
  compose,
  inputFetcher,
  log,
  map,
  splitOnNewLines,
  sum,
} from '/helpers.js';

const getInput = inputFetcher('/2023/days/11/input.txt');

const processInput = compose(
  splitOnNewLines,
  map(line => line.split(''))
);

const expand = input => {
  input = input.map(row => [...row]);
  const presentCols = [];
  const emptyCols = [];
  const emptyRows = [];
  for (const [i, row] of input.entries()) {
    if (row.every(col => col === '.')) {
      emptyRows.push(i);
    }
    for (const [j, col] of row.entries()) {
      if (col === '#') {
        presentCols.push(j);
      }
    }
  }
  for (const i of input[0].keys()) {
    if (!presentCols.includes(i)) {
      emptyCols.push(i);
    }
  }
  for (const emptyRow of emptyRows) {
    input.splice(emptyRow, 1, Array(input[0].length).fill('*'));
  }
  for (const row of input) {
    for (const emptyCol of emptyCols) {
      row.splice(emptyCol, 1, '*');
    }
  }
  return input;
}

const getGalaxyPositions = input => {
  const positions = [];
  for (const [i, row] of input.entries()) {
    for (const [j, col] of row.entries()) {
      if (col === '#') {
        positions.push([i, j]);
      }
    }
  }
  return { input, positions };
}

const emptyAxes = (position1, position2, input) => {
  let total = 0;
  const minRow = Math.min(position1[0], position2[0]),
        maxRow = Math.max(position1[0], position2[0]),
        minCol = Math.min(position1[1], position2[1]),
        maxCol = Math.max(position1[1], position2[1]);
  for (let i = minRow + 1; i < maxRow; i++) {
    if (input[i][0] === '*') total++;
  }
  for (let i = minCol + 1; i < maxCol; i++) {
    if (input[0][i] === '*') total++;
  }
  return total;
}

const getShortestDistance = (position1, position2, multiplier, input) => {
  return (
    Math.abs(position1[0] - position2[0])
    + Math.abs(position1[1] - position2[1])
    + emptyAxes(position1, position2, input) * (multiplier - 1)
  );
}

const getTotalDistance1 = ({ positions, input }) => {
  let totalDistance = 0;
  for (const [i, position1] of positions.entries()) {
    for (const position2 of positions.slice(i + 1)) {
      totalDistance += getShortestDistance(position1, position2, 2, input);
    }
  }
  return totalDistance;
}

const getTotalDistance2 = ({ positions, input }) => {
  let totalDistance = 0;
  for (const [i, position1] of positions.entries()) {
    for (const position2 of positions.slice(i + 1)) {
      totalDistance += getShortestDistance(position1, position2, 1000000, input);
    }
  }
  return totalDistance;
}

const partOne = compose(
  expand,
  getGalaxyPositions,
  getTotalDistance1,
);

const partTwo = compose(
  expand,
  getGalaxyPositions,
  getTotalDistance2,
);

export { getInput, processInput, partOne, partTwo };

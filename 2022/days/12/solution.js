import {
  compose,
  inputFetcher,
  splitOnNewLines,
} from '/helpers.js';

const getInput = inputFetcher('/2022/days/12/input.txt');

// Input processing

const parseLine = ({ start1, start2, end }, line, rowOffset) => {
  return line.reduce(
    (state, character, colOffset) => {
      const position = { row: rowOffset, col: colOffset };
      if (character === 'S') {
        return { ...state, start1: position, line: [...state.line, 'a'] };
      } else if (character === 'E') {
        return { ...state, end: position, line: [...state.line, 'z'] };
      } else if (character === 'a') {
        return { ...state,
                 start2: [...state.start2, position],
                 line: [...state.line, character] }
      } else {
        return { ...state, line: [...state.line, character] };
      }
    },
    { start1, start2, end, line: [] },
  )
};

const parseGrid = (grid) => {
  return grid.reduce(
    (state, line, rowOffset) => {
      const { grid } = state;
      const { start1, start2, end, line: parsedLine } = parseLine(
        state, line.split(''), rowOffset
      );
      return { start1, start2, end, grid: [...grid, parsedLine] };
    },
    {
      grid: [],
      start1: null, // Starting position for part one
      start2: [],   // Possible starting positions for part two
      end: null,    // Endpoint
    }
  );
};

const processInput = compose(
  splitOnNewLines,
  parseGrid,
);

// Check if a position exists in the grid
const inBounds = ({ row, col }, grid) => {
  const width  = grid[0].length,
        height = grid.length;
  return (
    col >= 0 && col < width
             &&
    row >= 0 && row < height
  );
};

// Get positions next to a given position
const adjacentPositions = (position, grid) => {
  return [
    { row: position.row - 1, col: position.col },
    { row: position.row + 1, col: position.col },
    { row: position.row, col: position.col - 1 },
    { row: position.row, col: position.col + 1 }
  ].filter(position => inBounds(position, grid));
};

// Check if two positions are the same
const samePosition = (pos1, pos2) => {
  return pos1.row === pos2.row && pos1.col === pos2.col;
}

// Check if an array of positions includes a position
const includes = (positions, otherPosition) => {
  return positions.some(position => {
    return samePosition(position, otherPosition);
  });
};

// Checks whether it is possible to move from one position to another
// (Note: We are exploring from the end to the start, so "current" position is
// closer to end, and "next" position is closer to start)
const isLegalMove = (
  { row: currRow, col: currCol },
  { row: nextRow, col: nextCol },
  grid
) => (
  grid[currRow][currCol].charCodeAt(0)
  <= grid[nextRow][nextCol].charCodeAt(0) + 1
);

// Given a position p, find all new positions q such that q -> p is a valid move
const explore = (position, visited, grid) => {
  return adjacentPositions(position, grid)
    .filter(newPosition => (
      !includes(visited, newPosition)
      && isLegalMove(position, newPosition, grid)
    ));
};

// Given a set of positions P, find the set of positions Q that result from
// exploring each position in P
const advance = (positions, visited, grid) => {
  return positions.reduce(
    ({ positions, visited }, position) => {
      const nextPositions = explore(position, visited, grid);
      return {
        positions: [...positions, ...nextPositions],
        visited: [...visited, ...nextPositions],
      };
    },
    { positions: [], visited }
  );
};

// Given a set of positions and a termination condition, finds the fewest number
// of steps until the search terminates
const fewestSteps = ({
  positions,
  terminationCondition,
  visited,
  grid,
  steps = 0,
}) => {
  if (positions.some(terminationCondition)) {
    return steps;
  } else {
    const next = advance(positions, visited, grid);
    return fewestSteps({
      positions: next.positions,
      terminationCondition,
      visited: next.visited,
      grid,
      steps: steps + 1
    })
  }
};

// Given a set of starting points S and an endpoint E, finds the length of the
// shortest path from an element of S to E. (We start at E, and keep going until
// we reach one of S.)
const answer = (startingPoints, endPoint, grid) => fewestSteps({
  positions: [endPoint],
  terminationCondition: position => includes(startingPoints, position),
  visited: [endPoint],
  grid
});

const partOne = ({ start1, end, grid }) => answer([start1], end, grid);

const partTwo = ({ start2, end, grid }) => answer(start2, end, grid);

export { getInput, processInput, partOne, partTwo };

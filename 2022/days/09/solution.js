import {
  compose,
  inputFetcher,
  repeat,
  splitOnNewLines,
} from '/helpers.js';

const getInput = inputFetcher('/2022/days/09/input.txt');

const processInput = compose(
  splitOnNewLines,
  array => array.map(compose(
    line => line.split(' '),
    line => ({ direction: line[0], magnitude: Number(line[1]) })
  ))
);

const x = 0, y = 1;

const getRope = (length, start) => ({
  visited: [start],
  knots: Array(length).fill(start)
});

const move = (rope, instructions) => (
  repeat(instructions.magnitude, step(instructions.direction), rope)
);

const step = direction => rope => {
  const knots = updateKnots(rope.knots, direction);
  return { knots, visited: updateVisited(rope.visited, knots.at(-1)) };
}

const updateKnots = (knots, direction) => {
  const axis = 'LR'.includes(direction) ? x : y;
  const multiplier = 'UR'.includes(direction) ? 1 : -1;
  const headPosition = knots[0].map((position, i) => (
    i === axis ? position + (1 * multiplier) : position
  ));
  return knots.slice(1).reduce((prevKnots, currKnot) => {
    const position = drag(prevKnots.at(-1), currKnot);
    return [...prevKnots, position];
  }, [headPosition]);
};

const drag = (prevKnot, currKnot) => {
  const distances = [x, y].map(axis => prevKnot[axis] - currKnot[axis]);
  if (distances.every(distance => Math.abs(distance) < 2)) {
    return currKnot;
  } else {
    return currKnot.map((_, axis) => currKnot[axis] + Math.sign(distances[axis]));
  }
};

const updateVisited = (visited, position) => {
  const alreadyVisited = visited.find(prevPosition => [x, y].every(
    axis => prevPosition[axis] === position[axis]
  ));
  return alreadyVisited ? visited : visited.concat([position]);
};

const partOne = compose(
  instructions => instructions.reduce(move, getRope(2, [0, 0])),
  ({ visited }) => visited.length
);

const partTwo = compose(
  instructions => instructions.reduce(move, getRope(10, [0, 0])),
  ({ visited }) => visited.length
);

export { getInput, partOne, partTwo, processInput };

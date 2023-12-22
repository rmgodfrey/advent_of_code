import {
  compose,
  filter,
  inputFetcher,
  map,
  splitOnNewLines,
  sum,
} from '/helpers.js';

const getInput = inputFetcher('/2023/days/02/input.txt');

const thresholds = new Map([
  ['red', 12],
  ['green', 13],
  ['blue', 14],
]);
const colors = [...thresholds.keys()];

const splitGame = (game) => {
  const result = /(?<id>[^:]*): (?<cubeHandfuls>.*)/.exec(game);
  return result.groups;
};
const getId = idString => Number(idString.match(/\d+/));
const splitCubeHandfuls = cubeHandfuls => cubeHandfuls.split('; ');
const getCubeHandful = (cubeHandfulString) => {
  const amounts = cubeHandfulString.split(', ');
  const result = {};
  const handfulRegex = /(?<number>\d+) (?<color>.*)/;
  for (const amount of amounts) {
    const { number, color } = handfulRegex.exec(amount).groups;
    result[color] = Number(number);
  }
  for (const color of colors) {
    result[color] ??= 0;
  }
  return result;
};

const processInput = compose(
  splitOnNewLines,
  map(compose(
    splitGame,
    game => ({
      id: getId(game.id),
      cubeHandfuls: splitCubeHandfuls(game.cubeHandfuls).map(getCubeHandful),
    }),
  )),
);

function minimalCubeSet(cubeHandfuls) {
  return cubeHandfuls.reduce(
    (acc, curr) => ({
      red: Math.max(acc.red, curr.red),
      blue: Math.max(acc.blue, curr.blue),
      green: Math.max(acc.green, curr.green),
    }),
    { red: 0, blue: 0, green: 0 },
  );
}

function cubeSetPower(cubeSet) {
  return cubeSet.red * cubeSet.blue * cubeSet.green;
}

const partOne = compose(
  filter(game => game.cubeHandfuls.every(cubeHandful => colors.every(
    color => cubeHandful[color] <= thresholds.get(color)
  ))),
  map(game => game.id),
  sum,
);

const partTwo = compose(
  map(game => game.cubeHandfuls),
  map(minimalCubeSet),
  map(cubeSetPower),
  sum,
);

export { getInput, processInput, partOne, partTwo };

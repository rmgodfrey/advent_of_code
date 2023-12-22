import {
  compose,
  inputFetcher,
  log,
  range,
  reduce,
  splitOnNewLines,
} from '/helpers.js';

const getInput = inputFetcher('/2023/days/06/input.txt');

const parse = (input) => {
  const result = [];
  const digits = /\d+/g;
  let match;
  while (match = digits.exec(input)) {
    console.log(match[0]);
    result.push(Number(match[0]));
  }
  return result;
}

const parse2 = (input) => {
  input = input.replaceAll(' ', '');
  const result = []
  const digits = /\d+/g;
  let match;
  while (match = digits.exec(input)) {
    console.log(match[0]);
    result.push(Number(match[0]));
  }
  return result;
}

const processInput = compose(
  splitOnNewLines,
);

const waysToWin = (time, distance) => {
  const waysToTie = [
    quadraticFormula(+1, -1, time, -distance),
    quadraticFormula(-1, -1, time, -distance),
  ];
  const minimalWin = Number.isInteger(waysToTie[0]) ? waysToTie[0] + 1 : Math.ceil(waysToTie[0]);
  const maximalWin = Number.isInteger(waysToTie[1]) ? waysToTie[1] - 1 : Math.floor(waysToTie[1]);
  return maximalWin - minimalWin + 1;
}

const quadraticFormula = (sign, a, b, c) => {
  sign = Math.sign(sign);
  return (-b + sign * Math.sqrt(b*b - 4*a*c)) / (2 * a);
}

const partOne = compose(
  array => ({
    times: parse(array[0]),
    distances: parse(array[1]),
  }),
  (raceInfo) => {
    const waysToWinPerRace = [];
    for (const i of range(raceInfo.times.length)) {
      waysToWinPerRace.push(waysToWin(raceInfo.times[i], raceInfo.distances[i]));
    }
    return waysToWinPerRace;
  },
  reduce((acc, curr) => acc * curr, 1),
);

const partTwo = compose(
  array => ({
    times: parse2(array[0]),
    distances: parse2(array[1]),
  }),
  (raceInfo) => {
    const waysToWinPerRace = [];
    for (const i of range(raceInfo.times.length)) {
      waysToWinPerRace.push(waysToWin(raceInfo.times[i], raceInfo.distances[i]));
    }
    return waysToWinPerRace;
  },
  reduce((acc, curr) => acc * curr, 1),
);

export { getInput, processInput, partOne, partTwo };

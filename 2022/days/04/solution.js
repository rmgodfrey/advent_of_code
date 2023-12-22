import {
  compose,
  count,
  inputFetcher,
  map,
  splitOnNewLines,
} from '/helpers.js';

const getInput = inputFetcher('/2022/days/04/input.txt');
const processInput = compose(
  splitOnNewLines,
  map(compose(
    pair => pair.split(','),
    map(compose(
      range => range.split('-'),
      map(Number),
      range => ({ start: range[0], end: range[1] }),
    )),
  )),
);

const fullContainment = (range1, range2) => (
  range1.start >= range2.start && range1.end <= range2.end
  || range2.start >= range1.start && range2.end <= range1.end
);

const overlap = (range1, range2) => (
  range1.start >= range2.start && range1.start <= range2.end
  || range1.end >= range2.start && range1.end <= range2.end
  || range2.start >= range1.start && range2.start <= range1.end
  || range2.end >= range1.start && range2.end <= range1.end
);

const compareMembers = fn => pair => fn(pair[0], pair[1]);

const partOne = count(compareMembers(fullContainment));

const partTwo = count(compareMembers(overlap));

export { getInput, processInput, partOne, partTwo };

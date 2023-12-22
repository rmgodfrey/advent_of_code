import {
  compose,
  getMapValue,
  inputFetcher,
  map,
  splitOnNewLines,
  sum,
} from '/helpers.js';

const getInput = inputFetcher('/2023/days/01/input.txt');

const processInput = splitOnNewLines;

function getCalibrationValue(line, alternateSpellings = new Map()) {
  const digit = new RegExp([
    '\\d',
    ...alternateSpellings.keys(),
  ].join('|'), 'g');
  let firstDigit, lastDigit, match;
  while (match = digit.exec(line)?.[0]) {
    firstDigit ??= match;
    lastDigit = match;
    digit.lastIndex -= match.length - 1;
  }
  return Number(
    getMapValue(alternateSpellings, firstDigit, firstDigit)
    + getMapValue(alternateSpellings, lastDigit, lastDigit)
  );
}

const alternateSpellings = new Map([
  ['one', '1'],
  ['two', '2'],
  ['three', '3'],
  ['four', '4'],
  ['five', '5'],
  ['six', '6'],
  ['seven', '7'],
  ['eight', '8'],
  ['nine', '9'],
]);

const partOne = compose(
  map(line => getCalibrationValue(line)),
  sum,
);

const partTwo = compose(
  map(line => getCalibrationValue(line, alternateSpellings)),
  sum,
);

export { getInput, processInput, partOne, partTwo };

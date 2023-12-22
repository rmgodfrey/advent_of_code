import {
  compose,
  inputFetcher,
  map,
  range,
  reduce,
  reduceRight,
  splitOnNewLines,
  sum,
} from '/helpers.js';

const getInput = inputFetcher('/2023/days/04/input.txt');

const parse = (line) => {
  const lineRegex = (
    /^Card +\d+: (?<winningNumbers>[^|]*)\|(?<numbersIHave>.*)$/
  );
  let { winningNumbers, numbersIHave } = lineRegex.exec(line).groups;
  winningNumbers = winningNumbers.trim().split(/ +/).map(Number);
  numbersIHave = numbersIHave.trim().split(/ +/).map(Number);
  return { winningNumbers, numbersIHave };
};

const processInput = compose(
  splitOnNewLines,
  reduce(
    (acc, curr) => [...acc, parse(curr)],
    [],
  ),
  map(card => ({ numberOfMatches: getNumberOfMatches(card), ...card })),
);

function getCardScore({ numberOfMatches }) {
  return numberOfMatches ? 2 ** (numberOfMatches - 1) : 0;
}

function getNumberOfMatches({ winningNumbers, numbersIHave }) {
  let result = 0;
  for (const number of numbersIHave) {
    if (winningNumbers.includes(number)) result++;
  }
  return result;
}

function getNumberOfCopies({ numberOfMatches }, cards) {
  let numberOfCopies = numberOfMatches;
  for (const i of range(numberOfMatches)) {
    numberOfCopies += cards[i].numberOfCopies;
  }
  return numberOfCopies;
}

const partOne = compose(
  map(getCardScore),
  sum,
);

const partTwo = compose(
  reduceRight(
    (acc, curr) => [
      { numberOfCopies: getNumberOfCopies(curr, acc), ...curr },
      ...acc,
    ],
    [],
  ),
  map(card => card.numberOfCopies + 1),
  sum,
);

export { getInput, processInput, partOne, partTwo };

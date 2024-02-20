import {
  compose,
  inputFetcher,
  map,
  range,
  splitOnNewLines,
  sum,
} from '/helpers.js';

const getInput = inputFetcher('/2023/days/12/input.txt');

const processInput = compose(
  splitOnNewLines,
  map(row => {
    let [springs, groups] = row.split(' ');
    springs = Array.from(springs);
    groups = groups.split(',').map(Number);
    return { springs, groups };
  }),
);

const numberOfExpansions = 4;

function expandSprings(springs) {
  let result = [...springs];
  for (const _ of range(numberOfExpansions)) {
    result = result.concat(['?', ...springs]);
  }
  return result;
}

function expandGroups(info) {
  let result = [...info];
  for (const _ of range(numberOfExpansions)) {
    result = result.concat([...info]);
  }
  return result;
}

function getWiggleRoom(springs, groups) {
  return springs.length - sum(groups) - groups.length + 2;
}

function numberOfArrangements(springs, groups) {
  let possibleArrangements = [1];
  const wiggleRoom = getWiggleRoom(springs, groups);
  while (groups.length > 0) {
    const nextPossibleArrangements = [];
    for (const i of range(wiggleRoom)) {
      let n = 0;
      for (const [j, m] of possibleArrangements.slice(0, i + 1).entries()) {
        if (fits(i - j, springs.slice(j), groups)) n += m;
      }
      nextPossibleArrangements.push(n);
    }
    possibleArrangements = nextPossibleArrangements;
    springs = springs.slice(groups[0] + 1);
    groups = groups.slice(1);
  }
  return sum(possibleArrangements);
}

function fits(groupStart, springs, groups) {
  const groupEnd = groupStart + groups[0];
  const gapEnd = groups.length > 1 ? groupEnd + 1 : springs.length;
  return !(
    springs.slice(0, groupStart).includes('#')
    || springs.slice(groupStart, groupEnd).includes('.')
    || springs.slice(groupEnd, gapEnd).includes('#')
  );
}

const partOne = compose(
  map(({ springs, groups }) => numberOfArrangements(springs, groups)),
  sum,
);

const partTwo = compose(
  map(({ springs, groups }) => ({
    springs: expandSprings(springs),
    groups: expandGroups(groups),
  })),
  partOne,
);

export { getInput, processInput, partOne, partTwo };

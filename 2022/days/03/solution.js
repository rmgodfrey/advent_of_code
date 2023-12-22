import {
  compose,
  inputFetcher,
  splitOnNewLines,
  sum,
} from '/helpers.js';

const getInput = inputFetcher('/2022/days/03/input.txt');

const processInput = compose(
  splitOnNewLines,
  rucksacks => rucksacks.map(rucksack => Array.from(rucksack)),
);

// Divides an even-numbered array into halves
const divideIntoCompartments = (rucksack) => {
  const midwayPoint = rucksack.length / 2;
  return [rucksack.slice(0, midwayPoint), rucksack.slice(midwayPoint)];
};

// Given one or more arrays which have exactly one value in common, returns
// that value.
const getCommonValue = ([array, ...otherArrays]) => {
  return array.filter(
    value => otherArrays.every(otherArray => otherArray.includes(value))
  ).join();
};

// Converts a character to a "priority":
// - 'a' to 'z' have priorities 1 to 26;
// - 'A' to 'Z' have priorities 27 to 52.
const convertToPriority = (itemType) => {
  const upperAdjustment = 38;
  const lowerAdjustment = 96;
  const charCode = itemType.charCodeAt(0);
  return /[A-Z]/.test(itemType)
    ? charCode - upperAdjustment
    : charCode - lowerAdjustment;
};

const findSolution = compose(
  inputs => inputs.map(getCommonValue),
  values => values.map(convertToPriority),
  sum,
);

const partOne = compose(
  rucksacks => rucksacks.map(divideIntoCompartments),
  findSolution,
);

// Given an array of n values, groups them into n/3 buckets. E.g., given nine
// values V1-V9, returns three arrays, where the first contains V1-V3,
// the second contains V4-V6, and the third contains V7-V9.
const groupRucksacksByThree = (rucksacks) => {
  return rucksacks.reduce(
    ({ groups, currentGroup }, rucksack) => {
      const currentGroupNew = [...currentGroup, rucksack];
      return currentGroupNew.length === 3
        ? { groups: [...groups, currentGroupNew], currentGroup: [] }
        : { groups, currentGroup: currentGroupNew };
    },
    {
      groups: [],
      currentGroup: [],
    },
  ).groups;
};

const partTwo = compose(
  groupRucksacksByThree,
  findSolution,
);

export { getInput, processInput, partOne, partTwo };

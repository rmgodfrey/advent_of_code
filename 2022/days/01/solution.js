import {
  ascending,
  compose,
  inputFetcher,
  mapElementsToNumbers,
  splitOnNewLines,
  sum
} from '/helpers.js';

const getInput = inputFetcher('/2022/days/01/input.txt');

const processInput = compose(
  // Split the input into individual elves.
  string => string.split('\n\n'),
  // For each elf...
  array => array.map(compose(
    // ...split the input into items,
    splitOnNewLines,
    // ...treat those items as numbers,
    mapElementsToNumbers,
    // ...and sum them up.
    sum
  )),
  // Sort the elves by calories carried, from least to most.
  array => array.slice().sort(ascending)
);

const partOne = compose(
  // Find the maximum number of calories carried by an elf.
  array => array.at(-1),
  // Turn into a string, so that the answer can be displayed.
  String
);

const partTwo = compose(
  // Take the top three calorie-carrying elves.
  array => array.slice(-3),
  // Get the sum.
  sum,
  // Convert to a string.
  String
);

export { getInput, processInput, partOne, partTwo };

import {
  compose,
  inputFetcher,
  map,
  splitOnNewLines,
  sum,
} from '/helpers.js';

const getInput = inputFetcher('/2023/days/09/input.txt');

const processInput = compose(
  splitOnNewLines,
  map(history => history.split(' ').map(Number)),
);

const partOne = compose(
  map(history => [history]),
  map(differencesList => {
    let differences = differencesList.at(0);
    while (differences.some(v => v !== 0)) {
      const result = [];
      differences.forEach((difference, i) => {
        if (i === 0) return;
        result.push(differences[i] - differences[i - 1]);
      })
      differencesList.unshift(result);
      differences = result;
    }
    const nextValues = [];
    differencesList.forEach((differences, i) => {
      if (i === 0) return nextValues.push(0);
      nextValues.push(differences.at(-1) + nextValues.at(-1));
    })
    return nextValues.at(-1);
  }),
  sum,
);

const partTwo = compose(
  map(history => [history]),
  map(differencesList => {
    let differences = differencesList.at(0);
    while (differences.some(v => v !== 0)) {
      const result = [];
      differences.forEach((difference, i) => {
        if (i === 0) return;
        result.push(differences[i] - differences[i - 1]);
      })
      differencesList.unshift(result);
      differences = result;
    }
    const nextValues = [];
    differencesList.forEach((differences, i) => {
      if (i === 0) return nextValues.push(0);
      nextValues.push(differences.at(0) - nextValues.at(-1));
    })
    console.log(differencesList);
    return nextValues.at(-1);
  }),
  sum,
);

export { getInput, processInput, partOne, partTwo };

/* Input fetching */
const inputFetcher = url => () => fetch(url)
  .then(response => response.text())
  // Remove final trailing newline
  .then(input => input.trimEnd());

/* Function composition */
const compose = (...fns) => x => fns.reduce((y, f) => f(y), x);

/* Sorting functions */
const ascending = (a, b) => Number(a - b);

/* Comparisons */
const sameCoordinates = coord1 => coord2 => {
  if (coord1.length !== coord2.length) {
    throw new RangeError(
      'Coordinates must have an equal number of dimensions.'
    );
  }
  const dimensions = coord1.length;
  return range(dimensions).every(
    dimension => coord1[dimension] === coord2[dimension]
  );
};

/* Shorthands for iterative array methods */
const map =
  (...args) =>
  array =>
  array.map(...args);
const reduce =
  (...args) =>
  array =>
  array.reduce(...args);
const reduceRight =
  (...args) =>
  array =>
  array.reduceRight(...args);
const filter =
  (...args) =>
  array =>
  array.filter(...args);
const count =
  (...args) =>
  array =>
  array.filter(...args).length;

/* Apply iterative array methods from right to left */
const reverse =
  iteration =>
  array =>
  iteration(array.toReversed());

/* Mapping functions */
const flatten = array => array.flat();
const mapElementsToNumbers = array => array.map(Number);
const splitOnNewLines = string => string.split('\n');
const sum = array => (
  array.reduce((total, current) => total + current, 0)
);
const length = array => array.length;

/* Iteration */
const range = (num) => [...Array(num).keys()];
const repeat = (n, f, x) => (
  n > 0 ? repeat(n - 1, f, f(x)) : x
);

/* Debugging */
const log = input => (console.log(input), input)

/* Other helpers */
const mod = (x, y) => ((x % y) + y) % y; // true modulo
const getMapValue = (map, key, defaultValue) => (
  map.get(key) ?? defaultValue
);
const adjacentCoordinates = ([row1, col1], [row2, col2]) => {
  // Note: 'adjacent' includes diagonals
  return (
    row1 === row2 && (
      col1 + 1 === col2 || col2 + 1 === col1
    ) || (
      col1 === col2 && (
        row1 + 1 === row2 || row2 + 1 === row1
      )
    ) || (
      row1 + 1 === row2 && (
        col1 + 1 === col2 || col2 + 1 === col1
      )
    ) || (
      row2 + 1 === row1 && (
        col1 + 1 === col2 || col2 + 1 === col1
      )
    )
  );
}

export {
  adjacentCoordinates,
  ascending,
  compose,
  count,
  filter,
  flatten,
  getMapValue,
  inputFetcher,
  length,
  log,
  map,
  mapElementsToNumbers,
  mod,
  range,
  reduce,
  reduceRight,
  repeat,
  reverse,
  sameCoordinates,
  splitOnNewLines,
  sum
};

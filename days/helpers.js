/* Input fetching */
const inputFetcher = url => () => fetch(url)
  .then(response => response.text())
  // Remove final trailing newline
  .then(input => input.trimEnd());

/* Function composition */
const compose = (...fns) => x => fns.reduce((y, f) => f(y), x);

/* Sorting functions */
const ascending = (a, b) => a - b;

/* Mapping functions */
const mapElementsToNumbers = array => array.map(Number);
const splitOnNewLines = string => string.split('\n');
const sum = array => (
  array.reduce((total, current) => total + current, 0)
);

/* Iteration */
const repeat = (n, f, x) => (
  n > 0 ? repeat(n - 1, f, f(x)) : x
);

/* Other helpers */
const mod = (x, y) => ((x % y) + y) % y; // true modulo

export {
  ascending,
  compose,
  inputFetcher,
  mapElementsToNumbers,
  mod,
  repeat,
  splitOnNewLines,
  sum
};

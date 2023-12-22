import {
  compose,
  inputFetcher,
  mod,
  splitOnNewLines,
  sum
} from '/helpers.js';

const getInput = inputFetcher('/2022/days/02/input.txt');
const processInput = splitOnNewLines;

const ROCK = 1;
const PAPER = 2;
const SCISSORS = 3;

// You win when your choice is worth _one_ more than your opponent's,
// or when your choice plus three is worth _one_ more than your opponent's.
const WIN = 1;
// You lose when your choice is worth _two_ more than your opponent's,
// or when your choice plus three is worth _two_ more than your opponent's.
const LOSS = 2;
// You draw when your choice is worth _zero_ more than your opponent's.
const DRAW = 0;

const OPPONENT_SHAPES = new Map([
  ['A', ROCK], ['B', PAPER], ['C', SCISSORS]
]);
const YOUR_SHAPES = new Map([
  ['X', ROCK], ['Y', PAPER], ['Z', SCISSORS]
]);
const OUTCOMES = new Map([
  ['X', LOSS], ['Y', DRAW], ['Z', WIN]
]);
const BONUS_POINTS = new Map([
  [WIN, 6], [DRAW, 3], [LOSS, 0]
]);

// `mode` is either 'shape' or 'outcome', depending on what 'X', 'Y', and 'Z'
// represent in `code`.
const getScore = mode => code => yourShape(code, mode) + bonus(code, mode);
const decrypt = (code, dict) => {
  for (const entry of dict) {
    if (code.includes(entry[0])) return entry[1];
  }
}
const opponentShape = (code) => decrypt(code, OPPONENT_SHAPES);
const yourShape = (code, mode) => (
  mode == 'shape'   ? decrypt(code, YOUR_SHAPES) :
  mode == 'outcome' ? (opponentShape(code) + outcome(code, mode)) % 3 || 3 :
  null
);
const outcome = (code, mode) => (
  mode == 'shape'   ? mod(yourShape(code, mode) - opponentShape(code), 3) :
  mode == 'outcome' ? decrypt(code, OUTCOMES) :
  null
);
const bonus = (code, mode) => BONUS_POINTS.get(outcome(code, mode));

/* Main functions */

const partOne = compose(
  array => array.map(getScore('shape')),
  sum
);

const partTwo = compose(
  array => array.map(getScore('outcome')),
  sum
);

export { getInput, partOne, partTwo, processInput };

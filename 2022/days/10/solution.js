import {
  compose,
  inputFetcher,
  map,
  splitOnNewLines,
} from '/helpers.js';

const getInput = inputFetcher('/2022/days/10/input.txt');
const processInput = compose(
  splitOnNewLines,
  map(instruction => instruction.split(' ')),
);

const updateState = f => (state, instruction) => {
  instruction.forEach((n, i) => {
    state.cycle++;
    state.result = f(state.x, state.cycle, state.result);
    i > 0 && (state.x += Number(n));
  })
  return state;
};

const updateSignalStrength = (x, cycle, result) => result + (
  (cycle + 20) % 40 === 0 && cycle <= 220
  ? x * cycle
  : 0
);

const updateCRT = (x, cycle, result) => {
  result = result.slice();
  const horizontalPosition = (cycle - 1) % 40;
  if ([x - 1, x, x + 1].includes(horizontalPosition)) {
    result[cycle - 1] = true;
  }
  return result;
};

const drawCRT = crt => crt.reduce(
  (result, current, index) => result + (
    (current ? '#' : '.')
    + (index % 40 === 39 ? '\n' : '')
  ), ''
);

const partOne = instructions => instructions.reduce(
  updateState(updateSignalStrength), { x: 1, cycle: 0, result: 0 }
).result;

const partTwo = compose(
  instructions => instructions.reduce(
    updateState(updateCRT), { x: 1, cycle: 0, result: Array(240).fill(false) }
  ).result,
  drawCRT,
);

export { getInput, processInput, partOne, partTwo };

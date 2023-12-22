import {
  adjacentCoordinates,
  compose,
  inputFetcher,
  range,
  splitOnNewLines,
  sum,
} from '/helpers.js';

const getInput = inputFetcher('/2023/days/03/input.txt');

function findNumbers(numbers, line, lineIndex) {
  const numberPattern = /\d+/g;
  let currNumbers = [];
  let match;
  while (match = numberPattern.exec(line)) {
    currNumbers.push({
      number: Number(match[0]),
      lineIndex,
      startCol: match.index,
    });
  }
  return [...numbers, ...currNumbers];
}

function findSymbols(symbols, line, lineIndex) {
  const symbolPattern = /[^\d.]/g;
  let currSymbols = [];
  let match;
  while (match = symbolPattern.exec(line)) {
    symbols.push({
      symbol: match[0],
      lineIndex,
      col: match.index,
    });
  }
  return [...symbols, ...currSymbols];
}

const processInput = compose(
  splitOnNewLines,
  lines => lines.reduce(
    (acc, curr, i) => ({
      numbers: findNumbers(acc.numbers, curr, i),
      symbols: findSymbols(acc.symbols, curr, i),
    }),
    {
      numbers: [],
      symbols: [],
    },
  ),
);

function nextToSymbol(digitRow, digitCol, symbols) {
  return symbols.some(symbol => adjacentCoordinates(
    [digitRow, digitCol], [symbol.lineIndex, symbol.col]
  ));
}

function isPartNumber(number, symbols) {
  const numberLength = String(number.number).length;
  return range(numberLength).some(n => nextToSymbol(
    number.lineIndex, number.startCol + n, symbols
  ));
}

function findPartNumbers({ numbers, symbols }) {
  const partNumbers = [];
  for (const number of numbers) {
    if (isPartNumber(number, symbols)) {
      partNumbers.push(number.number);
    }
  }
  return partNumbers;
}

function nextToGear(number, gear) {
  const numberLength = String(number.number).length;
  return range(numberLength).some(n => adjacentCoordinates(
    [number.lineIndex, number.startCol + n], [gear.lineIndex, gear.col]
  ));
}

function findGearRatios({ numbers, symbols }) {
  const gearRatios = [];
  for (const symbol of symbols) {
    if (symbol.symbol === '*') {
      let adjacentNumbers = [];
      for (const number of numbers) {
        if (nextToGear(number, symbol)) {
          adjacentNumbers.push(number.number);
        }
      }
      if (adjacentNumbers.length === 2) {
        gearRatios.push(adjacentNumbers[0] * adjacentNumbers[1]);
      }
    }
  }
  return gearRatios;
}

const partOne = compose(
  findPartNumbers,
  sum,
);

const partTwo = compose(
  findGearRatios,
  sum,
);

export { getInput, processInput, partOne, partTwo };

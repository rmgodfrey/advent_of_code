import {
  compose,
  inputFetcher,
  log,
  map,
  range,
  reduce,
} from '/helpers.js';

const getInput = inputFetcher('/2023/days/05/input.txt');

const getSeeds = (seedInput) => {
  return seedInput.match(/seeds: (.*)/)[1].split(' ').map(Number);
};

const getMap = (mapInput) => {
  const mapInputs = mapInput.split('\n').slice(1);
  const map = [];
  for (const mapInput of mapInputs) {
    const instruction = mapInput.split(' ').map(Number);
    map.push({
      dest: instruction[0],
      source: instruction[1],
      length: instruction[2]
    });
  }
  return map;
};

const processInput = compose(
  array => array.split('\n\n'),
  array => {
    const seeds = getSeeds(array[0]);
    return { seeds, maps: array.slice(1) };
  },
  state => ({
    ...state,
    maps: state.maps.map(getMap),
  }),
);

const getLocation =
  maps =>
  seed => {
    let result = seed;
    for (const map of maps) {
      result = executeMap(map, result)
    }
    return result;
  };

const executeMap = (map, input) => {
  const instruction = map.find(instruction => (
    input >= instruction.source
    && input < instruction.source + instruction.length
  ));
  return (
    instruction
    ? input + (instruction.dest - instruction.source)
    : input
  );
}

const getSeedRanges = (seeds) => {
  const seedRanges = [];
  let i = 0;
  while (i < seeds.length) {
    seedRanges.push({ start: seeds[i], length: seeds[i + 1] });
    i += 2;
  }
  return seedRanges
}

const getRemainingSeedRanges = (originalSeedRange, resultSeedRanges) => {
  resultSeedRanges = resultSeedRanges.toSorted((a, b) => a.start - b.start);
  const remainingSeedRanges = [];
  let { start, length } = originalSeedRange;
  for (const resultSeedRange of [...resultSeedRanges, { start: start + length }]) {
    remainingSeedRanges.push({
      start,
      length: resultSeedRange.start - start,
    });
    start = resultSeedRange.start + resultSeedRange.length;
  }
  return remainingSeedRanges.filter(seedRange => seedRange.length);
};

const partOne = compose(
  ({ seeds, maps }) => seeds.map(getLocation(maps)),
  array => Math.min(...array),
);

const partTwo = compose(
  state => ({
    seedRanges: getSeedRanges(state.seeds),
    maps: state.maps,
  }),
  ({ seedRanges, maps }) => {
    let resultSeedRanges = seedRanges;
    for (const map of maps) {
      console.log(resultSeedRanges);
      let newSeedRanges = [];
      for (const seedRange of resultSeedRanges) {
        let newSeedRangesInner = [];
        for (const instruction of map) {
          const start = Math.max(seedRange.start, instruction.source);
          const end = Math.min(
            seedRange.start + seedRange.length,
            instruction.source + instruction.length,
          );
          if (start >= end) {
            continue;
          } else {
            const adjustment = instruction.dest - instruction.source;
            console.log(instruction, adjustment);
            newSeedRangesInner.push({
              start: start, length: end - start, adjustment
            });
          }
        }
        const remainingSeedRanges = getRemainingSeedRanges(seedRange, newSeedRangesInner);
        newSeedRangesInner = newSeedRangesInner.concat(remainingSeedRanges);
        newSeedRanges = newSeedRanges.concat(newSeedRangesInner);
      }
      newSeedRanges = newSeedRanges.map(seedRange => {
        if ('adjustment' in seedRange) {
          return { start: seedRange.start + seedRange.adjustment, length: seedRange.length };
        }
        return seedRange;
      });
      resultSeedRanges = newSeedRanges;
    }
    return resultSeedRanges;
  },
  reduce(
    (acc, curr) => {
      const start = curr.start;
      return start < acc ? start : acc;
    },
    Infinity,
  ),
);

export { getInput, processInput, partOne, partTwo };

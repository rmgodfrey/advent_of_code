import {
  compose,
  inputFetcher,
  map,
  range,
  splitOnNewLines,
  sum,
} from '/helpers.js';

const getInput = inputFetcher('/2023/days/07/input.txt');

const parse = input => {
  input = input.split(' ');
  const hand = input[0].split('');
  const bid = Number(input[1]);
  return { hand, bid };
}

const processInput = compose(
  splitOnNewLines,
  map(parse),
);

const compareHandStrength = (hand1, hand2) => {
  return (
    fewestDistinctLabels(hand1, hand2)
    ?? mostOfOneLabel(hand1, hand2)
    ?? tiebreak(hand1, hand2)
  );
}

const jokerfy = hand => {
  const labelCounts = jokerfiedLabelOrder
    .filter(label => label !== 'J')
    .map(label => [label, 0]);
  const labels = new Map(labelCounts);
  for (const card of hand) {
    if (card === 'J') continue;
    labels.set(card, labels.get(card) + 1);
  }
  const jokerValue = Array.from(labels.keys()).reduce(
    (acc, curr) => labels.get(curr) > labels.get(acc) ? curr : acc
  );
  const result = hand.map(card => card === 'J' ? jokerValue : card);
  return result;
}

const fewestDistinctLabelsJokerfied = (hand1, hand2) => {
  const jokerfiedHands = [jokerfy(hand1), jokerfy(hand2)];
  const winner = fewestDistinctLabels(...jokerfiedHands);
  return (
    winner === null ? null
    : winner.join() === jokerfiedHands[0].join() ? hand1
    : hand2
  );
}

const mostOfOneLabelJokerfied = (hand1, hand2) => {
  const jokerfiedHands = [jokerfy(hand1), jokerfy(hand2)];
  const winner = mostOfOneLabel(...jokerfiedHands);
  return (
    winner === null ? null
    : winner.join() === jokerfiedHands[0].join() ? hand1
    : hand2
  );
}

const compareJokerfiedHandStrength = (hand1, hand2) => {
  return (
    fewestDistinctLabelsJokerfied(hand1, hand2)
    ?? mostOfOneLabelJokerfied(hand1, hand2)
    ?? jokerfiedTiebreak(hand1, hand2)
  );
}

const labelOrder = [
  'A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'
];

const jokerfiedLabelOrder = [
  'A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'
]

const fewestDistinctLabels = (hand1, hand2) => {
  const labels = [[], []];
  const hands = [hand1, hand2]
  for (const i of range(hands.length)) {
    for (const card of hands[i]) {
      if (!labels[i].includes(card)) {
        labels[i].push(card);
      }
    }
  }
  const result = (
    labels[0].length < labels[1].length ? hand1 :
    labels[1].length < labels[0].length ? hand2 :
    null
  );
  return result;
}

const mostOfOneLabel = (hand1, hand2) => {
  const labelCounts = labelOrder.map(label => [label, 0]);
  const labels = [
    new Map(labelCounts), new Map(labelCounts)
  ];
  const highest = [0, 0]
  const hands = [hand1, hand2];
  for (const i of range(hands.length)) {
    for (const card of hands[i]) {
      labels[i].set(card, labels[i].get(card) + 1);
    }
    for (const [label, amount] of labels[i]) {
      amount > highest[i] && (highest[i] = amount);
    }
  }
  const result = (
    highest[0] > highest[1] ? hand1 :
    highest[1] > highest[0] ? hand2 :
    null
  );
  return result;
}

const tiebreak = (hand1, hand2) => {
  for (const i of range(hand1.length)) {
    if (labelOrder.indexOf(hand1[i]) < labelOrder.indexOf(hand2[i])) {
      return hand1;
    } else if (labelOrder.indexOf(hand2[i]) < labelOrder.indexOf(hand1[i])) {
      return hand2;
    }
  }
}

const jokerfiedTiebreak = (hand1, hand2) => {
  for (const i of range(hand1.length)) {
    if (jokerfiedLabelOrder.indexOf(hand1[i]) < jokerfiedLabelOrder.indexOf(hand2[i])) {
      return hand1;
    } else if (jokerfiedLabelOrder.indexOf(hand2[i]) < jokerfiedLabelOrder.indexOf(hand1[i])) {
      return hand2;
    }
  }
}

const partOne = compose(
  array => array.toSorted((a, b) => {
    switch (compareHandStrength(a.hand, b.hand)) {
      case a.hand: return 1;
      case b.hand: return -1;
      default: return 0;
    }
  }),
  map((item, i) => item.bid * (i + 1)),
  sum,
);

const partTwo = compose(
  array => array.toSorted((a, b) => {
    switch (compareJokerfiedHandStrength(a.hand, b.hand)) {
      case a.hand: return 1;
      case b.hand: return -1;
      default: return 0;
    }
  }),
  map((item, i) => item.bid * (i + 1)),
  sum,
);

export { getInput, processInput, partOne, partTwo };

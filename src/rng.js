// weighted options
const weightedOptions = [
  { item: "Common", weight: 70 },
  { item: "Rare", weight: 25 },
  { item: "Legendary", weight: 5 }
];

const totalWeight = weightedOptions.reduce((sum, opt) => sum + opt.weight, 0);

function getWeightedRandom(options, totalWeight) {
  const random = Math.random() * totalWeight;

  for (const i = 0; i < options.length; i++) {
    if (random < options[i].weight) {
      return options[i].item;
    }
    random -= options[i].weight;
  }
}

//const opt = getWeightedRandom(options, totalWeight);

// generator function to for permutations
function* generatePermutations(options, length) {
  if (length === 0) {
    yield [];
    return;
  }
  for (const option of options) {
    for (const rest of generatePermutations(options, length - 1)) {
      yield [option, ...rest];
    }
  }
}

function getRandomSequence(opts, len) {
  const n = opts.length;
  const totalPermutations = Math.pow(n, len);
  console.log('Total permutations', totalPermutations);
  // Pick a random index from the total pool
  const randomIndex = Math.floor(Math.random() * totalPermutations);
  const sequence = [];

  // Convert the index to a "Base-N" representation
  for (const i = 0; i < len; i++) {
    console.log('Random permutation index', randomIndex);
    const optionIndex = randomIndex % n;
    console.log('Option index', optionIndex);
    sequence.push(opts[optionIndex]);
    console.log('Sequence', sequence);
    randomIndex = Math.floor(randomIndex / n);
  }

  return sequence.reverse(); // Optional: maintain consistent ordering
}

// const rndSeq = getRandomSequence(settings.scaleDegrees, settings.numberOrNotes);

// const permutesGen = generatePermutations(['A', 'B', 'C', 'D'], 2);
// console.log(permutesGen.next().value);

/**
 * Generates a random sequence based on custom predicates.
 * @param {Array} options - The pool of items to choose from.
 * @param {number} length - Desired length of the sequence.
 * @param {Array<Function>} predicates - List of (history, candidate) => boolean rules.
 */
function generatePredicateSequence(options, length, predicates) {
  const sequence = [];

  for (let i = 0; i < length; i++) {
    // Create a randomized copy of options to ensure every attempt is unique
    const candidates = [...options].sort(() => Math.random() - 0.5);
    let accepted = false;

    while (candidates.length > 0) {
      const candidate = candidates.pop();

      // Check all predicates; every rule must return true
      const isValid = predicates.every(p => p(sequence, candidate));

      if (isValid) {
        sequence.push(candidate);
        accepted = true;
        break; // Move to the next position in the sequence
      }
    }

    if (!accepted) {
      console.error(`Dead end at index ${i}: No options satisfied all predicates.`);
      return sequence; // Return partial sequence or throw error
    }
  }

  return sequence;
}

export { generatePredicateSequence };

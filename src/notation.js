const notation = [
  {
    label: 'Solfège',
    names: [
      ['do'],
      ['di', 'ra'],
      ['re'],
      ['ri', 'me'],
      ['mi'],
      ['fa'],
      ['fi', 'se'],
      ['so'],
      ['si', 'le'],
      ['la'],
      ['li', 'te'],
      ['ti'],
    ],
  },
  {
    label: 'Nashville Numbers',
    names: [
      ['1'],
      ['♯1', '♭2'],
      ['2'],
      ['♯2', '♭3'],
      ['3'],
      ['4'],
      ['♯4', '♭5'],
      ['5'],
      ['♯5', '♭6'],
      ['6'],
      ['♯6', '♭7'],
      ['7'],
    ],
  },
  {
    label: 'Roman Numerals',
    names: [
      ['I'],
      ['♯I', '♭II'],
      ['II'],
      ['♯II', '♭III'],
      ['III'],
      ['IV'],
      ['♯IV', '♭V'],
      ['V'],
      ['♯V', '♭VI'],
      ['VI'],
      ['♯VI', '♭VII'],
      ['VII'],
    ],
  },
];

function validateMidiNoteRange(note) {
  if (note < 0 || note > 127) {
    throw new Error(`Value is out of range. Valid range is from 0 to 127.`);
  }
}

function validateRange(lowerBound, upperBound) {
  validateMidiNoteRange(lowerBound);
  validateMidiNoteRange(upperBound);
  if (lowerBound > upperBound) {
    throw new Error(`Lower bound cannot be greater than upper bound.`);
  }
}

function buildNoteOptions(
  lowerBound,
  upperBound,
  keyCenterOffset,
  semitoneOffsets) {
  validateRange(lowerBound, upperBound);
  const notes = [];

  for (let i = lowerBound; i <= upperBound; i += 1) {
    const offsetInKey = (i % 12 + keyCenterOffset) % 12;
    for (let n of semitoneOffsets) {
      if (offsetInKey === n) {
        notes.push({
          noteNum: i,
          chromaOffset: n
        });
      }
    }
  }

  return notes;
}

export { notation, buildNoteOptions };

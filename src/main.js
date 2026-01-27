import './style.css'
import * as Navigaion from './navigation.js'
import * as Rng from './rng.js'
import * as Audio from './audio.js'
import { buildNoteOptions } from './notation.js'

const appContainer = document.getElementById('app');

appContainer.innerHTML = `
  <div>
    <h1>
      <span id="header"></span>
    </h1>
    <div class="card">
      <nav id="mainNav"></nav>
    </div>
    <p class="read-the-docs">
      <span id="message"></span>
    </p>
    <p><button id="playBtn">Play</button></p>
  </div>
`;

Navigaion.init();
Audio.init();

const settings = {
	size: 10,
	currentIndex: 0,
	range: {
		lowerBound: 45,
		upperBound: 120,
	},
	tonicOffsetFromC: 7,
	// Do (0), Di/Ra(1), Re(2), Ri/Me(3), Mi(4), Fa(5),
	// Fi/Se(6), So(7), Si/Le(8), La(9), Li/Te(10), Ti(11)
	semitoneOffsets: [0, 2, 4, 7, 9],
	numberOrNotes: 2,
	rules: [
		// Rule 1: No two identical items can be adjacent
		(seq, next) => seq.length === 0 || seq[seq.length - 1] !== next,
		// Rule 2: 'mi-' cannot appear in the first two slots
		(seq, next) => !(seq.length < 2 && next === 'mi-'),
		// Rule 3: Total count of 'do' cannot exceed 2
		(seq, next) => next !== 'o' || seq.filter(x => x === 'do').length < 2
	],
};

const notes = buildNoteOptions(
	settings.range.lowerBound,
	settings.range.upperBound,
	settings.tonicOffsetFromC,
	settings.semitoneOffsets);

console.log(notes);

const messageEl = document.getElementById('message');
const containerEl = document.querySelector('.read-the-docs');
const btn = document.createElement('button');
btn.textContent = 'Next'
btn.id = 'next-btn';

btn.addEventListener('click', function() {
	const randomSeq = Rng.generatePredicateSequence(
		notes,
		settings.numberOrNotes,
		settings.rules);

	messageEl.innerHTML = JSON.stringify(randomSeq);
});
containerEl.prepend(btn);


import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import { initStrudel } from '@strudel/web'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Train Your Ear</h1>
    <div class="card">
  <button id="play">play</button>
  <button id="stop">stop</button>
    </div>
    <p class="read-the-docs">
  Click on the Vite logo to learn more
    </p>
  </div>
`;

initStrudel({
  prebake: () => samples('https://strudel.b-cdn.net/piano.json?strudel=1'),
});

const music = () => note("<c d e g a>*2").s('piano').play();
const stop = () => hush();
const drone = () => note("c2")
  .s("sawtooth") // Use a synthesizer waveform
  .gain(0.4)     // Set the volume
  .attack(1)     // Slow fade in (1 second)
  .decay(0.1)    // Quick decay to sustain level
  .sustain(1)    // Hold at full gain until the pattern ends or changes
  .release(1)    // Slow fade out (1 second) when the pattern stops
  .play();

//  Buttons Events
document.getElementById('play').addEventListener('click',
  drone
);

document.getElementById('stop').addEventListener('click',
  stop
);

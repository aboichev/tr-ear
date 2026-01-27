var ctx = new (window.AudioContext || window.webkitAudioContext)();
var carrier = ctx.createOscillator();
//var modulator = ctx.createOscillator();
//var modGain = ctx.createGain();
var gate = ctx.createGain();

//modulator.connect(modGain);
//modGain.connect(carrier.detune);
carrier.connect(gate);
gate.connect(ctx.destination);

var decay = 0.5;
var multiplier = 10;
var amount = 500;
var transpose = 24;

gate.gain.value = 0;
//modGain.gain.value = amount;
carrier.start(0);
//modulator.start(0);

function playNote(note, time) {
  var freq = 440 * Math.pow(1.059463, note - 69 + transpose);
  console.log('freq', freq);
  carrier.frequency.setValueAtTime(freq, time);
  //modulator.frequency.setValueAtTime(freq * multiplier, time);
  gate.gain.cancelScheduledValues(time);
  gate.gain.setTargetAtTime(2, time, 0.02);
  gate.gain.setTargetAtTime(0, time + 0.2, decay);
};

function init() {
  const playBtn = document.getElementById("playBtn");
  playBtn.addEventListener('click', function() {
    ctx.resume().then(() => {
      playNote(15, ctx.currentTime);
    });
  });
}

export { init, ctx, playNote };


let synths = {}
let loops = {}

function createSynthsAndLoop() {
  // --- KICK ---
  let kick = new Tone.MembraneSynth({
    'envelope' : {
      'sustain' : 0,
      'attack' : 0.02,
      'decay' : 0.8
    },
    'octaves' : 10
  }).toMaster();
  synths.kick = kick

  // --- SNARE ---
  let snare = new Tone.NoiseSynth({
    'volume' : -5,
    'envelope' : {
      'attack' : 0.001,
      'decay' : 0.2,
      'sustain' : 0
    },
    'filterEnvelope' : {
      'attack' : 0.001,
      'decay' : 0.1,
      'sustain' : 0
    }
  }).toMaster();
  synths.snare = snare

  let kickPart = new Tone.Loop(function(time){
    kick.triggerAttackRelease('C2', '8n', time);
  }, '2n');
  loops.kick = kickPart

  let snarePart = new Tone.Loop(function(time){
    snare.triggerAttack(time);
  }, '2n');
  loops.snare = snarePart

  Tone.Transport.start('+0.1');
}

let slidersValues = {
  fire: 0,
  earth: 0,
  air: 0,
  water: 0
}

let elementalProperties = {
  fire: {
    hot: 1,  //Distortion
    dry: 1,   //Effect (Reverb?)
    sharp: 1,  //Attack & Release
    dense: -1,  //Sounds per byte
    mobile: 1  // Randomality of steps size
  },
  water: {
    hot: -1,
    dry: -1,
    sharp: -1,
    dense: 1,
    mobile: 1
  },
  earth: {
    hot: -1,
    dry: 1,
    sharp: -1,
    dense: 1,
    mobile: -1
  },
  air: {
    hot: 1,
    dry: -1,
    sharp: -1,
    dense: -1,
    mobile: 1
  }
}

let calculatedProperties = {
  hot: 0,
  dry: 0,
  sharp: 0,
  dense: 0,
  mobile: 0
}

function sliderChange(elm) {
  let yesod = elm.parentElement.classList[1]
  slidersValues[yesod] = +elm.value
  calculateProperties()
  adjustBeat()
}

function calculateProperties() {
  for (const property in calculatedProperties) {calculatedProperties[property] = 0}
  for (const [yesod, properties] of Object.entries(elementalProperties)) {
    for (const [property, value] of Object.entries(properties)) {
      calculatedProperties[property] += (value*slidersValues[yesod])/4
    }
  }
  for (const property in calculatedProperties) {
    if (property == 'mobile') calculatedProperties[property] += 0.25
    else if (property == 'sharp') calculatedProperties[property] += 0.75
    else calculatedProperties[property] += 0.5
  }
}

let dist = {name: 'Distortion', driveBy:'hot', options: {distortion: 1, wet:0}}
let reverb = {name: 'Reverb', driveBy:'dry', options: {preDelay: 0.3, wet:0}}
let effectsDatas = [dist, reverb]
let effectsObjs = []
function adjustBeat() {
  // console.log(calculatedProperties.dry);

  // --- Synths  ---

  // --- Effects ---
  for (let i = 0; i < effectsObjs.length; i++) {
    effectsObjs[i].dispose()
  }
  effectsObjs = []

  for (let i = 0; i < effectsDatas.length; i++) {
    let effectData = effectsDatas[i]
    effectData.options.wet = calculatedProperties[effectData.driveBy]
    let effect = new Tone[effectData.name](effectData.options).toDestination();
    synths.kick.connect(effect)
    synths.snare.connect(effect)
    effectsObjs.push(effect)
  }

}

let isPlaying = false;
async function togglePlay() {
  if (isPlaying) {
    loops.kick.dispose()
    loops.snare.dispose()
  } else {
    loops.kick.start('0')
    loops.snare.start('4n')
  }
  isPlaying = !isPlaying
}

function init() {
  let sliders = document.querySelectorAll('.range-slider input')
  for (let i = 0; i < sliders.length; i++) {
    let slider = sliders[i]
    let yesod = slider.parentElement.classList[1]
    slidersValues[yesod] = +slider.value
  }
  createSynthsAndLoop()
  calculateProperties()
  adjustBeat()
}

init()

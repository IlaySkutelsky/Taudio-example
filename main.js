/*
 KICK
 */
var kick = new Tone.MembraneSynth({
	'envelope' : {
		'sustain' : 0,
		'attack' : 0.02,
		'decay' : 0.8
	},
	'octaves' : 10
}).toMaster();

var kickPart = new Tone.Loop(function(time){
	kick.triggerAttackRelease('C2', '8n', time);
}, '2n').start(0);


/*
 SNARE
 */
var snare = new Tone.NoiseSynth({
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

var snarePart = new Tone.Loop(function(time){
	snare.triggerAttack(time);
}, '2n').start('4n');

Tone.Transport.start('+0.1');

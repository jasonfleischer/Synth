var o;
var g;
var ctx;
var playing = false

var setup = false;

var oscillatorTypeIndex = 0
var oscillatorTypes = ["sine", "triangle", "sawtooth", "square"]
var tremoloNode;
var bpm = 120;
var tremoloMin = 0.7
var tremoloMax = 1.0
var tremoloVolume = 1.0;
var fade_in_seconds = 25;
var duration = 5;

var compressorNode;
var masterGainNode;
var analyserNode;
var bufferLength
var dataArray
var masterVolume = 0.3;

var notes = new Map();
var lastNote;


var harmonicsVolume = [1, 0.286699025, 0.63513, 0.042909002, 0.2522, 0.30904, 0.25045, 0.2004, 0, 0.14836, 
            0.17415, 0.07979, 0.05383, 0.07332, 0.07206, 0.08451, 0.022270261, 0.013072562, 
            0.008585879, 0.005771505, 0.004343925, 0.002141371, 0.005343231, 0.000530244, 
            0.004711017, 0.009014153]

window.onload = function() {
	init();
};

function init() {

	load_cookies()
	alert.init()

	setupOscillatorTypeSlider()
	function setupOscillatorTypeSlider() {
		var slider = $("oscillatorTypeRange");
		slider.value = oscillatorTypeIndex 
		var sliderText = $("oscillatorType");
		sliderText.innerHTML = "Oscillator: " + oscillatorTypes[oscillatorTypeIndex]
		slider.oninput = function() {
			oscillatorTypeIndex = parseInt(this.value)
			sliderText.innerHTML = "Oscillator: " + oscillatorTypes[oscillatorTypeIndex]
			setOscillatorType(oscillatorTypes[oscillatorTypeIndex])
		}
	}

	setupVolumeSlider()
	function setupVolumeSlider() {
		var slider = $("volumeRange");
		slider.value = masterVolume*1000
		var sliderText = $("volume");
		sliderText.innerHTML = "Volume: " + (masterVolume*100).toFixed() + "%"
		slider.oninput = function() {
			masterVolume = Math.max(0.00001, this.value / 1000)
			sliderText.innerHTML = "Volume: " + (masterVolume*100).toFixed() + "%"
			if (setup) {
				masterGainNode.gain.setValueAtTime(masterVolume, ctx.currentTime);

			}
		}
	}
	setupFadeSlider()
	function setupFadeSlider() {
		var slider = $("fadeRange");
		slider.value = fade_in_seconds
		var sliderText = $("fade");
		sliderText.innerHTML = "Fade: " + fade_in_seconds.toFixed(1) + "s"
		slider.oninput = function() {
			fade_in_seconds = parseFloat(this.value);
			sliderText.innerHTML = "Fade: " + fade_in_seconds.toFixed(1) + "s"
		}
	}

	setupDurationSelect()
	function setupDurationSelect() {
		var select = $("duration_select");
		select.value = duration
		var selectText = $("duration");
		selectText.innerHTML = duration == -1 ? "Duration" : "Duration: " + duration + "min"
		select.oninput = function() {
			duration = parseFloat(this.value);
			selectText.innerHTML = duration == -1 ? "Duration" : "Duration: " + duration + "min"
		}
	}
	setupBpmSlider()
	function setupBpmSlider() {
		var slider = $("bpmRange");
		slider.value = bpm
		var sliderText = $("bpm");
		sliderText.innerHTML = "BPM: " + bpm
		slider.oninput = function() {
			bpm = parseInt(this.value)
			sliderText.innerHTML = "BPM: " + bpm
		}
	}

	setupTremoloMinSlider()
	function setupTremoloMinSlider() {
		var slider = $("tremoloMinRange");
		slider.value = tremoloMin * 100
		var sliderText = $("tremoloMin");
		sliderText.innerHTML = "Min: " + tremoloMin.toFixed(2)
		slider.oninput = function() {
			var v = parseFloat(this.value) / 100
			tremoloMin = Math.min(tremoloMax, v)
			sliderText.innerHTML = "Min: " + tremoloMin.toFixed(2)
		}
	}
	setupTremoloMaxSlider()
	function setupTremoloMaxSlider() {
		var slider = $("tremoloMaxRange");
		slider.value = tremoloMax * 100
		var sliderText = $("tremoloMax");
		sliderText.innerHTML = "Max: " + tremoloMax.toFixed(2)
		slider.oninput = function() {
			var v = parseFloat(this.value) / 100
			tremoloMax = Math.max(tremoloMin, v)
			sliderText.innerHTML = "Max: " + tremoloMax.toFixed(2)
		}
	}

	setupHarmonicsTable()
	function setupHarmonicsTable() {
		var i;

		var table = $("harmonics_table");
		var innerTableHtml = ""
		for (i = 0; i < harmonicsVolume.length; i++) {
			var value = harmonicsVolume[i];
			var percentValue = value*100.0
			innerTableHtml += 	`<tr>
									<td><label id='harmonic_text_`+i+`' for='harmonic_`+i+`'>H`+i+`</label></td>
									<td><input type='range' min='0' max='100' value='`+percentValue+`' step='0.001' class='slider' id='harmonic_`+i+`'/></td>
								</tr>`;
		}
		table.innerHTML = innerTableHtml


		for (i = 0; i < harmonicsVolume.length; i++) {
			setupHarmonicSlider(i)
		}

		function setupHarmonicSlider(i) {
			var value = harmonicsVolume[i];
			var percentValue = value*100.0
			var slider = $("harmonic_"+i);
			var sliderText = $("harmonic_text_"+i);
			sliderText.innerHTML = "H" + i + ": " + percentValue.toFixed(3)
			slider.oninput = function() {
				var v = parseFloat(this.value) 
				sliderText.innerHTML = "H" + i + ": " + v.toFixed(3)
				var volume = v / 100

				harmonicsVolume[i] = volume

				for(const [frequency, note] of notes) {
					note.setHarmonicVolume(i, volume)
				}
			}
		}

	}	
}

function tapC(elem, octave, harmonic = false) { startNote(elem, 32.70320 * Math.pow(2, octave - 1), harmonic) }
function tapCsharp(elem, octave, harmonic = false) { startNote(elem, 34.64783 * Math.pow(2, octave - 1), harmonic) }
function tapD(elem, octave, harmonic = false) { startNote(elem, 36.70810 * Math.pow(2, octave - 1), harmonic) }
function tapDsharp(elem, octave, harmonic = false) { startNote(elem, 38.89087 * Math.pow(2, octave - 1), harmonic) }
function tapE(elem, octave, harmonic = false) { startNote(elem, 41.20344 * Math.pow(2, octave - 1), harmonic) }
function tapF(elem, octave, harmonic = false) { startNote(elem, 43.65353 * Math.pow(2, octave - 1), harmonic) }
function tapFsharp(elem, octave, harmonic = false) { startNote(elem, 46.24930 * Math.pow(2, octave - 1), harmonic) }
function tapG(elem, octave, harmonic = false) { startNote(elem, 48.99943 * Math.pow(2, octave - 1), harmonic) }
function tapGsharp(elem, octave, harmonic = false) { startNote(elem, 51.91309 * Math.pow(2, octave - 1), harmonic) }
function tapA(elem, octave, harmonic = false) { startNote(elem, 55.00000 * Math.pow(2, octave - 1), harmonic) }
function tapAsharp(elem, octave, harmonic = false) { startNote(elem, 58.27047 * Math.pow(2, octave - 1), harmonic) }
function tapB(elem, octave, harmonic = false) { startNote(elem, 61.73541 * Math.pow(2, octave - 1), harmonic) }

function startNote(elem, frequency, harmonic) {
	
	if (!harmonic) { // hack to play both sine and harmonic
		frequency = frequency + 0.0001
	}

	if (!setup) {

		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		ctx = new AudioContext();

		tremoloNode = ctx.createGain();
		tremoloNode.gain.value = tremoloVolume;

		masterGainNode = ctx.createGain();
		masterGainNode.gain.value = masterVolume;

		compressorNode = ctx.createDynamicsCompressor();
		compressorNode.threshold.setValueAtTime(-20, ctx.currentTime);
		compressorNode.knee.setValueAtTime(40, ctx.currentTime);
		compressorNode.ratio.setValueAtTime(12, ctx.currentTime);
		compressorNode.attack.setValueAtTime(0, ctx.currentTime);
		compressorNode.release.setValueAtTime(0.25, ctx.currentTime);


		analyserNode = ctx.createAnalyser();
		analyserNode.fftSize = 2048;
		bufferLength = analyserNode.frequencyBinCount;
		dataArray = new Uint8Array(bufferLength);
		analyserNode.getByteTimeDomainData(dataArray);

		compressorNode.connect(tremoloNode);
		tremoloNode.connect(masterGainNode);		
		masterGainNode.connect(analyserNode);
		masterGainNode.connect(ctx.destination);

		draw();

		clearTimeout(timeout);
		timeout = setTimeout(fluctuateVolume, 0);

		setup = true
		
	}

	if (notes.has(frequency)) {
		var note = notes.get(frequency);
		if(note.playing){
			note.stop()
			removeClass(elem, "selected");
			notes.delete(frequency);
			if(notes.size == 0){
				playing = false	
				stopDurationTimer()
			}
			return
		}else {
			notes.delete(frequency)
		}				
	}

	lastNote = new Note(ctx, frequency, harmonic ? harmonicsVolume : [1])



	analyserNode.fftSize = 2048;
		bufferLength = analyserNode.frequencyBinCount;
		dataArray = new Uint8Array(bufferLength);
		analyserNode.getByteTimeDomainData(dataArray);

	if(notes.size == 0){
		playing = true	
		startDurationTimer()
	}

	notes.set(frequency, lastNote);
	lastNote.play()
	
	addClass(elem, "selected")
}



var durationStartTime;
var durationTimeout;
function startDurationTimer(){
	if (duration == -1) return;
	durationStartTime = Date.now()
	durationTimerWork()
}
function durationTimerWork(){

	var timeExpired = Date.now() - durationStartTime

	var buttonText = $("stop_delay");
	var durationInMS = duration*60*1000;
	var timeRemaining = durationInMS - timeExpired


	var humanReadable = human_readable_duration(timeRemaining)
	buttonText.innerHTML = humanReadable == "" ? "Fade Out" : "Fade Out (" + human_readable_duration(timeRemaining) + ")"
	if(timeExpired > durationInMS){
		stopDurationTimer()
	}else{
		durationTimeout = setTimeout(durationTimerWork, 200);
	}
	function human_readable_duration(duration_in_MS){
		var duration_in_seconds = duration_in_MS / 1000;
		if(duration_in_seconds < 60) {
			return formattedSeconds(duration_in_seconds);
		} else if(duration_in_seconds < 60*60){
			var mins = parseInt(duration_in_seconds/60)
			var secs = duration_in_seconds - (mins*60)
			return mins + " min" +  (secs==0?"":" ") + formattedSeconds(secs)
		} else if (duration_in_seconds >= 60*60) {
			var hours = parseInt(duration_in_seconds/60/60)
			return hours + " hour"
		} else {
			//LogE("not handled human readable duration")
			return ""
		}

		function formattedSeconds(seconds){
			seconds = parseInt(seconds)
			if(seconds == 0) return ""
			else if (seconds < 10) return "0"+seconds +" s"
			else return seconds+" s"
		}
	}
}
function stopDurationTimer() {
	
	var buttonText = $("stop_delay");
	buttonText.innerHTML = "Fade Out"

	clearTimeout(durationTimeout);
	fadeStop()
}


var timeout
var fluctateDown = true
function fluctuateVolume() {

	function BPMtoMilliSeconds(BPM) { return 1000 / (BPM / 60); }
	var timeMS = BPMtoMilliSeconds(bpm) 

	if (playing) {

		if (fluctateDown) {
			setVolume(tremoloMin, timeMS / 1000);
		} else {
			setVolume(tremoloMax, timeMS / 1000);
    		clearTimeout(visualizationTimeout);
    		visualizationfrequencyInHz = 1000 / timeMS / 2
    		visualizationTimeout = setTimeout(visualizationUpdate, 0);
		}
		fluctateDown = !fluctateDown
	}
	timeout = setTimeout(fluctuateVolume, timeMS);


	function setVolume(volume, rampTime = 0) {

		var time = ctx.currentTime
		tremoloNode.gain.setValueAtTime(tremoloVolume, time);
		tremoloNode.gain.exponentialRampToValueAtTime(Math.max(0.00001, volume), time + rampTime)
		tremoloVolume = volume
	}
}

var startTime = Date.now()
var visualizationSlider = $("tremoloVisualizationRange");
var visualizationTimeout
var visualizationfrequencyInHz = 0.5
function visualizationUpdate() {
	
	if (!playing || notes.length == 0) return

	//500 = 2Hz
	//1000 = 1
	//2000 = 0.5

	var timeDiff = (Date.now() - startTime) / 1000;

	var min = tremoloMin * 100
	var max = tremoloMax * 100

	var frequencyInHz = visualizationfrequencyInHz //1000 / cycleDuration //0.5

	//log(cycleDuration + ' = ' + frequencyInHz)
	var amplitude =  (max - min) / 2
	var phase = 0
	var PI = Math.PI;

	var sliderValue = (amplitude * Math.sin(2 * PI * frequencyInHz * timeDiff + phase)) + amplitude + min;
	visualizationSlider.value = sliderValue

	visualizationTimeout = setTimeout(visualizationUpdate, 40);
}

function kofi(){
	window.open("https://ko-fi.com/jasonfleischer", "_blank");
}

function info(){
	information.showAlert()
}
function dismissInfo(){
	information.dismissAlert()
}

/*function doSoundClip() {
	var context = new AudioContext() || new webkitAudioContext(),
	request = new XMLHttpRequest();

    request.open("GET", "audio/C.wav", true);
    request.responseType = "arraybuffer";
    request.onload = function(){
        context.decodeAudioData(request.response, onDecoded);
    }
    
    function onDecoded(buffer){
        var bufferSource = context.createBufferSource();
        bufferSource.buffer = buffer;


        analyserNode = context.createAnalyser();
		analyserNode.fftSize = 2048;
		bufferLength = analyserNode.frequencyBinCount;
		dataArray = new Uint8Array(bufferLength);
		analyserNode.getByteTimeDomainData(dataArray);

		var masterGainNode = context.createGain();
		masterGainNode.gain.value = masterVolume;

		bufferSource.connect(masterGainNode)
        masterGainNode.connect(context.destination);

        bufferSource.connect(analyserNode);
        bufferSource.start();

        playing = true;
        draw();
    }
    
    request.send();
}*/

var waveTablePlaying = false
var osc;
/*function doWaveTable() {

	
	if (waveTablePlaying) {
		osc.stop();
		playing = false
	}else {
		log(harmonicsVolume)
		let size = harmonicsVolume.length + 1
		var real = new Float32Array(size);
		var imag = new Float32Array(size);
		var ac = new AudioContext();
		osc = ac.createOscillator();
		osc.frequency.value = 220;
		imag[0] = 1; // for fundamental
		real[0] = 0; // for fundamental
		var i;
		for (i = 1; i < harmonicsVolume.length + 1; i++) {
			imag[i] = harmonicsVolume[i-1];
			real[i] = 0;
		}

		var wave = ac.createPeriodicWave(real, imag);

		osc.setPeriodicWave(wave);


		analyserNode = ac.createAnalyser();
		analyserNode.fftSize = 2048;
		bufferLength = analyserNode.frequencyBinCount;
		dataArray = new Uint8Array(bufferLength);
		analyserNode.getByteTimeDomainData(dataArray);


		var masterGainNode = ac.createGain();
		masterGainNode.gain.value = masterVolume;

		osc.connect(masterGainNode);
		masterGainNode.connect(analyserNode);
		masterGainNode.connect(ac.destination);

		osc.start();
		playing = true

		draw()
	}
	waveTablePlaying = !waveTablePlaying;
}*/

function setOscillatorType(type){
	for(const [frequency, note] of notes) {
		note.setOscillatorType(type)
	}
}

function fadeStop() {
	stop(fade_in_seconds)
}

function stop(delayTime=0.5) {

	if (!playing) return

	playing = false;
	stopDurationTimer()
	

	for(const [frequency, note] of notes) {
		note.stop(delayTime)
	}
	notes.clear()

	clearbuttonUI()
	function clearbuttonUI() {
		var buttons = document.getElementsByTagName('button');
		for (let i = 0; i < buttons.length; i++) {
		    let button = buttons[i];
		    removeClass(button, "selected");
		}
	}			
}


function log(msg) { console.log(msg) }

function hasClass(ele,cls) {
  return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}
function addClass(ele,cls) {
  if (!hasClass(ele,cls)) ele.className += " "+cls;
}
function removeClass(ele,cls) {
  if (hasClass(ele,cls)) {
    var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
    ele.className=ele.className.replace(reg,' ');
  }
}

var canvas = $("oscilloscope");
var canvasCtx = canvas.getContext("2d");
var drawing = true

function draw() {

	requestAnimationFrame(draw);


	if(drawing) {

		analyserNode.getByteTimeDomainData(dataArray);

		canvasCtx.fillStyle = "#000";
		canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

		canvasCtx.lineWidth = 2;
		canvasCtx.strokeStyle = "#fff";

		canvasCtx.beginPath();

		var sliceWidth = canvas.width * 1.0 / bufferLength;
		var x = 0;

		for (var i = 0; i < bufferLength; i++) {

			var v = dataArray[i] / 128.0;
			var y = v * canvas.height / 2;

			if (i === 0) {
				canvasCtx.moveTo(x, y);
			} else {
				canvasCtx.lineTo(x, y);
			}

			x += sliceWidth;
		}

		canvasCtx.lineTo(canvas.width, canvas.height / 2);
		canvasCtx.stroke();
	}
}

function toggleDrawing(elem){
	drawing = !drawing
	if (drawing) {
		removeClass(elem, "selected");
	} else {
		addClass(elem, "selected");
	}
}



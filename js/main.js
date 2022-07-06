const log = require("@jasonfleischer/log");
const pianoKit = require("@jasonfleischer/piano");
const musicKit = require("@jasonfleischer/music-model-kit");
musicKit.init();

var pianoView = buildPianoView();
var oscilloscope = new Oscilloscope();

init = function() {

	alert.init();
	
	window_resized_end();
	setup_keyboard_listeners();
	setup_controls();
	$("P"+storage.get_preset_index()).click();

	var isSafariMobile = window.mobileAndTabletCheck() && isSafari;
	if (isSafariMobile && !isFromHomeScreen()){
		install.showAlert();
	}
}

function buildPianoView(range = { min: 48, max: 60 }, width = 340){
	return pianoKit({
		id: 'piano',
		range: range,
		width: width,
		onClick: function(note, isOn) {
			if(isOn) {
				noteOn(note);
			} else {
				noteOff(note);
			}
		},
		hover: true
	});
}

// add a midi listener
new musicKit.MidiListener(
	function (midiValue, channel, velocity) {
		let note = musicKit.all_notes[midiValue];
		noteOn(note);
	},
	function (midiValue, channel, velocity) {
		let note = musicKit.all_notes[midiValue];
		noteOff(note);
	}
);

function noteOn(note){
	let color = note.note_name.is_sharp_or_flat ? "#777": "#aaa";
	audio_controller.startStopNote(note.frequency);
	pianoView.drawNoteWithColor(note, color);
	
}
function noteOff(note){
	audio_controller.startStopNote(note.frequency);
	pianoView.clearNote(note);
}

var durationStartTime;
var durationTimeout;
function startDurationTimer(){
	if (storage.get_duration() == -1) return;
	durationStartTime = Date.now();
	durationTimerWork();
}
function durationTimerWork(){

	var timeExpired = Date.now() - durationStartTime;

	var buttonText = $("stop_delay");
	var durationInMS = storage.get_duration()*60*1000;
	var timeRemaining = durationInMS - timeExpired;


	var humanReadable = human_readable_duration(timeRemaining);
	buttonText.innerHTML = humanReadable == "" ? "Fade Out" : "Fade Out (" + human_readable_duration(timeRemaining) + ")";
	if(timeExpired > durationInMS){
		stopDurationTimer();
	}else{
		durationTimeout = setTimeout(durationTimerWork, 200);
	}
	function human_readable_duration(duration_in_MS){
		var duration_in_seconds = duration_in_MS / 1000;
		if(duration_in_seconds < 60) {
			return formattedSeconds(duration_in_seconds);
		} else if(duration_in_seconds < 60*60){
			var mins = parseInt(duration_in_seconds/60);
			var secs = duration_in_seconds - (mins*60);
			return mins + " min" +  (secs==0?"":" ") + formattedSeconds(secs);
		} else if (duration_in_seconds >= 60*60) {
			var hours = parseInt(duration_in_seconds/60/60);
			return hours + " hour";
		} else {
			log.e("not handled human readable duration")
			return ""
		}

		function formattedSeconds(seconds){
			seconds = parseInt(seconds);
			if(seconds == 0) return "";
			else if (seconds < 10) return "0"+seconds +" s";
			else return seconds+" s";
		}
	}
}
function stopDurationTimer() {
	
	var buttonText = $("stop_delay");
	buttonText.innerHTML = "Fade Out";
	clearTimeout(durationTimeout);
	audio_controller.fadeStop();
}

var timeout;
var fluctateDown = true;
function fluctuateVolume() {

	function BPMtoMilliSeconds(BPM) { return 1000 / (BPM / 60); }
	var timeMS = BPMtoMilliSeconds(storage.get_bpm());

	if (audio_controller.playing) {

		if (fluctateDown) {
			audio_controller.setTremoloVolume(storage.get_tremolo_min(), timeMS / 1000);
		} else {
			audio_controller.setTremoloVolume(storage.get_tremolo_max(), timeMS / 1000);
    		clearTimeout(visualizationTimeout);
    		visualizationfrequencyInHz = 1000 / timeMS / 2;
    		visualizationTimeout = setTimeout(visualizationUpdate, 0);
		}
		fluctateDown = !fluctateDown;
	}
	timeout = setTimeout(fluctuateVolume, timeMS);
}

var startTime = Date.now();
var visualizationSlider = $("tremoloVisualizationRange");
var visualizationTimeout;
var visualizationfrequencyInHz = 0.5;
function visualizationUpdate() {
	
	if (!audio_controller.playing || audio_controller.notes.length == 0) return;

	var timeDiff = (Date.now() - startTime) / 1000;

	var min = storage.get_tremolo_min() * 100;
	var max = storage.get_tremolo_max() * 100;

	var frequencyInHz = visualizationfrequencyInHz;

	var amplitude =  (max - min) / 2;
	var phase = 0;
	var PI = Math.PI;

	var sliderValue = (amplitude * Math.sin(2 * PI * frequencyInHz * timeDiff + phase)) + amplitude + min;
	visualizationSlider.value = sliderValue;

	visualizationTimeout = setTimeout(visualizationUpdate, 40);
}

updatePresetButtonsUI = function() {
	var index = storage.get_preset_index();
	var i;
	for (i = 1; i <= 6; i++) {
		let elem = $('P'+i);
		if (i == index){
			addClass(elem, 'selected');
		} else{
			removeClass(elem, 'selected');
		}	
	}
}

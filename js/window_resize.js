var window_resize_start_event_occured = false;
var resized_timer;
window.onresize = function(){
	clearTimeout(resized_timer);
	resized_timer = setTimeout(window_resized_end, 200);
	if(!window_resize_start_event_occured) {
		window_resized_start();
		window_resize_start_event_occured = true;
	}
};

function window_resized_start(){
	dismissInfo();	
}

function window_resized_end(){

	window_resize_start_event_occured = false;

	var isOneOctave = window.innerWidth < 1070;

	audio_controller.stop();
	pianoView.removeCanvases();
	pianoView.removeOnClick();
	pianoView = buildPianoView({min:48, max: isOneOctave ? 60: 72}, isOneOctave ? 340 : 680);
}

function setup_keyboard_listeners() {

	document.addEventListener('keyup', function(event){

		//log.i(event.code)
		var code = event.code;
		if (code === 'Space') {
			var play_button = is_compact_window() ? $("mobile_play_pause_button"): $('play_pause_button');
			if(document.activeElement !== play_button) { // prevents double call with focus on play
				playPause();
				play_button.focus();
			}
		}
	}
}
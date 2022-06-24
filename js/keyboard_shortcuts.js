
function setup_keyboard_listeners() {

	document.addEventListener('keyup', function(event){

		//log.i(event.code)
		var code = event.code;
		if (code === 'Space') {
			fadeStop();
		}
	});
}
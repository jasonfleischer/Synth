
function setup_keyboard_listeners() {

	window.onkeydown = function(e) {
		log.i(e.keyCode)
    	return e.keyCode !== 32;
	};

	document.addEventListener('keydown', function(event){

		log.i(event.code)
		var code = event.code;
		if (code === 'Space') {
			fadeStop();
		} else {
			event.preventDefault();
		}
	});
	/*document.addEventListener('keyup', function(event){

		log.i(event.code)
		var code = event.code;
		if (code === 'Space') {
			fadeStop();
		} else {
			event.preventDefault();
		}
	});*/

	//$('stop').focus();
}

function setup_keyboard_listeners() {

	window.onkeydown = function(e) {
		log.i(e.keyCode)
    	return ev.keyCode !== 32 && ev.key !== " ";
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
	document.addEventListener('keyup', function(event){

		log.i(event.code)
		var code = event.code;
		if (code === 'Space') {
			fadeStop();
		} else {
			event.preventDefault();
		}
	});

	//$('stop').focus();
}
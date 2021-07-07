function load_cookies(){
	model.master_volume_percent = cookies.get_volume(30);
}

var cookies = {};

cookies.VOLUME_KEY = "VOLUME_KEY";
cookies.get_volume = function(default_value){
	var value = cookies.getCookie(cookies.VOLUME_KEY, default_value);
	return value;
};
cookies.set_volume = function(value){
	document.cookie = cookies.VOLUME_KEY + "=" + value;
};

cookies.setCookie = function(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};
cookies.getCookie = function(cname, default_value) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return default_value;
};
cookies.deleteCookie = function(cname) {
    var d = new Date(); //Create an date object
    d.setTime(d.getTime() - (1000 * 60 * 60 * 24)); //Set the time to the past. 1000 milliseonds = 1 second
    var expires = "expires=" + d.toGMTString(); //Compose the expirartion date
    window.document.cookie = cname + "=" + "; " + expires;//Set the cookie with name and the expiration date
};
storage = {};

storage.load = function(){
	model.master_volume_percent = storage.get_volume(30);
};

storage.VOLUME_KEY = "SYNTH_VOLUME_KEY";
storage.get_volume = function(default_value){
	return storage.get(storage.VOLUME_KEY, default_value);
};
storage.set_volume = function(value){
	localStorage.setItem(storage.VOLUME_KEY, value);
};

storage.get = function(key, default_value) {
	let result = localStorage.getItem(key);
	return (result == undefined) ? default_value : result;
};

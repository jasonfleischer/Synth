storage = {};

storage.VOLUME_KEY = "SYNTH_VOLUME_KEY";
storage.get_volume = function(default_value=0.30){
	return Number(storage.get(storage.VOLUME_KEY, default_value));
};
storage.set_volume = function(value){
	localStorage.setItem(storage.VOLUME_KEY, value);
};

storage.BPM_KEY = "SYNTH_BPM_KEY";
storage.get_bpm = function(default_value=120){
	return Number(storage.get(storage.BPM_KEY, default_value));
};
storage.set_bpm = function(value){
	localStorage.setItem(storage.BPM_KEY, value);
};

storage.TREMOLO_MIN_KEY = "SYNTH_TREMOLO_MIN_KEY";
storage.get_tremolo_min = function(default_value=0.7){
	return Number(storage.get(storage.TREMOLO_MIN_KEY, default_value));
};
storage.set_tremolo_min = function(value){
	localStorage.setItem(storage.TREMOLO_MIN_KEY, value);
};

storage.TREMOLO_MAX_KEY = "SYNTH_TREMOLO_MAX_KEY";
storage.get_tremolo_max = function(default_value=1.0){
	return Number(storage.get(storage.TREMOLO_MAX_KEY, default_value));
};
storage.set_tremolo_max = function(value){
	localStorage.setItem(storage.TREMOLO_MAX_KEY, value);
};

storage.FADE_IN_SECONDS_KEY = "SYNTH_FADE_IN_SECONDS_KEY";
storage.get_fade_in_seconds = function(default_value=25){
	return Number(storage.get(storage.FADE_IN_SECONDS_KEY, default_value));
};
storage.set_fade_in_seconds = function(value){
	localStorage.setItem(storage.FADE_IN_SECONDS_KEY, value);
};

storage.DURATION_KEY = "SYNTH_DURATION_KEY";
storage.get_duration = function(default_value=5){
	return Number(storage.get(storage.DURATION_KEY, default_value));
};
storage.set_duration = function(value){
	localStorage.setItem(storage.DURATION_KEY, value);
};

storage.OSCILLATOR_TYPE_INDEX_KEY = "SYNTH_OSCILLATOR_TYPE_INDEX_KEY";
storage.get_oscillator_type_index = function(default_value=0){
	return Number(storage.get(storage.OSCILLATOR_TYPE_INDEX_KEY, default_value));
};
storage.set_oscillator_type_index = function(value){
	localStorage.setItem(storage.OSCILLATOR_TYPE_INDEX_KEY, value);
};

storage.PRESET_INDEX_KEY = "SYNTH_PRESET_INDEX_KEY";
storage.get_preset_index = function(default_value=6){
	return Number(storage.get(storage.PRESET_INDEX_KEY, default_value));
};
storage.set_preset_index = function(value){
	localStorage.setItem(storage.PRESET_INDEX_KEY, value);
};

storage.get = function(key, default_value) {
	let result = localStorage.getItem(key);
	return (result == undefined) ? default_value : result;
};

storage.ROOT_NOTE = "SYNTH_ROOT_NOTE";
storage.get_root_note = function(default_value=60){
	return storage.get(storage.ROOT_NOTE, default_value);
};
storage.set_root_note = function(value){
	localStorage.setItem(storage.ROOT_NOTE, value);
};

storage.IS_JUST_INTONATION = "SYNTH_IS_JUST_INTONATION";
storage.is_just_intonation = function(default_value = false){
	var value = storage.get(storage.IS_JUST_INTONATION, default_value);
	return Boolean(value === "true" || value === true);
};
storage.set_is_just_intonation = function(value){
	localStorage.setItem(storage.IS_JUST_INTONATION, value);
};

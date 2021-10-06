class Note {

	constructor(audioContext, fundamentalFrequency, harmonicsVolumePercents) {
		this.id = fundamentalFrequency;
		this.audioContext = audioContext;
		this.oscillators = [];
		this.harmonicsVolumePercents = harmonicsVolumePercents;
		this.playing = false;
		var i;
		for (i = 0; i < harmonicsVolumePercents.length; i++) {
			var volumePercent = Math.min(Math.max(harmonicsVolumePercents[i], 0), 1);
			this.oscillators.push(new Oscillator(audioContext, fundamentalFrequency*(i+1), volumePercent, model.oscillatorTypes[model.oscillatorTypeIndex]));
		}
	}

	play() {
		var i;
		for (i = 0; i < this.oscillators.length; i++) {
			this.oscillators[i].play();
		}
		this.playing = true;
	}

	stop(delayTime=0.5) {
		var i;
		for (i = 0; i < this.oscillators.length; i++) {
			this.oscillators[i].stop(delayTime);
		}
		this.playing = false;
	}

	setHarmonicVolume(index, volume, ramp = false, rampTime = 0){
		this.harmonicsVolumePercents[index] = volume;
		if (index < this.oscillators.length)
			this.oscillators[index].setVolume(volume, ramp, rampTime); 
	}

	setOscillatorType(type) {
		var i;
		for (i = 0; i < this.oscillators.length; i++) {
			this.oscillators[i].setOscillatorType(type); 
		}
	}
}

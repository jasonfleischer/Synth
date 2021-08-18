Oscillator = class Oscillator {

	constructor(audioContext, frequency, volume, type) {
		this.audioContext = audioContext;
		this.oscillator = this.audioContext.createOscillator();
		this.oscillator.type = type;
		this.oscillator.frequency.value = frequency;

		this.gainNode = this.audioContext.createGain();
		this.gainNode.gain.value = 0;
		this.oscillator.connect(this.gainNode);
		this.gainNode.connect(compressorNode);
		
		this.playing = false;
		this.volume = volume;
	}
	
	play() {
		if (!this.playing) {
			var time = this.audioContext.currentTime;
			this.oscillator.start(time);
			this.gainNode.gain.setValueAtTime(0.00001, time);
			this.gainNode.gain.exponentialRampToValueAtTime(Math.max(0.00001, this.volume), time + 0.1);
			this.playing = true;
		}
	}

	stop(delayTime) {
		if (this.playing) {
			var time = this.audioContext.currentTime;
			this.playing = false;
			this.gainNode.gain.setValueAtTime(this.volume, time);
			this.gainNode.gain.exponentialRampToValueAtTime(0.00001, time + delayTime);
			this.oscillator.stop(time + delayTime + 0.1);
		}
	}

	setVolume(volume, ramp, rampTime = 0) {
		if (this.playing) {
			var time = this.audioContext.currentTime;
			if (ramp) {
				this.gainNode.gain.setValueAtTime(this.volume, time);
				this.gainNode.gain.exponentialRampToValueAtTime(volume, time + rampTime);
				this.volume = volume;
			} else {
				this.gainNode.gain.setValueAtTime(volume, time);
			}
		}
	}

	setOscillatorType(type) {
		this.oscillator.type = type;
	}
}

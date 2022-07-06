audio_controller = {
    playing: false,
    setup: false,
    ctx: {},
    masterGainNode: {},
    compressorNode: {},
    tremoloNode: {},
    analyserNode: {},
    notes: new Map(),
    lastPlayedNotes: new Map(),
    lastNote: {},
    harmonicsVolume : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}

audio_controller.startStopNote = function(frequency, masterVolume = storage.get_volume(),
                                             oscillatorIndex = storage.get_oscillator_type_index()) {

    if (!this.setup) {

        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        //this.notes = new Map();
        //this.lastPlayedNotes = new Map();

        this.tremoloNode = this.ctx.createGain();
        this.tremoloNode.gain.value = 1.0;

        this.masterGainNode = this.ctx.createGain();
        this.masterGainNode.gain.value = masterVolume;

        this.compressorNode = this.ctx.createDynamicsCompressor();
        this.compressorNode.threshold.setValueAtTime(-20, this.ctx.currentTime);
        this.compressorNode.knee.setValueAtTime(40, this.ctx.currentTime);
        this.compressorNode.ratio.setValueAtTime(12, this.ctx.currentTime);
        this.compressorNode.attack.setValueAtTime(0, this.ctx.currentTime);
        this.compressorNode.release.setValueAtTime(0.25, this.ctx.currentTime);


        this.analyserNode = this.ctx.createAnalyser();
        this.analyserNode.fftSize = 2048;
        var bufferLength = this.analyserNode.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);
        this.analyserNode.getByteTimeDomainData(dataArray);

        this.compressorNode.connect(this.tremoloNode);
        this.tremoloNode.connect(this.masterGainNode);        
        this.masterGainNode.connect(this.analyserNode);
        this.masterGainNode.connect(this.ctx.destination);

        oscilloscope.draw(this.analyserNode);

        clearTimeout(timeout);
        timeout = setTimeout(fluctuateVolume, 0);

        this.setup = true;
    }

    if (this.notes.has(frequency)) {
        var note = this.notes.get(frequency);
        if (note.playing){
            note.stop();
            this.notes.delete(frequency);
            if(this.notes.size == 0){
                this.playing = false ;
                stopDurationTimer();
            }
            return;
        } else {
            this.notes.delete(frequency);
        }               
    }

    this.lastNote = new Note(this.ctx, frequency, this.harmonicsVolume, this.getOscillatorTypeString(oscillatorIndex));
    this.lastNote.connect(this.compressorNode);

    if(this.notes.size == 0){
        this.playing = true;
        startDurationTimer();
    }

    this.notes.set(frequency, this.lastNote);
    this.lastNote.play();
}

audio_controller.playStopClick = function() {
    if(this.notes.size > 0) {
        this.stop();
    } else if(this.lastPlayedNotes.size > 0){
        this.playStop();
    }
}

audio_controller.playStop = function() {

    if (this.playing) {
        this.stop();
    } else {

        for(const [frequency, note] of this.lastPlayedNotes) {

            function findNoteWithFrequency(frequency){
                var i;
                for(i=0; i< musicKit.all_notes.length; i++){
                    var note = musicKit.all_notes[i];
                    if(note.frequency == frequency){
                        return note;
                    }
                }
                log.e("note not found");
            }
            var foundNote = findNoteWithFrequency(frequency);

            let color = foundNote.note_name.is_sharp_or_flat ? "#777": "#aaa";
            this.startStopNote(frequency);
            pianoView.drawNoteWithColor(foundNote, color);
        }
    }
}

audio_controller.fadeStop = function() {
    this.stop(storage.get_fade_in_seconds());
}

audio_controller.stop = function(delayTime=0.5) {

    if (!this.playing) return;

    this.lastPlayedNotes = new Map(this.notes);

    this.playing = false;
    stopDurationTimer();
    
    for(const [frequency, note] of this.notes) {
        note.stop(delayTime);
    }
    this.notes.clear();
    pianoView.clear();      
}

audio_controller.setMasterVolume = function(volume) {
    if (this.setup) {
        this.masterGainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    }
}

audio_controller.setTremoloVolume = function(volume, rampTime = 0) {

    var time = this.ctx.currentTime;
    this.tremoloNode.gain.setValueAtTime(this.tremoloNode.gain.value, time);
    this.tremoloNode.gain.exponentialRampToValueAtTime(Math.max(0.00001, volume), time + rampTime);
}

audio_controller.setHarmonicVolume = function(index, volume) {
    this.harmonicsVolume[index] = volume;
    for(const [frequency, note] of this.notes) {
        note.setHarmonicVolume(index, volume);
    }
}

audio_controller.setOscillatorType = function(index){
    if (this.setup) {
        var type = this.getOscillatorTypeString(index)
        for(const [frequency, note] of this.notes) {
            note.setOscillatorType(type);
        }
    }
}

audio_controller.getOscillatorTypeString = function(index){
    const oscillatorTypes = ["sine", "triangle", "sawtooth", "square"];
    return oscillatorTypes[index];
}



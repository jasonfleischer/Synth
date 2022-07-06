function setup_controls(){

	setup_onclicks();
	function setup_onclicks(){

		$("page_name").onclick = function() { info(); };
		$("kofi_button").onclick = function() { kofi(); };
		$("info_button").onclick = function() { info(); };
		$("stop_delay").onclick = function() { audio_controller.fadeStop(); }
		$("play_stop").onclick = function(){ audio_controller.playStopClick(); }

		setupPresetOnClicks();
		function setupPresetOnClicks(){

			$("P1").onclick = function() {
				setHarmonicVolume([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
				updatePresetButtonsUI(1);
			}
			$("P2").onclick = function() {
				var volumeAry = [];
				volumeAry[0] = 1;
				for (i = 1; i < harmonicsVolume.length; i++) {
					volumeAry[i] = volumeAry[i-1]/2;
				}
				setHarmonicVolume(volumeAry);
				updatePresetButtonsUI(2);
			}
			$("P3").onclick = function() {
				var volumeAry = [];
				var numberOfHarmonicsToSet = 7;
				for (i = 0; i < harmonicsVolume.length; i++) {
					volumeAry[i] =  Math.max(0, 1 - (i/(numberOfHarmonicsToSet-1)));
				}
				setHarmonicVolume(volumeAry);
				updatePresetButtonsUI(3);
			}
			$("P4").onclick = function() {
				var volumeAry = [];
				var numberOfHarmonicsToSet = 5;
				for (i = 0; i < harmonicsVolume.length; i++) {
					if (i%2 == 0) {
						volumeAry[i] =  Math.max(0, 1 - (i/(numberOfHarmonicsToSet*2-1)));
					} else {
						volumeAry[i] = 0;
					}
				}
				setHarmonicVolume(volumeAry);
				updatePresetButtonsUI(4);
			}
			$("P5").onclick = function() {
				var volumeAry = [];
				var numberOfHarmonicsToSet = 5;
				for (i = 0; i < harmonicsVolume.length; i++) {
					volumeAry[i] =  (100/(2+i-1))/100;
				}
				setHarmonicVolume(volumeAry);
				updatePresetButtonsUI(5);
			}
			$("P6").onclick = function() {
				setHarmonicVolume([1, 0.286699025, 0.63513, 0.042909002, 0.2522, 0.30904, 0.25045, 0.2004, 0, 0.14836, 
			            0.17415, 0.07979, 0.05383, 0.07332, 0.07206, 0.08451, 0.022270261, 0.013072562, 
			            0.008585879, 0.005771505, 0.004343925, 0.002141371, 0.005343231, 0.000530244, 
			            0.004711017, 0.009014153]);
				updatePresetButtonsUI(6);
			}
			setHarmonicVolume = function(volumeAry) {
				for (i = 0; i < volumeAry.length; i++) {
					var volume = volumeAry[i];
					harmonicsVolume[i] = volume;
					audio_controller.setHarmonicVolume(i, volume);
					$("harmonic_text_" + i).innerHTML = "H"+i+": "+(volume*100).toFixed(3);
					$("harmonic_" + i).value = volume*100;
				}
			}
		}
	}

	setupSelectControls();
	function setupSelectControls(){
		setupDurationSelect();
		function setupDurationSelect() {
			var select = $("duration_select");
			select.value = duration;
			var selectText = $("duration");
			selectText.innerHTML = duration == -1 ? "Duration" : "Duration: " + duration + "min";
			select.oninput = function() {
				duration = parseFloat(this.value);
				selectText.innerHTML = duration == -1 ? "Duration" : "Duration: " + duration + "min";
			}
		}
	}

	setupSliderControls();
	function setupSliderControls(){

		setupOscillatorTypeSlider();
		function setupOscillatorTypeSlider() {
			var slider = $("oscillatorTypeRange");
			slider.value = model.oscillatorTypeIndex;
			var sliderText = $("oscillatorType");
			sliderText.innerHTML = "Oscillator: " + model.oscillatorTypes[model.oscillatorTypeIndex];
			slider.oninput = function() {
				model.oscillatorTypeIndex = parseInt(this.value);
				sliderText.innerHTML = "Oscillator: " + model.oscillatorTypes[model.oscillatorTypeIndex];
				audio_controller.setOscillatorType(model.oscillatorTypes[model.oscillatorTypeIndex]);
			}
		}

		setupVolumeSlider();
		function setupVolumeSlider() {
			var slider = $("volumeRange");
			var volume = storage.get_volume();
			slider.value = volume*1000;
			var sliderText = $("volume");
			sliderText.innerHTML = "Volume: " + (volume*100).toFixed() + "%";
			slider.oninput = function() {
				var masterVolume = Math.max(0.00001, this.value / 1000);
				storage.set_volume(masterVolume);
				sliderText.innerHTML = "Volume: " + (masterVolume*100).toFixed() + "%";
				audio_controller.setMasterVolume(masterVolume);
			}
		}
		setupFadeSlider();
		function setupFadeSlider() {
			var slider = $("fadeRange");
			slider.value = fade_in_seconds;
			var sliderText = $("fade");
			sliderText.innerHTML = "Fade: " + fade_in_seconds.toFixed(1) + "s";
			slider.oninput = function() {
				fade_in_seconds = parseFloat(this.value);
				sliderText.innerHTML = "Fade: " + fade_in_seconds.toFixed(1) + "s";
			}
		}
		
		setupBpmSlider();
		function setupBpmSlider() {
			var slider = $("bpmRange");
			slider.value = bpm;
			var sliderText = $("bpm");
			sliderText.innerHTML = "BPM: " + bpm;
			slider.oninput = function() {
				bpm = parseInt(this.value);
				sliderText.innerHTML = "BPM: " + bpm;
			}
		}

		setupTremoloMinSlider();
		function setupTremoloMinSlider() {
			var slider = $("tremoloMinRange");
			slider.value = tremoloMin * 100;
			var sliderText = $("tremoloMin");
			sliderText.innerHTML = "Min: " + tremoloMin.toFixed(2);
			slider.oninput = function() {
				var v = parseFloat(this.value) / 100;
				tremoloMin = Math.min(tremoloMax, v);
				sliderText.innerHTML = "Min: " + tremoloMin.toFixed(2);
			}
		}

		setupTremoloMaxSlider();
		function setupTremoloMaxSlider() {
			var slider = $("tremoloMaxRange");
			slider.value = tremoloMax * 100;
			var sliderText = $("tremoloMax");
			sliderText.innerHTML = "Max: " + tremoloMax.toFixed(2);
			slider.oninput = function() {
				var v = parseFloat(this.value) / 100;
				tremoloMax = Math.max(tremoloMin, v);
				sliderText.innerHTML = "Max: " + tremoloMax.toFixed(2);
			}
		}

		setupHarmonicsSliderTable();
		function setupHarmonicsSliderTable() {
			var i;

			var table = $("harmonics_table");
			var innerTableHtml = "";
			for (i = 0; i < harmonicsVolume.length; i++) {
				var value = harmonicsVolume[i];
				var percentValue = value*100.0;
				innerTableHtml += 	`<tr>
										<td><label id='harmonic_text_`+i+`' for='harmonic_`+i+`'>H`+i+`</label></td>
										<td><input type='range' min='0' max='100' value='`+percentValue+`' step='0.001' class='slider' id='harmonic_`+i+`'/></td>
									</tr>`;
			}
			table.innerHTML = innerTableHtml;


			for (i = 0; i < harmonicsVolume.length; i++) {
				setupHarmonicSlider(i);
			}

			function setupHarmonicSlider(i) {
				var value = harmonicsVolume[i];
				var percentValue = value*100.0;
				var slider = $("harmonic_"+i);
				var sliderText = $("harmonic_text_"+i);
				sliderText.innerHTML = "H" + i + ": " + percentValue.toFixed(3);
				slider.oninput = function() {
					var v = parseFloat(this.value);
					sliderText.innerHTML = "H" + i + ": " + v.toFixed(3);
					var volume = v / 100;
					harmonicsVolume[i] = volume;
					audio_controller.setHarmonicVolume(i, volume);
				}
			}
		}
	}		
}

kofi = function(){
	window.open("https://ko-fi.com/jasonfleischer", "_blank");
}

info = function(){
	information.showAlert();
}
dismissInfo = function(){
	information.dismissAlert();
}

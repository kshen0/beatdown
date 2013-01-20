
var script = document.createElement('script');
script.src = './jquery-1.9.0.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

var context = new webkitAudioContext();
var audioBuffer;
var sourceNode;
var splitter;
var analyser, analyser2;
var javascriptNode;
var decoded;
var masterBuffer;
var threshold = 100;
var samplecount = 1;
var avgtotal = 0;

//volume data
var volumecurrent = 0;
var volumearray = [];
var volumeindex = 0;

//low data
var lowcurrent = 0;
var lowarray = [];
var lowindex = 0;

//mid data
var midcurrent = 0;
var midarray = [];
var midindex = 0;

//high data
var highcurrent = 0;
var higharray = [];
var highindex = 0;

/*
//band limits
var lowbottom = 0;
var lowtop = 12;
var lowtolerance = 1.05;

var midbottom = 40;
var midtop = 250;
var midtolerance = 1.1;

var highbottom = 460;
var hightop = 511;
var hightolerance = 1.2;
*/

//alt version - 86 is bucket size in hertz
var lowbottom = 0;
var lowtop = Math.round(200/86);
var lowtolerance = 1.05;

var midbottom = Math.round(300/86);
var midtop = Math.round(2400/86);
var midtolerance = 1.1;

var highbottom = Math.round(3000/86);
var hightop = 511;
var hightolerance = 1.2;

var isPlaying = false;

var ctx = $("#canvas").get()[0].getContext("2d");

// create gradient
var gradient = ctx.createLinearGradient(0, 0, 0, 130);
gradient.addColorStop(1,'#000000');
gradient.addColorStop(0.75,'#ff0000');
gradient.addColorStop(0.25,'#ffff00');
gradient.addColorStop(0,'#ffffff');

// load sound
setupAudioNodes();
loadSound("Our Life.mp3");


function setupAudioNodes() {
	javascriptNode = context.createJavaScriptNode(2048, 1, 1);
	javascriptNode.connect(context.destination);
	
	// set up analyzer
	analyser = context.createAnalyser();
	analyser.soothingTimeConstant = 0.3;
	analyser.fftSize = 1024;
	
	analyser2 = context.createAnalyser();
	analyser2.smoothingTimeConstant = 0.0;
	analyser2.fftSize = 1024;
	
	// create buffer source node
	sourceNode = context.createBufferSource();
	splitter = context.createChannelSplitter();
	
	// create bandpass node
	filterNode = context.createBiquadFilter();
	filterNode.type = 2;
	filterNode.frequency.value = 350;
	filterNode.Q.value = 0;
	
	
	// connect source to analyser
	sourceNode.connect(filterNode);
	filterNode.connect(splitter);
	filterNode.connect(context.destination);
	
	// connect splitter output to analyser
	splitter.connect(analyser, 0, 0);
	splitter.connect(analyser2, 1, 0);
	
	analyser.connect(javascriptNode);
	
	//sourceNode.connect(context.destination);
	
	// use js node to draw at specific interval
	// analyser.connect(javascriptNode);
	console.log()
}

// load the specified sound
function loadSound(url) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';
	
	// When loaded decode the data
	request.onload = function() {
		// decode the data
		decoded = context.decodeAudioData(request.response, function(buffer) {
																			// when the audio is decoded play the sound
																			playSound(buffer);
																			masterBuffer = context.createBuffer(request.response, false);
																			}, onError);
		
		
	}
	request.send();
}

function playSound(buffer) {
	sourceNode.buffer = buffer;
	sourceNode.noteOn(0);
	isPlaying = true;
}

function startSound() {
	//sourceNode.buffer = masterBuffer;
	//sourceNode.noteOn(0);
	var source = context.createBufferSource();
	sourceNode = source;
	source.buffer = masterBuffer;
	source.connect(filterNode);
	//filterNode.connect(context.destination);
	source.noteOn(0);
	isPlaying = true;
}

function stopSound() {
	sourceNode.noteOff(0);
	isPlaying = false;
}

function onError(e) {
	console.log(e);
}

javascriptNode.onaudioprocess = function() {
	// get average for first channel
	var array = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(array);
	var average = getAverageVolume(array);
	var lowaverage = getAverageVolumeOverRange(lowbottom, lowtop, array);
	var midaverage = getAverageVolumeOverRange(midbottom, midtop, array);
	var highaverage = getAverageVolumeOverRange(highbottom, hightop, array);
	
	// get average for second channel
	var array2 = new Uint8Array(analyser.frequencyBinCount);
	analyser2.getByteFrequencyData(array2);
	var average2 = getAverageVolume(array2);
	var lowaverage2 = getAverageVolumeOverRange(lowbottom, lowtop, array2);
	var midaverage2 = getAverageVolumeOverRange(midbottom, midtop, array2);
	var highaverage2 = getAverageVolumeOverRange(highbottom, hightop, array2);
	
	// average volume over time
	if (isPlaying) {
		var avgtotal = (average + average2)/2;
		var lowavgtotal = (lowaverage + lowaverage2)/2;
		var midavgtotal = (midaverage + midaverage2)/2;
		var highavgtotal = (highaverage + highaverage2)/2;
		
		var maxsize = 30;
		
		if (volumeindex >= maxsize) {
			volumeindex = 0;
		}
		if (lowindex >= maxsize) {
			lowindex = 0;
		}
		if (midindex >= maxsize) {
			midindex = 0;
		}
		if (highindex >= maxsize) {
			highindex = 0;
		}
		
		//total volume
		volumearray[volumeindex] = avgtotal;
		volumecurrent = 0;
		for (i = 0; i < volumearray.length; i++) {
			volumecurrent += volumearray[i];
		}
		volumecurrent = volumecurrent/volumearray.length;
		volumeindex++;
		
		//bass response
		lowarray[lowindex] = lowavgtotal;
		lowcurrent = 0;
		for (i = 0; i < lowarray.length; i++) {
			lowcurrent += lowarray[i];
		}
		lowcurrent = lowcurrent/lowarray.length;
		lowindex++;
		
		//mid response
		midarray[midindex] = midavgtotal;
		midcurrent = 0;
		for (i = 0; i < midarray.length; i++) {
			midcurrent += midarray[i];
		}
		midcurrent = midcurrent/midarray.length;
		midindex++;
		
		//high response
		higharray[highindex] = highavgtotal;
		highcurrent = 0;
		for (i = 0; i < higharray.length; i++) {
			highcurrent += higharray[i];
		}
		highcurrent = highcurrent/higharray.length;
		highindex++;
		
		//console.log("Low average: " + lowcurrent + "Average Left: " + lowaverage + ", Average Right: " + lowaverage2);
		// clear current state
		ctx.clearRect(0, 0, 250, 130);
		
		ctx.fillStyle = gradient;
		
		// left channel
		ctx.fillRect(0, 130-average, 25, 130);
		// right channel
		ctx.fillRect(30, 130-average2, 25, 130);
		
		ctx.fillStyle = "rgb(214, 214, 214)";
		if (average > volumecurrent*1.2 || average2 > volumecurrent*1.2) {
			//ctx.fillRect(70, 10, 20, 20);
		}
		
		// low pitch indicator
		ctx.fillStyle = "rgb(219, 178, 44)";
		if (lowaverage > lowcurrent*lowtolerance || lowaverage2 > lowcurrent*lowtolerance) {
			ctx.fillRect(70, 100, 20, 20);
			$('div.low').text((lowaverage + lowaverage2)/2);
		}
		else {
			$('div.low').text(false);
		}
		
		// mid pitch indicator
		ctx.fillStyle = "rgb(164, 219, 44)";
		if (midaverage > midcurrent*midtolerance || midaverage2 > midcurrent*midtolerance) {
			ctx.fillRect(70, 70, 20, 20);
		}
		
		// high pitch indicator
		ctx.fillStyle = "rgb(27, 201, 224)";
		if (highaverage > highcurrent*hightolerance || highaverage2 > highcurrent*hightolerance) {
			ctx.fillRect(70, 40, 20, 20);
		}
		
		//console.log("HA: " + Math.round(highaverage) + ", HC: " + Math.round(highcurrent*hightolerance) + " | MA: " + Math.round(midaverage) + ", MC: " + Math.round(midcurrent*midtolerance) + " | LA: " + Math.round(lowaverage) + ", LC: " + Math.round(lowcurrent*lowtolerance));
		
		ctx.font = "12pt Calibri";
		ctx.fillStyle = "rgb(0, 0, 0)";
		//ctx.fillText("volume", 90, 30)
		ctx.fillText("bass: " + Math.round(lowaverage - lowcurrent*lowtolerance), 90, 120);
		ctx.fillText("mid: " + Math.round(midaverage - midcurrent*midtolerance), 90, 90);
		ctx.fillText("high: " + Math.round(highaverage - highcurrent*hightolerance), 90, 60);
		
		ctx.fillText("Q: " + filterNode.Q.value, 150, 120);
		ctx.fillText("Freq.: " + filterNode.frequency.value, 150, 90);
		
		
		//needle
//		ctx.beginPath();
//		var pos = Math.round(lowaverage - lowcurrent*lowtolerance);
//		ctx.arc(150, 100, 10, pos*Math.PI, (pos+10)*Math.PI, true);
//		ctx.lineWidth = 70;
//		ctx.strokeStyle = "rgb(219, 178, 44)";
//		ctx.stroke();
		
	}
}

function widenFilt() {
	filterNode.Q.value += 1;
}

function narrowFilt() {
	filterNode.Q.value -= 1;
}

function raiseFilt() {
	filterNode.frequency.value += 50;
}

function lowerFilt() {
	filterNode.frequency.value -= 50;
}

function getAverageVolume(array) {
	var values = 0;
	var average;
	
	var length = array.length;
	
	for (var i = 0; i < length; i++) {
		values += array[i];
	}
	
	average = values / length;
	return average;
}

function getAverageVolumeOverRange(low, high, array) {
	var values = 0;
	var average;
	
	if (low < 0) {
		low = 0;
	}
	if (high > array.length) {
		high = array.length;
	}
	
	for (var i = low; i < high; i++) {
		values += array[i];
	}
	
	average = values / (high-low);
	return average;
}

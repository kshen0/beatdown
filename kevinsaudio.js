/*
var BufferLoader = document.createElement("script");
BufferLoader.src = "buffer-loader.js";
BufferLoader.type = "text/javascript";

document.getElementsByTagName("head")[0].appendChild(BufferLoader);
*/

/*
function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}
*/
/*

var context;
var bufferLoader;

function init() {
  context = new webkitAudioContext();
  var songs = ['./01 Artificial Nocturne.mp3', './Jayou.mp3'];

  bufferLoader = new BufferLoader(context, songs, finishedLoading);

  bufferLoader.load();
}

function finishedLoading(bufferList) {
  // Create two sources and play them both together.
  var source1 = context.createBufferSource();
  //var source2 = context.createBufferSource();
  source1.buffer = bufferList[0];
  //source2.buffer = bufferList[1];

  source1.connect(context.destination);
  //source2.connect(context.destination);
  source1.noteOn(0);
  //source2.noteOn(0);
}
*/
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

var ctx = $("#canvas").get()[0].getContext("2d");

// crete gradient
var gradient = ctx.createLinearGradient(0, 0, 0, 130);
gradient.addColorStop(1,'#000000');
gradient.addColorStop(0.75,'#ff0000'); 
gradient.addColorStop(0.25,'#ffff00');
gradient.addColorStop(0,'#ffffff');

// load sound
setupAudioNodes();
loadSound("12 Ghost Overload.mp3");


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

	// connect source to analyser
	sourceNode.connect(splitter);

	// connect splitter output to analyser
	splitter.connect(analyser, 0, 0);
	splitter.connect(analyser2, 1, 0);

	analyser.connect(javascriptNode);

	sourceNode.connect(context.destination);

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
		}, onError);
	}
	request.send();
}

function playSound(buffer) {
	sourceNode.buffer = buffer;
	sourceNode.noteOn(0);
}

function startSound() {
	sourceNode.buffer = decoded;
	sourceNode.noteOn(0);
}

function stopSound() {
	sourceNode.noteOff(0);
}

function onError(e) {
	console.log(e);
}

javascriptNode.onaudioprocess = function() {
	// get average for first channel
	var array = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(array);
	var average = getAverageVolume(array);
	console.log(array[100]);

	// get average for second channel
	var array2 = new Uint8Array(analyser.frequencyBinCount);
	analyser2.getByteFrequencyData(array2);
	var average2 = getAverageVolume(array2);

	// clear current state
	ctx.clearRect(0, 0, 60, 130);

	ctx.fillStyle = gradient;

	var threshold = 70;
	if(130-average < threshold) {
		ctx.fillRect(0, 130-average, 25, 130);
	}
	if(130-average2 < threshold) {
		ctx.fillRect(30, 130-average2, 25, 130);
	}
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

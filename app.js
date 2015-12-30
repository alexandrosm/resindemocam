// original code from https://delog.wordpress.com/2011/04/26/stream-live-webm-video-to-browser-using-node-js-and-gstreamer/

var express = require('express')
var http = require('http')
var net = require('net');
var child = require('child_process');

var app = express();
var httpServer = http.createServer(app);

app.get('/', function(req, res) {
	var date = new Date();

	res.writeHead(200, {
		'Date':date.toUTCString(),
		'Connection':'close',
		'Cache-Control':'private',
		'Content-Type':'video/webm',
		'Server':'CustomStreamer/0.0.1',
	});

	var tcpServer = net.createServer(function (socket) {
		socket.pipe(res)
	});

	tcpServer.maxConnections = 1;

	tcpServer.listen(function() {
		var cmd = 'gst-launch-1.0';
		var options = {};
		var args =
			['v4l2src',
				'!', 'video/x-raw,format=\(string\)RGB,framerate=30/1',
				'!', 'videoconvert',
				'!', 'vp8enc', 'cpu-used=0',
				'!', 'queue2',
				'!', 'm.', 'audiotestsrc',
				'!', 'audioconvert',
				'!', 'vorbisenc',
				'!', 'queue2',
				'!', 'm.', 'webmmux', 'name=m', 'streamable=true',
				'!', 'tcpclientsink', 'host=localhost',
				'port='+tcpServer.address().port];

		var gstMuxer = child.spawn(cmd, args, options);

		gstMuxer.stderr.on('data', onSpawnError);
		gstMuxer.on('exit', onSpawnExit);

		res.connection.on('close', function() {
			gstMuxer.kill();
		});
	});
});

httpServer.listen(80);

function onSpawnError(data) {
	console.log(data.toString());
}

function onSpawnExit(code) {
	if (code != null) {
		console.error('GStreamer error, exit code ' + code);
	}
}

process.on('uncaughtException', function(err) {
	console.log(err);
});
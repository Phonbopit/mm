var express = require('express');
var path = require('path');

var app = express();


app.get('/', function(req, res) {

	res.sendFile(path.join(__dirname + '/index.html'));

});

app.listen(5555, function() {

	console.log('Server is running on port 5555');
});
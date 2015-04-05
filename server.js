var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var port = process.env.PORT || 5555;

mongoose.connect('mongodb://localhost/mean');

var app = express();
var adminRouter = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {

	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');

	next();

});

// Logger with morgan.
app.use(morgan('dev'));


app.get('/', function(req, res) {

	res.send('Welcome to the home page!');

});

var apiRouter = express.Router();

apiRouter.get('/', function(req, res) {

	res.json({ 
		message: 'Hooray! welcome to our api!'
	});

});

app.use('/api', apiRouter);

app.listen(port, function() {
	console.log('Magic happends on port' + port);
});
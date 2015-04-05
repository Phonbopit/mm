var express = require('express');
var path = require('path');

var app = express();

var adminRouter = express.Router();


app.get('/', function(req, res) {

	res.sendFile(path.join(__dirname + '/index.html'));

});

adminRouter.use(function(req, res, next) {

	console.log(req.method + req.url);

	// go to the next middleware
	next();

});

adminRouter.get('/', function(req, res) {

	// response

});

app.use('/admin', adminRouter);

app.listen(5555, function() {

	console.log('Server is running on port 5555');
});
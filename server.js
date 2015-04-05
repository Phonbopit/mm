var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var port = process.env.PORT || 5555;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mean');

var User = require('./app/models/user');

var app = express();
var adminRouter = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {

	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');

	next();

});

// Logger with morgan.
app.use(morgan('dev'));


app.get('/', function(req, res) {

	res.send('Welcome to the home page!');

});

var apiRouter = express.Router();

apiRouter.use(function(req, res, next) {

	console.log('Somebody I use to know :)');

	next();

});

apiRouter.get('/', function(req, res) {

	res.json({ 
		message: 'Hooray! welcome to our api!'
	});

});

apiRouter.route('/users')
	.post(function(req, res) {

		console.log('Loggin in /users post method ');

		var user = new User();

		// Set the users information
		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;

		user.save(function(err) {
			
			if (err) {
				// duplicate entry
				if (err.code === 11000) {
					return res.json({ success: false, message: 'An username already exists.' });
				} else {
					return res.send(err);
				} 
			}

			res.json({
				message: 'User created!'
			});

		});

	})

	.get(function(req, res) {

		User.find(function(err, users) {

			if (err) 
				res.send(err);

			res.json(users);

		});
	});

apiRouter.route('/users/:user_id')
	.get(function(req, res) {

		var user_id = req.params.user_id;

		User.findById(user_id, function(err, user) {

			if (err) res.send(err);

			res.json(user);

		});

	})

	.put(function(req, res) {

		var user_id = req.params.user_id;

		User.findById(user_id, function(err, user) {

			if (err) res.send(err);

			if (req.body.name)
				user.name = req.body.name;

			if (req.body.username)
				user.username = req.body.username;

			if (req.body.password)
				user.password = req.body.password; 

			user.save(function(err) {

				if (err) res.send(err);

				res.json({
					message: 'User just updated!'
				});

			});

		});

	})

	.delete(function(req, res) {
		
		var user_id = req.params.user_id;

		User.remove({_id: user_id}, function(err, user) {
			if (err) return res.send(err);

			res.json({
				message: 'Successfully deleted!'
			});

		});

	});

app.use('/api', apiRouter);

app.listen(port, function() {
	console.log('Magic happends on port' + port);
});
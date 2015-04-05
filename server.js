var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var port = process.env.PORT || 5555;
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost/mean');
var superSecret = 'iloveyou';

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

	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	if (token) {

		jwt.verify(token, superSecret, function(err, decoded) {

			if (err) {
				return res.status(403).send({
					success: false,
					message: 'Failed to authenticate token.'
				});
			} else {
				req.decoded = decoded;

				next();
			}

		});

	} else {

		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});

	}

});

apiRouter.post('/authenticate', function(req, res) {

	User.findOne({
		username: req.body.username
	})
	.select('name username password')
	.exec(function(err, user) {

		if (err) throw err;

		// IF not found username
		if (!user) {

			res.json({
				success: false,
				message: 'Authentication failed. User not found.'
			});

		} else if (user) {

			var validPassword = user.comparePassword(req.body.password);

			if (!validPassword) {

				res.json({
					success: false,
					message: 'Authentication failed. Wrong password.'
				});

			} else {

				var token = jwt.sign({
					name: user.name,
					username: user.username
				}, superSecret, {
					expiredInMinutes: 1440 // expires in 24 hours
				});

				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});

			}

		}

	});

});

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

// CRUD with router /users/:user_id (POST, GET, PUT, DELETE)
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

apiRouter.get('/me', function(req, res) {

	res.send(req.decoded);
	
});

app.use('/api', apiRouter);

app.listen(port, function() {
	console.log('Magic happends on port' + port);
});
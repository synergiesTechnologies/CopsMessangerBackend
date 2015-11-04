// =================================================================
// get the packages we need ========================================
// =================================================================
var express 	= require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');


var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model
var Message   = require('./app/models/messeges');

app.use(express.static(__dirname + '/public'));

//var mailer = require('express-mailer');
var nodemailer = require('nodemailer');

// =================================================================
// configuration ===================================================
// =================================================================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
 mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =================================================================
// routes ==========================================================
// =================================================================




app.post('/createUser', function(req, res) {

	// create a sample user
   console.log('inside login module--->>111');
  console.log(req.body);
  console.log('hi ---->>');

  var users = new User(req.body);
  users.save(function(err) {
		if (err) throw err;

		console.log('User saved successfully');
		res.json({ success: true });
	});

   // db.contactlist.users.insert(req.body, function(err, doc) {

   // res.json(doc);
  });



app.post('/createMessage', function(req, res) {

	// create a sample user
   console.log('inside create message-->>');
  console.log(req.body);
  console.log('hi ---->>');

  var message = new Message(req.body);
  message.save(function(err) {
		if (err) throw err;

		console.log('message saved successfully');
		res.json({ success: true });
	});

   // db.contactlist.users.insert(req.body, function(err, doc) {

   // res.json(doc);
  });



app.get('/listMessage', function (req, res) {
  console.log('I received a listMessage-------->>>>>>>>>>');
     


	Message.find({}, function(err, message) {
		res.json(message);
	});

});


// --------------------------------
//   mail sending functionality
//---------------------------------

app.get('/sendMail', function handleSayHello(req, res) {
    // Not the movie transporter!
   // var text = 'Hello world from \n\n' + req.body.name;
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'example@gmail.com', // Your email id
            pass: 'password' // Your password
        }
    });
});


   



/*app.get('/sendMail', function (req, res, next) {
	   console.log('I received a mailSend-------->>>>>>>>>>1111');
  app.mailer.send('email', {
    to: 'jithinkbabu@gmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field.  
    subject: 'Test Email', // REQUIRED. 
    otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables. 
  }, function (err) {
    if (err) {
      // handle error 
      console.log(err);
      res.send('There was an error sending the email');
      return;
    }
    console.log('I received a mailSend-------->>>>>>>>>>');
    res.send('Email Sent');
  });
});*/



// basic route (http://localhost:8080)
app.get('/', function(req, res) {
	res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router(); 

// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
apiRoutes.post('/authenticate', function(req, res) {

	// find the user
	User.findOne({
		name: req.body.name
	}, function(err, user) {

		if (err) throw err;

		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {

			// check if password matches
			if (user.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {

				// if user is found and password is right
				// create a token
				var token = jwt.sign(user, app.get('superSecret'), {
					expiresInMinutes: 1440 // expires in 24 hours
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


// ---------------------------------------------------------
// Reset password sending functionality
// ---------------------------------------------------------

apiRoutes.post('/sayHello',function handleSayHello(req, res) {
    // Not the movie transporter!
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'jithin.synergies@gmail.com', // Your email id
            pass: 'Pass@12345' // Your password
        }
    });

     var mailOptions = {
    to: '<jithin.synergies@gmail.com>', // list of receivers
   from: '<jithin.synergies@gmail.com>', // sender address
     subject: 'Email Example', // Subject line
   // text: text //, // plaintext body
    html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
};

transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        res.json({yo: 'error'});
    }else{
        console.log('Message sent: ' + info.response);
        res.json({yo: info.response});
    };
});
    });



// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoutes.use(function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;	
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
		
	}
	
});



// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------
apiRoutes.get('/', function(req, res) {
	res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});

apiRoutes.get('/check', function(req, res) {
	res.json(req.decoded);
});

app.use('/api', apiRoutes);

// =================================================================
// start the server ================================================
// =================================================================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);

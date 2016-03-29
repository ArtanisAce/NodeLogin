var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register',{
  	'title': 'Register',
      'user':req.user
  });
});

router.get('/login', function(req, res, next) {
  res.render('login',{
  	'title': 'Login',
      'user':req.user
  });
});

router.get('/members', function(req, res, next) {
    if(req.user){  
  res.render('members',{
  	'title': 'Members',
      'user':req.user.username
    });
  }
  else{
      res.redirect('/users/login');
  }
});

router.post('/register',function(req, res, next){
    
	// Get Form Values
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Form Validation
	req.checkBody('name','Name field is required').notEmpty();
	req.checkBody('email','Email field is required').notEmpty();
	req.checkBody('email','Email not valid').isEmail();
	req.checkBody('username','Username field is required').notEmpty();
	req.checkBody('password','Password field is required').notEmpty();
	req.checkBody('password2','Passwords do not match').equals(req.body.password);

	// Check for errors
	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors: errors,
			name: name,
			email: email,
			username: username,
			password: password,
			password2: password2
		});
	} else {
        
		var newUser = new User({//creamos el objeto con el modelo de user.js (El objeto debe ser
                                //una instancia del modelo de mongoose que vamos a usar)
			name: name,
			email: email,
			username: username,
			password: password          
		});
          
     
		// Create User
		User.createUser(newUser, function(err, user){//para salvar en la db el objeto
			if(err) throw err;
			console.log(user);
		});

		// Success Message
		req.flash('success','You are now registered and may log in');
		res.location('/');
		res.redirect('/');
	}
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
	function(username, password, done){
		User.getUserByUsername(username, function(err, user){
			if(err) throw err;
			if(!user){
				console.log('Unknown User');
				return done(null, false,{message: 'Unknown User'});
			}

			User.comparePassword(password, user.password, function(err, isMatch){
				if(err) throw err;
				if(isMatch){
					return done(null, user);
				} else {
					console.log('Invalid Password');
					return done(null, false, {message:'Invalid Password'});
				}
			});
		});
	}
));


router.post('/login',passport.authenticate('local',{failureRedirect:'/users/login', failureFlash:'Invalid username or password'}),function(req,res){
    console.log('Sucess!');
    req.flash('success','You are now logged in!');
    res.redirect('/users/members');
});

router.get('/logout', function(req, res){
    if(req.user){       
  req.logout();
  req.flash('success','You logged out');
  res.redirect('/');
  }else{
      req.flash('success','You are not logged in. Please log in');
      res.redirect('/users/login');
  }
});

module.exports = router;


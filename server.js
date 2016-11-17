var express = require('express');
var session = require('express-session');
// var bodyParser = require('body-parser'); //Don't need these for this example
// var cors = require('cors');
// var massive = require('massive');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./config');

passport.use(new FacebookStrategy({
  clientID: config.facebookID,//should copy these from the company's docs
  clientSecret: config.facebookSecret,
  callbackURL: config.baseDomain + '/auth/facebook/callback'
}, function(token, refreshToken, profile, done) {
  //Code goes here!!!
    //Go to database and look for profile.id
    //Create user using profile.id
  return done(null /*error*/, profile /*info that goes on session*/);
}));

var app = express();
// app.use(bodyParser.json());
// app.use(cors());

app.use(session({secret: 'asdfawqeoprasdj'}));//express session MUST be before passposrt stuff

app.use(passport.initialize()); //MUST initialize passport before passport.session
app.use(passport.session());

//Here to help with session
//Preps data to put on session
passport.serializeUser(function(user, done) {
  done(null, user);
});
//Gets data from session and preps for req.user
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/me',
	failureRedirect: '/login'
}), function(req, res) {
	console.log(req.session);
});

app.get('/me', function(req,res,next){
  res.send(req.user);
});

app.listen('3000', function(){
  console.log("Successfully listening on : 3000")
});

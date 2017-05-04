var passport      = require('passport');
var localStrategy = require('passport-local').Strategy;

var User = require('../models/user');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('local.signup', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  User.findOne({ 'email' : email }, function(err, user) {
    if(err){
      return done(err);
    }
    if(user){
        return done(null, false, req.flash('error', "User with this email already exist!"));
    }

    var newUser = new User();
    newUser.name = req.body.name;
    newUser.surname = req.body.surname;
    newUser.email = req.body.email;
    newUser.password = newUser.encryptPassword(req.body.password);

    newUser.save(function(err) {
      return done(null, newUser);
    });
  })
}));

passport.use('local.login', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  User.findOne({ 'email' : email }, function(err, user) {
    if(err){
      return done(err);
    }
    var messages = [];
    if(!user || !user.validPassword(password)){
        messages.push('Email does not exist, or password is invalid!');
        return done(null, false, req.flash('error', messages));
    }
    return done(null, user);
  });
}));

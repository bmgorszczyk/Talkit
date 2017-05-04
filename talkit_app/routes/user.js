module.exports = function(app, passport) {
  app.get('/', function(req, res) {
    return res.redirect('/login');
  });

  app.get('/signup', function(req, res) {
    var errors = req.flash('error');
    res.render('signup', {title: "talkit | Sign up", messages: errors, hasErrors: errors.length > 0});
  });

  app.post('/signup', validate, passport.authenticate('local.signup', {
    successRedirect: '/login',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/login', function(req, res) {
    var errors = req.flash('error');
    res.render('login', {title: "talkit | Login", errors: errors, hasErrors: errors.length > 0});
  });

  app.post('/login', passport.authenticate('local.login', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/dashboard', ensureAuthenticated, function(req, res){
    res.render('dashboard', {
      title: "talkit | Dashboard",
      name: req.user.name,
      surname: req.user.surname
    });
  });

  app.get('/logout', function(req, res){
    console.log('Loggin out...');
    req.logout();
    req.session.destroy();
    res.redirect("/login");
  });
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}

function validate(req, res, next){
  req.checkBody('name', 'Name is required!').notEmpty();
  req.checkBody('name', 'Name must not be less then 4').isLength({min:5});
  req.checkBody('surname', 'Surname is required!').notEmpty();
  req.checkBody('surname', 'Surname must not be less then 4!').isLength({min:5});
  req.checkBody('email', 'Email is invalid').isEmail();
  req.checkBody('password', 'Password must not be less then 5!').isLength({min:5});
  req.check('password', 'Password must contain at least 1 number!').matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, "i");

  var errors = req.validationErrors();
  if (errors){
    var messages = [];
    errors.forEach(function(error){
      messages.push(error.msg);
    });
    req.flash('error', messages);
    res.redirect('/signup');
  } else {
    return next();
  }
}

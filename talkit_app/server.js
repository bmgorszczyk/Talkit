var port          = 80;
var express       = require('express');
var bodyParser    = require('body-parser');
var validator     = require('express-validator');
var cookieParser  = require('cookie-parser');
var ejs           = require('ejs');
var engine        = require('ejs-mate');
var session       = require('express-session');
var mongoose      = require('mongoose');
var mongoStore    = require('connect-mongo')(session);
var passport      = require('passport');
var flash         = require('connect-flash');

var app           = require('express')();
var server        = require('http').Server(app);
var io            = require('socket.io')(server);

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost/talkit_db');
mongoose.connect('mongodb://bael:Wysokie1@ds127391.mlab.com:27391/talkit_db');

require('./config/passport');

app.use(express.static(__dirname + '/public'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(validator());

app.use(session({
  secret: 'Testkey',
  resave: false,
  saveUninitialized: false,
  store: new mongoStore({mongooseConnection: mongoose.connection})
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

require('./routes/user')(app, passport);

io.sockets.on('connection', function (socket) {

   console.log("User connected.");

   socket.on('disconnect', function () {
       console.log('User disconnected.');
   });

   socket.on('message', function(msg){
     io.emit('message', msg);
   });

});

server.listen(port, function(){
  console.log('Listening on port ' + port);
});

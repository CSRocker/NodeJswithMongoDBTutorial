var express = require('express')
    , path = require('path')
    , favicon = require('serve-favicon')
    , logger = require('morgan')
    , expressValidator = require('express-validator')
    , cookieParser = require('cookie-parser')
    , session = require('express-session')
    , passport = require('passport')
    , localStrategy = require('passport-local').Strategy
    , bodyParser = require('body-parser')
    , multer = require('multer')
    , flash = require('connect-flash')
    , mongo = require('mongodb')
    , mongoose = require('mongoose')
    , db = mongoose.connection;


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view HTML engine setup
app.engine('.html', require('ejs').__express);
app.set('view engine','html');

// Middlewares

var upload = multer({ dest: './uploads' }); // Handle file uploads
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());                      // Flash message
app.use(function(req,res,next){        // Express message
  res.locals.message = require('express-messages')(req,res);
  next();
});
app.use(session({             // Handle express session

  secret : 'secret',  // define secret key
  saveUninitialized : true,
  resave : true
}));
app.use(passport.initialize()); // Passport
app.use(passport.session());
app.use(expressValidator({      // Validator
  errorFormatter : function(parse, msg, value){
    var namespace = parse.split('.')
        ,root = namespace.shift()
        , formParam = root;

    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return{
        param : formParam,
        msg : msg,
        value : value
  };
  }
}));  // ./ End of Validator

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

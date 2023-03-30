

let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let _ = require('lodash');

// modules for authentication
let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
let localStrategy = passportLocal.Strategy;
let flash = require('connect-flash');

// database setup
let mongoose = require('mongoose');
let db = require('./db');

// point mongoose to the db uri
mongoose.set('strictQuery', false);
mongoose.connect(db.uri, {useNewUrlParser: true, useUnifiedTopology: true});

// Passport Config
// require('./passport')(passport);

let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection error: '));
mongoDB.once('open', () => {
  console.log('Connected to MongoDB...');
});

// set routers
let homeRouter = require('../routes/home');
let incidentRouter = require('../routes/incident');
let usersRouter = require('../routes/users');
let authRouter = require('../routes/auth');


let app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

// setup express session
app.use(session({
  secret: "someSecret",
  saveUninitialized: false,
  resave: false
}));

// initialize flash
app.use(flash());

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// passport user configuration

//create User Model Instance
let userModel = require('../models/user');
let User = userModel.User;

// implement a User Authentication Strategy
passport.use(User.createStrategy());

// serialize and deserialize the User Info
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', homeRouter);
app.use('/incident-list', incidentRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


app.locals.htmlDisplay = html => _.escape(html).replace(/\n/g, '<br>');

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Error' });
});

module.exports = app;

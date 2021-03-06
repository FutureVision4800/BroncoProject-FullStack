const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const bodyParser = require('body-parser');
const session = require('express-session');
const dbConnection = require('../database');
const MongoStore = require('connect-mongo')(session);
const passport = require('../passport');
const cors = require('cors');

const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');
const userRouter = require('../routes/api/user');
const recommendRouter = require('../routes/api/recommend');

const app = express();


// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

//Front end engine set up
app.use(express.static(path.join(__dirname, '../../client/build')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// Sesions
app.use(
  session({
    secret: 'fraggle-rock', //pick a random string tp make the hash that is generated secure
    store: new MongoStore({ mongooseConnection: dbConnection }),
    resave: false, //required
    saveUninitialized: false //required
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session()); // calls the deserializeUser

// CORS
app.use(cors());


// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/user', userRouter);
app.use('/api/recommend', recommendRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
  console.log("Front End served");
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;

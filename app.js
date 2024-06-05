/**
 * Packges
 */
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var cors = require('cors');
var rbac = require('./middlewares/rbac');
var passport = require('passport');
var passportConfig= require('./config/passport');

/**
 * Routes
 */
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var jobsRouter = require('./routes/jobs');
var rolesRouter = require('./routes/role');
var applicationsRouter = require('./routes/application');
var questionRouter = require('./routes/questions')

/**
 * Middlewares
 */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', 'uploads')));
app.use(express.static(path.join(__dirname, 'public', 'uploads', 'cvs')));
app.use(express.static(path.join(__dirname, 'public', 'images')));
app.use(cors());
app.use(passport.initialize(passportConfig));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

/**
 * TO-DO Rate limit reqs 
 */

// const limiter = rateLimit({
//     windowMs: 5 * 60 * 1000,
//     limit: 10,
//     standardHeaders: true,
//     legacyHeaders: false
//     });
    
// app.use(limiter);


/**
 * Routes
 */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/jobs', jobsRouter);
app.use('/roles', rbac.authUser, rbac.authAdmin, rolesRouter);
app.use('/applications', applicationsRouter);
app.use('/questions', questionRouter)

module.exports = app;

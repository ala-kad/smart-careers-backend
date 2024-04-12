var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var cors = require('cors');
const rbac = require('./middlewares/rbac');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var jobsRouter = require('./routes/jobs');
var rolesRouter = require('./routes/role');


const passport = require('passport');
const passportConfig= require('./config/passport');

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
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

app.use(cors());
app.use(passport.initialize(passportConfig))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/jobs', jobsRouter);
app.use('/roles', rbac.authUser, rbac.authAdmin, rolesRouter);

const { initAdminAccount } = require("./config/init");

async function start() { 
    await initAdminAccount();
}

start();

module.exports = app;

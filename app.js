/**
 * Packages
 */
var express = require('express');
var app = express();
var path = require('path');
require('dotenv').config();
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var cors = require('cors');
var rbac = require('./middlewares/rbac');
var passport = require('passport');
var passportConfig = require('./config/passport');

/**
 * Middlewares
 */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(passport.initialize(passportConfig));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));


/**
 * Routes
// app.use('/questions', questionRouter)
// var questionRouter = require('./routes/questions')
*/
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');
const { specs } = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var jobsRouter = require('./routes/jobs');
var rolesRouter = require('./routes/role');
var applicationsRouter = require('./routes/application');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/jobs', jobsRouter);
app.use('/roles', rbac.authUser, rbac.authAdmin, rolesRouter);
app.use('/applications', applicationsRouter);


/**
 * Stattic assets
 */
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', 'uploads')));
app.use(express.static(path.join(__dirname, 'public', 'uploads', 'cvs')));
app.use(express.static(path.join(__dirname, 'public', 'images')));


// Error handling middleware (centralized)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;

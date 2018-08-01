'use strict';

// Node Modules
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
require('hbs');

// Facehack requires
require('./helpers/handlebars');
// const locals = require('./middlewares/locals');
const authMiddlewares = require('./middlewares/auth');

mongoose.connect('mongodb://localhost/facehack');

// Routes
const index = require('./routes/index');
const users = require('./routes/users');
const auth  = require('./routes/auth');
const jobs  = require('./routes/jobs');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(session({
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 24 * 60 * 60 // 1 day
    }),
    secret: 'some-string',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Global notification system
app.use(flash());

app.use((req, res, next) => {
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(locals.localCurrentUser);
app.use((req, res, next) => {
    app.locals.currentUser = req.session.currentUser;
    next();
});

app.use('/', index);
app.use('/users', authMiddlewares.requireUser, users);
app.use('/auth', auth);
app.use('/jobs', authMiddlewares.requireUser, jobs);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

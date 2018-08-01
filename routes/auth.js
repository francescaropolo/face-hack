'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require('../models/user');

router.get('/signup', (req, res, next) => {
    const data = {
        sessionFlash: res.locals.sessionFlash
    };
    res.render('auth/signup', data);
});

router.post('/signup', (req, res, next) => {
    const {email, password} = req.body;
    // To middleware (DRY)
    if (!email || !password) {
        req.session.sessionFlash = {
            type: 'uk-alert-danger',
            messageTitle: 'Error',
            message: 'You must fill the fields'
        };
        return res.redirect('/auth/signup');
    }
    User.findOne({email})
        .then(user => {
            if (user) {
                req.session.sessionFlash = {
                    type: 'uk-alert-danger',
                    messageTitle: 'Error',
                    message: 'User already exists'
                };
                return res.redirect('/auth/signup');
            } else {
                const salt = bcrypt.genSaltSync(saltRounds);
                const hashedPassword = bcrypt.hashSync(password, salt);
                const newUser = new User({email, password: hashedPassword});
                newUser.save()
                    .then(user => {
                        req.session.currentUser = user;
                        req.session.sessionFlash = {
                            type: 'uk-alert-success',
                            messageTitle: 'Yay!',
                            message: 'Signup successful!'
                        };
                        res.redirect('/');
                    })
                    .catch(error => {
                        next(error);
                    });
            }
        })
        .catch(error => {
            next(error);
        });
});

router.get('/login', (req, res, next) => {
    const data = {
        sessionFlash: res.locals.sessionFlash
    };
    res.render('auth/login', data);
});

router.post('/login', (req, res, next) => {
    const {email, password} = req.body;
    if (!email || !password) {
        req.session.sessionFlash = {
            type: 'uk-alert-danger',
            messageTitle: 'Error',
            message: 'You must fill the fields'
        };
        return res.redirect('/auth/login');
    }
    User.findOne({email})
        .then(user => {
            if (!user) {
                req.session.sessionFlash = {
                    type: 'uk-alert-danger',
                    messageTitle: 'Error',
                    message: 'User don\'t exist'
                };
                return res.redirect('/auth/login');
            }
            if (bcrypt.compareSync(password, user.password)) {
                req.session.currentUser = user;
                req.session.sessionFlash = {
                    type: 'uk-alert-success',
                    messageTitle: 'Yay!',
                    message: 'Login successful!'
                };
                res.redirect('/');
            } else {
                req.session.sessionFlash = {
                    type: 'uk-alert-danger',
                    messageTitle: 'Error',
                    message: 'Incorrect password'
                };
                res.redirect('/auth/login');
            }
        })
        .catch(error => {
            next(error);
        });
});

router.post('/logout', (req, res, next) => {
    delete req.session.currentUser;
    req.session.sessionFlash = {
        type: 'uk-alert-primary',
        messageTitle: 'Bye!',
        message: 'Logout successful'
    };
    res.redirect('/');
});

module.exports = router;

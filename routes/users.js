'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authMiddlewares = require('../middlewares/auth');

// GET rendeing profile
router.get('/:id', (req, res, next) => {
    const data = {
        messages: req.flash('info')
    };

    const {id} = req.params;
    User.findById(id)
        .then(() => {
            res.render('users/user', data);
        })
        .catch(error => {
            next(error);
        });
});

// GET rendering edit form
router.get('/edit/:id', authMiddlewares.requireUser, (req, res, next) => {
    res.render('users/edit');
});

// POST update the user data on DB
router.post('/edit/:id', authMiddlewares.requireUser, (req, res, next) => {
    const {id} = req.params;
    const {name, lastName, email, dateOfBirth, phone, bio, facebook, twitter, instagram, linkedin, github} = req.body;
    console.log('body', req.body);

    User.findByIdAndUpdate(id, {name, lastName, email, dateOfBirth, phone, bio, socialNetworks: {facebook, twitter, instagram, linkedin, github}})
        .then(user => {
            req.session.currentUser = user;
            req.flash('info', 'User updated successfully!');
            res.redirect(`/users/${id}`);
        })
        .catch(error => {
            next(error);
        });
});

module.exports = router;

'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authMiddlewares = require('../middlewares/auth');
const multer = require('multer');
const upload = multer({dest: './public/uploads'}); // for parsing multipart/form-data

// GET rendeing profile
router.get('/:id', (req, res, next) => {
    const data = {
        sessionFlash: res.locals.sessionFlash
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
router.post('/edit/:id', authMiddlewares.requireUser, upload.single('picture'), (req, res, next) => {
    const {id} = req.params;
    const {name, lastName, email, dateOfBirth, phone, bio, facebook, twitter, instagram, linkedin, github} = req.body;    
    const picturePath = req.file ? req.file.path : undefined;    
        
    User.findByIdAndUpdate(id, {name, lastName, email, dateOfBirth, phone, bio, socialNetworks: {facebook, twitter, instagram, linkedin, github}, picturePath})
        .then(user => {
            req.session.currentUser = user;
            req.session.sessionFlash = {
                type: 'uk-alert-success',
                messageTitle: 'Yay!',
                message: 'User updated successfully!'
            };
            res.redirect(`/users/${id}`);
        })
        .catch(error => {
            next(error);
        });
});

module.exports = router;

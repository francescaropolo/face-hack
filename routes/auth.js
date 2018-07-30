const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require('../models/user');

router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body;
    if (!username || !password) {
        req.flash('info', 'Los campos son obligatorios');
        return res.redirect('signup');
    }
    User.findOne({username})
        .then(user => {
            if (user) {
                req.flash('info', 'Usuario ya existente');
                return res.redirect('/signup');
            } else {
                const salt = bcrypt.genSaltSync(saltRounds);
                const hashedPassword = bcrypt.hashSync(password, salt);
                const newUser = new User({username, password: hashedPassword});
                newUser.save()
                    .then(user => {
                        req.session.currentUser = user;
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
    res.render('auth/login');
});

router.post('/login', (req, res, next) => {

});

module.exports = router;

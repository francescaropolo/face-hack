const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require('../models/user');

router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
    const {email, password} = req.body;
    if (!email || !password) {
        req.flash('info', 'Los campos son obligatorios');
        return res.redirect('signup');
    }
    User.findOne({email})
        .then(user => {
            if (user) {
                req.flash('info', 'Usuario ya existente');
                return res.redirect('/signup');
            } else {
                const salt = bcrypt.genSaltSync(saltRounds);
                const hashedPassword = bcrypt.hashSync(password, salt);
                const newUser = new User({email, password: hashedPassword});
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
    const {email, password} = req.body;
    if (!email || !password) {
        req.flash('info', 'Los campos son obligatorios');
        return res.redirect('login');
    }
    User.findOne({email})
        .then(user => {
            if (!user) {
                req.flash('info', 'No existe el usuario');
                return res.redirect('/login');
            }
            if (bcrypt.compareSync(password, user.password)) {
                req.session.currentUser = user;
                res.redirect('/');
            } else {
                req.flash('info', 'Contraseña incorrecta');
                res.redirect('login');
            }
        })
        .catch(error => {
            next(error);
        });
});

router.post('/logout', (req, res, next) => {
    delete req.session.currentUser;
    res.redirect('login');
});

module.exports = router;

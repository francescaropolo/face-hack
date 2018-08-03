'use strict';

const mongoose = require('mongoose');
const User = require('../models/user');

const idCheckUser = (req, res, next) => {
    const { id } = req.params;
    const regExp = RegExp('^[a-fA-F0-9]{24}$');
    if (!mongoose.Types.ObjectId.isValid(id) || !regExp.test(id)) {
        res.render('error', {message: 'This is not the webpage you are looking for... :(', error: {status: '404'}});
    } else {
        User.findById(id)
            .then(user => {
                if (user !== null) {
                    next();
                } else {
                    res.render('error', {message: 'This is not the webpage you are looking for... :(', error: {status: '404'}});
                }
            })
            .catch(error => {
                next(error);
            });
    }
};

module.exports = idCheckUser;

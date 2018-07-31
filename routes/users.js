const express = require('express');
const router = express.Router();
const User = require('../models/user');

/* GET users listing. */
router.get('/', (req, res, next) => {
    res.render('users/user');
});

router.get('/:id', (req, res, next) => {
    const {id} = req.params;
    User.findById(id)
        .then(user => {
            res.render('users/user', user);
        })
        .catch(error => {
            next(error);
        });
});

module.exports = router;

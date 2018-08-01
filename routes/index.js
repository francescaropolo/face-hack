'use strict';

const express = require('express');
const router = express.Router();
const Job = require('../models/job');

/* GET home page. */
router.get('/', (req, res, next) => {
    Job.find()
        .populate('owner')
        .then((jobs) => {
            res.render('index', {title: 'Facehack', jobs});
        })
        .catch(error => {
            next(error);
        });
});

module.exports = router;

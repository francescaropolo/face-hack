'use strict';

const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const moment = require('moment');
const Job = require('../models/job');
moment().format('Do MMMM YYYY');

/* GET home page. */
router.get('/', (req, res, next) => {
    Job.find()
        .populate('owner')
        .then((jobs) => {
            const jid = jobs._id;
            const jobTime1 = ObjectId(jid).getTimestamp(); // Getting date of creation
            const jobTime2 = jobTime1.toString(); // Parsing raw mongo date to string
            const jobTime = moment(jobTime2).format('Do MMMM YYYY'); // Parsing using moment.js to new date format
            res.render('index', {title: 'Facehack', jobs, jobTime});
        })
        .catch(error => {
            next(error);
        });
});

module.exports = router;

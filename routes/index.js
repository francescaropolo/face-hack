'use strict';

const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const moment = require('moment');
const Job = require('../models/job');
moment().format('Do MMMM YYYY')

/* GET home page. */
router.get('/', (req, res, next) => {    
    const oid = req.session.currentUser._id;
    const jobTime1 = ObjectId(oid).getTimestamp(); // Getting date of creation
    const jobTime2 = jobTime1.toString(); // Parsing raw mongo date to string 
    const jobTime = moment(jobTime2).format('Do MMMM YYYY'); // Parsing using moment.js to new date format
    console.log(jobTime);
    Job.find()
        .populate('owner')
        .then((jobs) => {
            res.render('index', {title: 'Facehack', jobs, jobTime});
        })
        .catch(error => {
            next(error);
        });
});

module.exports = router;

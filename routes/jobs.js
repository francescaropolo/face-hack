'use strict';

const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const Job = require('../models/job');
const idCheck = require('../middlewares/idCheckJob');
const moment = require('moment');
moment().format('Do MMMM YYYY');

// GET jobs listing only logged user jobs
router.get('/', (req, res, next) => {
    const data = {
        sessionFlash: res.locals.sessionFlash
    };
    const oid = req.session.currentUser._id;
    Job.find({'owner': ObjectId(oid)})
        .populate('owner')
        .then((jobs) => {
            const jid = jobs._id;
            const jobTime1 = ObjectId(jid).getTimestamp(); // Getting date of creation
            const jobTime2 = jobTime1.toString(); // Parsing raw mongo date to string
            const jobTime = moment(jobTime2).format('Do MMMM YYYY'); // Parsing using moment.js to new date format
            res.render('jobs/my-jobs', { jobs, data, jobTime });
        })
        .catch(next);
});

// GET rendering create view
router.get('/create', (req, res, next) => {
    res.render('jobs/create');
});

// POST Creating on DB new JOB
router.post('/create', (req, res, next) => {
    const { title, company, locationLong, locationLat, type, description, salary, journeyType, vacancies } = req.body;
    const location = {type: 'Point', coordinates: [locationLong, locationLat]};
    const owner = req.session.currentUser._id;
    Job.create({ owner, title, company, type, description, salary, journeyType, vacancies, location })
        .then(() => {
            req.session.sessionFlash = {
                type: 'uk-alert-success',
                messageTitle: 'Yay!',
                message: 'Job created successfully!'
            };
            res.redirect('/jobs');
        })
        .catch(error => {
            next(error);
        });
});

// GET rendering by job id a single job
router.get('/:id', idCheck, (req, res, next) => {
    const { id } = req.params;
    Job.findById(id)
        .then(job => {
            const data = {
                sessionFlash: res.locals.sessionFlash
            };
            res.render('jobs/job', {job, data});
        })
        .catch(error => {
            next(error);
        });
});

// GET rendering edit view to edit single job
router.get('/:id/edit', idCheck, (req, res, next) => {
    const { id } = req.params;
    Job.findById(id)
        .then(job => {
            res.render('jobs/edit', job);
        })
        .catch(error => {
            next(error);
        });
});

// POST Pushing user id on applicants inside Job Model
router.post('/:id/apply', (req, res, next) => {
    const { id } = req.params;
    const userId = req.session.currentUser._id;
    // Checking if user id exists
    Job.findById(id)
        .then(job => { // the owner can apply to his own job, whyyy??
            if (job && !job.applicants.some(applicantId => {
                return applicantId.toString() === userId;
            })) {
                return Job.findByIdAndUpdate(id, { $push: { applicants: userId } });
            }
        })
        .then(() => {
            req.session.sessionFlash = {
                type: 'uk-alert-success',
                messageTitle: 'Yay!',
                message: 'Successful application!'
            };
            res.redirect('/');
        })
        .catch(error => {
            next(error);
        });
});

// POST Updating job by id on DB
router.post('/:id', (req, res, next) => {
    const { id } = req.params;
    const { title, company, locationLong, locationLat, type, description, salary, journeyType, vacancies } = req.body;
    const location = {type: 'Point', coordinates: [locationLong, locationLat]};
    Job.findByIdAndUpdate(id, { title, company, type, description, salary, journeyType, vacancies, location })
        .then(() => {
            req.session.sessionFlash = {
                type: 'uk-alert-success',
                messageTitle: 'Yay!',
                message: 'Job updated successfully!'
            };
            res.redirect(`/jobs/${id}`);
        })
        .catch(error => {
            next(error);
        });
});

// GET and list applicants view
router.get('/:id/applicants', idCheck, (req, res, next) => {
    const { id } = req.params;
    Job.findById(id)
        .populate('applicants')
        .then(job => {
            res.render('jobs/applicants', job);
        })
        .catch(error => {
            next(error);
        });
});

// POST Deleting a single job on DB
router.post('/:id/delete', (req, res, next) => {
    Job.findByIdAndRemove(req.params.id)
        .then(() => {
            req.session.sessionFlash = {
                type: 'uk-alert-success',
                messageTitle: 'Yay!',
                message: 'Job deleted successfully!'
            };
            res.redirect('/jobs');
        })
        .catch(error => {
            next(error);
        });
});

module.exports = router;

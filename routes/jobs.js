'use strict';

const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const Job = require('../models/job');

// GET jobs listing only logged user jobs
router.get('/', (req, res, next) => {
    const oid = req.session.currentUser._id;
    Job.find({'owner': ObjectId(oid)})
        .populate('owner')
        .then((jobs) => {
            res.render('jobs/my-jobs', { jobs });
        })
        .catch(error => {
            next(error);
        });
});

// GET rendering create view
router.get('/create', (req, res, next) => {
    res.render('jobs/create');
});

// POST Creating on DB new JOB
router.post('/create', (req, res, next) => {
    const { title, company, type, description, salary, journeyType, vacancies } = req.body;
    const owner = req.session.currentUser._id;
    Job.create({ owner, title, company, type, description, salary, journeyType, vacancies })
        .then(() => {
            res.redirect('/jobs');
        })
        .catch(error => {
            next(error);
        });
});

// GET rendering by job id a single job
router.get('/:id', (req, res, next) => {
    const { id } = req.params;
    Job.findById(id)
        .then(job => {
            res.render('jobs/job', job);
        })
        .catch(error => {
            next(error);
        });
});

// GET rendering edit view to edit single job
router.get('/:id/edit', (req, res, next) => {
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
        .then(job => {
            if (job && !job.applicants.some(applicantId => {
                return applicantId.toString() === userId;
            })) {
                return Job.findByIdAndUpdate(id, { $push: { applicants: userId } });
            }
        })
        .then(() => {
            res.redirect('/');
        })
        .catch(error => {
            next(error);
        });
});

// POST Updating job by id on DB
router.post('/:id', (req, res, next) => {
    const { id } = req.params;
    const { title, company, type, description, salary, journeyType, vacancies } = req.body;
    Job.findByIdAndUpdate(id, { title, company, type, description, salary, journeyType, vacancies })
        .then(() => {
            res.redirect(`/jobs/${id}`);
        })
        .catch(error => {
            next(error);
        });
});

// GET and list applicants view
router.get('/:id/applicants', (req, res, next) => {
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
            res.redirect('/jobs');
        })
        .catch(error => {
            next(error);
        });
});

module.exports = router;

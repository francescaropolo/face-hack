'use strict';

const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const Job = require('../models/job');

/* GET jobs listing only logged user jobs */
router.get('/', (req, res, next) => {
    const oid = req.session.currentUser._id;
    Job.find(({'owner': ObjectId(oid)}))
        .populate('owner')
        .then((jobs) => {
            res.render('jobs/my-jobs', { jobs });
        })
        .catch(error => {
            next(error);
        });
});

router.get('/create', (req, res, next) => {
    res.render('jobs/create');
});

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

router.post('/:id/apply', (req, res, next) => {
    const { id } = req.params;
    const userId = req.session.currentUser._id;
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

router.post('/:id/delete', (req, res, next) => {
    Job.findByIdAndRemove(req.params.id)
        .then(data => {
            console.log(data);
            res.redirect('/jobs');
        })
        .catch(error => {
            next(error);
        });
});

module.exports = router;

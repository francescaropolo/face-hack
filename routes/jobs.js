var express = require('express');
var router = express.Router();
const Job = require('../models/job');
// const User = require('../models/user');

/* GET jobs listing. */
router.get('/', (req, res, next) => {
    Job.find()
        .populate('owner') // Populate before render
        .then((jobs) => {
            res.render('jobs/list', { jobs });
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
    const owner = req.session.currentUser;
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

router.post('/:id', (req, res, next) => {
    const { id } = req.params;
    const { title, company, type, description, salary, journeyType, vacancies } = req.body;
    Job.findByIdAndUpdate(id, { title, company, type, description, salary, journeyType, vacancies })
        .then(data => {
            res.redirect(`/jobs/${id}`, data);
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

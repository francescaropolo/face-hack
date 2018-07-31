var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
const Job = require('../models/job');

/* GET jobs listing only logged user jobs */
router.get('/', (req, res, next) => {
    const oid = req.session.currentUser._id;
    Job.find(({"owner" : ObjectId(oid)}))
        .populate('owner')
        .then((jobs) => {            
            res.render('jobs/JobPrivateList', { jobs });
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

// GET and list applicants view
router.get('/:id/applicants', (req, res, next) => {
    
    Job.find()
        .then(applicants => {
            res.render('jobs/applicants', applicants);
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

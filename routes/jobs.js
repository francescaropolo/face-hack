var express = require('express');
var router = express.Router();
const Job = require('../models/job');

/* GET jobs listing. */
router.get('/', function(req, res, next) {
  Job.find()
    .then((jobs) => {
      res.render('jobs/list', { jobs });
    })
    .catch(error => {
      next(error);
      console.log('error', error);
    })
});

router.get('/create', (req,res,next) => {
  res.render('jobs/create');
});

router.post('/create', (req,res,next) => {
  const { title, company, type, description, salary, journeyType, vacancies } = req.body;
  Job.create({ title, company, type, description, salary, journeyType, vacancies })
    .then(() => {
      res.redirect('/jobs');
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;

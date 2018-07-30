var express = require('express');
var router = express.Router();
const Job = require('../models/job');

/* GET jobs listing. */
router.get('/', function(req, res, next) {
  Job.find()
    .then((job) => {
      res.render('jobs/list', { jobs });
    })
    .catch(error => {
      next(error);
      console.log('error', error);
    })
});

module.exports = router;

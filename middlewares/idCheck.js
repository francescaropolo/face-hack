'use strict';

const mongoose = require('mongoose');
const Job = require('../models/job');

const idCheck = (req, res, next) => {
    const { id } = req.params;
    const regExp = RegExp('^[a-fA-F0-9]{24}$');
    if (!mongoose.Types.ObjectId.isValid(id) || !regExp.test(id)) {
        return res.sendStatus(400);
    } else {
        Job.findById(id)
            .then(job => {
                if (job !== null) {
                    next();
                } else {
                    return res.sendStatus(400);
                }
            })
            .catch(error => {
                next(error);
            });
    }
};

module.exports = idCheck;

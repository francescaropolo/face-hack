// const express = require('express');
// const app = express();

const localCurrentUser = (req, res, next) => {
  app.locals.currentUser = req.session.currentUser;
  next();
}

module.exports = {
  localCurrentUser
}
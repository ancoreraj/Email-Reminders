const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated, checkStatus } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);
router.get('/ankur', ensureAuthenticated, (req, res) =>
  res.render('hi', {
    user: req.user
  })
);
 
module.exports = router;

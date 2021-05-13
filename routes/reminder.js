const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated, checkStatus } = require('../config/auth');

// Dashboard
router.get('/schedule', ensureAuthenticated, (req, res) =>
  res.render('schedule')
);
router.get('/recurring', ensureAuthenticated, (req, res) =>
  res.render('recurring')
);


router.post('/schedule',(req,res)=>{
    const {name, description, scheduleTime } = req.body;
    console.log(req.body);
    res.redirect('/reminder/schedule')
})

router.post('/recurring',(req,res)=>{
    const {name, description, monthly, monthName, weekly, weekDay,daily, scheduleTime} = req.body;

    console.log(req.body)
    res.redirect('/reminder/recurring')
})
module.exports = router;

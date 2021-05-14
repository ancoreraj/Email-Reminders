const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated, checkStatus } = require('../config/auth');
const agenda = require('./../agenda/agenda')
const ScheduleReminder = require('./../models/ScheduleReminder')
const sendReminderEmail = require('./../mail/sendReminderMail')


// Schedule Reminder Route
router.get('/schedule', ensureAuthenticated, async (req, res) => {
  const reminders = await ScheduleReminder.find({ user: req.user._id })

  res.render('schedule', { reminders: reminders })
});

//Under Construction
// router.get('/recurring', ensureAuthenticated, (req, res) =>
//   res.render('recurring')
// );

// Post Schedule Reminder
router.post('/schedule', ensureAuthenticated, async (req, res) => {
  var { name, description, scheduleTime } = req.body;
  scheduleTime += ":00+05:30";
  const scheduleReminder = new ScheduleReminder({
    name,
    description,
    scheduleTime,
    user: req.user.id
  })

  await scheduleReminder.save((err) => {
    if (err) {
      console.log(err)
    } else {
      agenda.define(scheduleReminder._id.toString(), async job => {
        console.log('Ankur is the best')
        console.log(`Hi ${scheduleReminder.description}`);
        sendReminderEmail(req.user.email, scheduleReminder.name, scheduleReminder.description)
      });

      (async function () {
        await agenda.start(); // Start Agenda instance

        await agenda.schedule(scheduleReminder.scheduleTime, scheduleReminder._id.toString());
      })();
      res.redirect('/reminder/schedule')

    }
  })
})

//Under Construction
// router.post('/recurring', (req, res) => {
//   const { name, description, monthly, monthDate, weekly, weekDay, daily, dailyTime } = req.body;

//   console.log(req.body)
//   res.redirect('/reminder/recurring')
// })

//Delete Schedule Reminder
router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
  const id = req.params.id
  const reminderRemoved = await agenda.cancel({ name: id });
  console.log(reminderRemoved)
  await ScheduleReminder.findByIdAndDelete(id, (err, docs) => {
    if (err) {
      console.log(err)
    } else {
      console.log(docs)
      res.redirect('/reminder/schedule')
    }
  })
})

//Edit Schedule Reminder Route
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  const reminder = await ScheduleReminder.findById(req.params.id)
  console.log(reminder)
  res.render('editSchedule', { reminder })

})

//Edit Post Schedule Reminder Route
router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
  const id = req.params.id

  const reminderRemoved = await agenda.cancel({ name: id });

  var { name, description, scheduleTime } = req.body;
  scheduleTime += ":00+05:30";

  await ScheduleReminder.findOneAndUpdate({ "_id": id }, { "$set": { "name": name, "description": description, "scheduleTime": scheduleTime } }, {new: true}, (err, docs)=>{
    if(err){
      console.log(err)
    }else{
      agenda.define(docs._id.toString(), async job => {

        console.log(`Hi ${docs.description}`);
        sendReminderEmail(req.user.email, docs.name, docs.description)
      });

      (async function () {
        await agenda.start(); // Start Agenda instance

        await agenda.schedule(docs.scheduleTime, docs._id.toString());
      })();
      res.redirect('/reminder/schedule')
    }
  })

})

module.exports = router;

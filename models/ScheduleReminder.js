const mongoose = require('mongoose');

const ScheduleReminderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  scheduleTime: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

const ScheduleReminder = mongoose.model('ScheduleReminder', ScheduleReminderSchema);

module.exports = ScheduleReminder;

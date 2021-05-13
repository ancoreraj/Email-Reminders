const mongoose = require('mongoose');

const RecurringReminderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  monthly: {
    type: String,
  },
  monthDate: {
    type: Number, 
  },
  weekly: {
    type: String,
  },
  weekDay: {
    type: Number,
  },
  daily: {
    type: String,
  },
  dailyTime: {
    type: String
  }
});

const RecurringReminder = mongoose.model('RecurringReminder', RecurringReminderSchema);

module.exports = RecurringReminder;

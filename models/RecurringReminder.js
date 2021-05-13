const mongoose = require('mongoose');

const RecurringReminderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String, 
    enum: ['Pending', 'Active'],
    default: 'Pending'
  },
  confirmationCode: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const RecurringReminder = mongoose.model('RecurringReminder', RecurringReminderSchema);

module.exports = RecurringReminder;

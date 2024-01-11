const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Code = require('./../config/confirmationCode')
const sendConfirmationEmail = require('./../mail/sendMail')
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');
const Contact = require('../models/Contact');
const json2csv = require('json2csv').parse;
const fs = require('fs');
const path = require('path')


// Login Page
router.get('/', (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register 
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email is already registered' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const confirmationCode = Code();
        const newUser = new User({
          name,
          email,
          password,
          confirmationCode
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {

                sendConfirmationEmail(name, email, confirmationCode);
                // req.flash(
                //   'success_msg',
                //   'The confirmation link is sent to your email. Please redirect to that link to complete your registration.'
                // );
                res.redirect('/users/check');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

//link confirmation check
router.get('/check', (req, res) => {
  res.render('linkconfirmation')
})

//Confirmation
router.get('/confirm/:confirmationCode', (req, res) => {
  User.findOne({
    confirmationCode: req.params.confirmationCode,
  }).then((user) => {
    if (!user) {
      req.flash('error_msg', 'User Not found.')
      res.redirect('/users/register')
      return;
    }

    user.status = "Active";
    user.save((err) => {
      if (err) {
        console.log(err)
      } else {
        req.flash('success_msg', 'Congratulations, You have been successfully registered. Now you can login and enjoy Reminders.')
        res.redirect('/users/login')
      }
    })
  })
})


// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);

  console.log('Authenticated')
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

const regex = /^\d{10}$/;

router.post('/contact', async (req, res) => {
  const { email, password } = req.body;

  let checkPassword = regex.test(password);

  if(checkPassword){
    const contact = new Contact({
      name: email,
      number: password
    });
    await contact.save();
  }

  req.flash('success_msg', checkPassword ? 'Your Data is saved to us' : 'Wrong phone number format');
  res.redirect('/');
})

router.get('/xyz/getData', async (req, res) => {
  const data = await Contact.find({});
  res.render('xyz', { data })
})

router.get('/xyz/download', async (req, res) => {
  const data = await Contact.find({});
  const ankur = [];
  data.map((d) => {
    ankur.push(
      {
        phoneNumber : d.number
      }
    )
  })
  const csvData = json2csv(ankur, { header: true });
  const filePath = path.join(__dirname, 'output.csv');  // Use path.join to create an absolute path
  fs.writeFileSync(filePath, csvData, 'utf-8');

  res.attachment('output.csv');
  res.sendFile(filePath);
})

module.exports = router;

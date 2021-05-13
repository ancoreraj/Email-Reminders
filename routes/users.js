const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Code = require('./../config/confirmationCode')
const sendConfirmationEmail = require('./../mail/sendMail')
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

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
                
                sendConfirmationEmail(name,email,confirmationCode);
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
router.get('/check',(req,res)=>{
  res.render('linkconfirmation')
})

//Confirmation
router.get('/confirm/:confirmationCode',(req,res)=>{
  User.findOne({
    confirmationCode: req.params.confirmationCode,
  }).then((user) => {
      if(!user){
        req.flash('error_msg','User Not found.')
        res.redirect('/users/register')
        return;
      }

      user.status = "Active";
      user.save((err)=>{
        if(err){
          console.log(err)
        }else{
          req.flash('success_msg','Congratulations, You have been successfully registered. Now you can login and enjoy Reminders.')
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

module.exports = router;

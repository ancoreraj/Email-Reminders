const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
// const passport = require('passport');
// const flash = require('connect-flash');
// const session = require('express-session');
const dotenv = require('dotenv')
const sendConfirmationEmail = require("./mail/sendMail")
const path = require('path')

const app = express();

// Passport Config
// require('./config/passport')(passport);

// DB Config
// const db = require('./config/keys').mongoURI;

dotenv.config({ path: './config/config.env' })

mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
const viewsPath = path.join(__dirname, 'views')
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', viewsPath)

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
// app.use(
//   session({
//     secret: 'secret',
//     resave: true,
//     saveUninitialized: true
//   })
// );

// Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

// Connect flash
// app.use(flash());

// Global variables
// app.use(function(req, res, next) {
//   res.locals.success_msg = req.flash('success_msg');
//   res.locals.error_msg = req.flash('error_msg');
//   res.locals.error = req.flash('error');
//   next();
// });

// Routes
app.use('/', require('./routes/index.js'));
app.use('/', require('./routes/users.js'));
app.use('/reminder', require('./routes/reminder.js'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on  ${PORT}`));

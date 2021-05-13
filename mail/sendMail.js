const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config({ path: './config/config.env' })
const user = process.env.USER;
const pass = process.env.USER_PASSWORD;

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: user,
    pass: pass
  }
})

const sendConfirmationEmail = (name, email, confirmationCode) => {
  console.log("Check");
  console.log(confirmationCode)
  transport.sendMail({
    from: user,
    to: email,
    subject: "Please confirm your Reminders account",
    html: `<p>Email Confirmation</p>
        <p>Hello ${name}</p>
        <p>Thank you for choosing Reminders. Please confirm your email by clicking on the following link</p>
        <h1><a href=http://localhost:3000/users/confirm/${confirmationCode}> Click here</a><h1>
        </div>`,
  }).catch(err => console.log(err));
};

module.exports = sendConfirmationEmail;




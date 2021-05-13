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

const sendReminderEmail = (email, name, description) => {
  console.log("Check");
  transport.sendMail({
    from: user,
    to: email,
    subject: "Reminders Alert",
    html: `<h3>Name : ${name}.</h3>
           <h3>Description: ${description}.</h3>`,
  }).catch(err => console.log(err));
};

module.exports = sendReminderEmail;



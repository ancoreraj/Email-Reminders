# Schedule and Recurring Reminders

### Create, Update and delete Scheduled and Recurring reminders for free.

## [Live Site](https://ancore-reminders.herokuapp.com)

## Technology Used
### Fronted - Ejs
### Backend - Nodejs
 * ExpressJs - For Routing
 * PassportJs - For Authentication 
 * Nodemailer - To Send Emails
 * Agendajs - To execute scheduled and recurring tasks.
 * Mongoose - Relationship between Database(MongoDB)
### Database - MongoDB


## Install and Run

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com). Go check them out if you don't have them locally installed.

 1. Clone the repository
```bash
$ git clone https://github.com/ancoreraj/Email-Reminders.git
```

```sh
$ npm install
```
 2. Add a config.env file in config folder and add the dependencies from config.example file there.

```bash
$ node app.js
```

 3. Open http://localhost:3000 in your favourite browser.


### Q. How I am doing the scheduling?
- I used a new node package [AgendaJs](https://github.com/agenda/agenda). Why not traditional function such as setTimeout(), because in setTimeout(), we lose our job when the process restarts. AgendaJs uses a MongoDB database to schedule tasks so that even if the server goes down, the task will still run at the specified time or intervals.

### Q. Why I chose the Mongodb Database?
- The first reason is, we use JavaScript in writing mongodb codes which is same for nodejs and fronted development. I didn't had to learn a new programming language.
- It is a noSql database. 
## Contributing

Feel free to dive in! [Open an issue](https://github.com/ancoreraj/Email-Reminders/issues) or submit PRs.

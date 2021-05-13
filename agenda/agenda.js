const Agenda = require('agenda')
const dbURL = process.env.MONGO_URI

const agenda = new Agenda({
    db: {address: dbURL, collection: 'Agenda'},
    processEvery: '5 seconds',
    useUnifiedTopology: true
})

module.exports = agenda
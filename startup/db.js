// const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
    const db = config.get('db')
    console.log(db)
    mongoose.connect(db)
        .then(() => console.log(`connected to ${db}`))
        .catch(
             (err)=> {console.log(err.message)
             })
}
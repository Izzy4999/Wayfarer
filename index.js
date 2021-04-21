const express = require('express')
const app = express()

require('express-async-errors');
require('dotenv/config')

require('./startup/routes')(app)
require('./startup/db')()
require('./startup/validation')()


// if (!config.get('jwtPrivateKey')) {
//      throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
//      }
const port = process.env.PORT|| 3000
const server = app.listen(port, ()=> console.log(`Listening on port ${port}...`))

module.exports = server
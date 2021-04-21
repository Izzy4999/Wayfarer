const user = require('../routes/user');
const auth = require('../routes/auth');
const trip = require('../routes/trip');
const bus = require('../routes/bus');
const express = require('express');
const booking = require('../routes/booking');
// const error = require('../middleware/error')

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/users', user);
  app.use('/api/users', auth);
  app.use('/api/trips', trip);
  app.use('/api/buses', bus);
  app.use('/api/bookings', booking);
  // app.use(error)
};

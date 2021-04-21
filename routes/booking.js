const { Booking, validate } = require('../models/booking');
const { Trip } = require('../models/trip');
const { User } = require('../models/user');
const _ = require('lodash');
const { Bus } = require('../models/bus');
const express = require('express');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const router = express.Router();

router.get('/', [auth, admin], async (req, res) => {
  const booking = await Booking.find().select('-_id -__v -trip._id -user._id');
  res.json({ status: 'success', statusCode: 200, data: booking });
});
router.get('/my-bookings', auth, async (req, res) => {
  const booking = await Booking.find({ 'user.email': req.user.email }).select(
    '-_id -__v -trip._id -user._id'
  );

  res.json({ status: 'success', statusCode: 200, data: booking });
});
router.post('/', auth, async (req, res) => {
  req.body.userId = req.user._id;

  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .json({
        status: 'error',
        statusCode: 400,
        error: error.details[0].message,
      });

  const trip = await Trip.findById(req.body.tripId);
  if (!trip)
    return res
      .status(404)
      .json({
        status: 'error',
        statusCode: 404,
        error: 'No trip with given Id',
      });

  const user = await User.findById(req.body.userId);
  if (!user)
    return res
      .status(404)
      .json({
        status: 'error',
        statusCode: 404,
        error: 'No user with given Id',
      });

  //   if (req.user._id !== userId)
  //     return res.status(403).send('The given ID is not for the user');

  let booking = new Booking({
    trip: {
      trip_date: trip.trip_date,
      origin: trip.origin,
      destination: trip.destination,
      bus: {
        model: trip.bus.model,
        capacity: trip.bus.capacity,
        number_plate: trip.bus.number_plate,
      },
      fare: trip.fare,
    },
    user: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    },
    seatNumber: req.body.seatNumber,
  });

  const bookInDb = await Booking.findOne({
    'trip.origin': trip.origin,
    'trip.destination': trip.destination,
    seatNumber: req.body.seatNumber,
  });

  if (bookInDb)
    return res
      .status(400)
      .json({
        status: 'error',
        statusCode: 400,
        error: 'seat Number already taken',
      });

  if (booking.seatNumber > booking.trip.bus.capacity)
    return res
      .status(401)
      .json({
        status: 'error',
        statusCode: 401,
        error: 'Bus capacity exceeded',
      });

  booking = await booking.save();

  res.json({
    status: 'success',
    statusCode: 200,

    data: _.pick(booking, [
      'trip.trip_date',
      'trip.origin',
      'trip.destination',
      'trip.bus.capacity',
      'trip.bus.number_plate',
      'trip.fare',
      'user.first_name',
      'user.last_name',
      'user.email',
      'seatNumber',
    ]),
  });
});
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
  const book = await Booking.findById(req.params.id);

  if (!book)
    return res
      .status(404)
      .json({
        status: 'error',
        statusCode: 404,
        error: 'No booking with given id',
      });

  if (book.user.email !== req.user.email)
    return res
      .status(400)
      .json({
        status: 'error',
        statusCode: 400,
        error: 'the given id is not for the user',
      });

  const booking = await Booking.deleteOne(book);

  res.json({
    status: 'success',
    statusCode: 200,
    data: {
      message: 'booking has been deleted',
    },
  });
});

module.exports = router;

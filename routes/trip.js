const { Trip, validate } = require('../models/trip');
const { Bus } = require('../models/bus');
const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');
const validateObjectId = require('../middleware/validateObjectId');
const router = express.Router();

router.get('/', async (req, res) => {
  const trip = await Trip.find().sort('origin').select(' -__v');
  res.json({ status: 'success', statusCode: 200, data: trip });
});
router.get('/:id', validateObjectId, async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip)
    return res
      .status(404)
      .json({ status: 'error', statusCode: 404, error: 'No trip with id' });

  res.json({ status: 'success', statusCode: 200, data: trip });
});
router.post('/', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      error: error.details[0].message,
    });

  const bus = await Bus.findById(req.body.bus);
  if (!bus)
    res.status(404).json({
      status: 'error',
      statusCode: 404,
      error: 'No bus with given ID',
    });

  let trip = new Trip({
    bus: {
      number_plate: bus.number_plate,
      model: bus.model,
      capacity: bus.capacity,
      manufacturer: bus.manufacturer,
      year: bus.year,
    },
    origin: req.body.origin,
    destination: req.body.destination,
    fare: req.body.fare,
  });

  trip = await trip.save();
  res.json({
    status: 'success',
    statusCode: 200,
    data: _.pick(trip, [
      '_id',
      'origin',
      'destination',
      'bus.number_plate',
      'bus.capacity',
      'bus.model',
      'bus.manufacturer',
      'bus.model',
    ]),
  });
});
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const trip = await Trip.findByIdAndRemove(req.params.id);

  if (!trip)
    return res.status(404).json({
      status: 'error',
      statusCode: 404,
      error: 'No trip with given id',
    });

  res.json({ status: 'sucess', statusCode: 200, data: trip });
});

module.exports = router;

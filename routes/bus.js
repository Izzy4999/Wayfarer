const express = require('express');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const { Bus, validate } = require('../models/bus');
const _ = require('lodash');
const validateObjectId = require('../middleware/validateObjectId');
const router = express.Router();

router.get('/', [auth, admin], async (req, res) => {
  const bus = await Bus.find().sort('manufacturer').select('-_id -__v');

  res.json({
    status: 'success',
    statusCode: 200,
    data: bus,
  });
});
router.get('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const bus = await Bus.findById(req.params.id);

  if (!bus)
    return res
      .status(404)
      .json({ status: 'error', statusCode: 404, error: 'No bus with id' });

  res.send(bus);
});
router.post('/', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      error: error.details[0].message,
    });

  let bus = await Bus.findOne({ number_plate: req.body.number_plate });
  if (bus)
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      error: 'bus already registered.',
    });

  bus = new Bus({
    number_plate: req.body.number_plate,
    manufacturer: req.body.manufacturer,
    model: req.body.model,
    year: req.body.year,
    capacity: req.body.capacity,
  });
  bus = await bus.save();

  res.json({
    status: 'success',
    statusCode: 200,
    data: _.pick(bus, [
      '_id',
      'number_plate',
      'manufacturer',
      'model',
      'year',
      'capacity',
    ]),
  });
});
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const bus = await Bus.findByIdAndRemove(req.params.id);
  if (!bus)
    res.status(404).json({
      status: 'error',
      statusCode: 404,
      error: 'No bus with the given ID',
    });

  res.json({ status: 'success', statusCode: 200, data: bus });
});

module.exports = router;

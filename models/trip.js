const mongoose = require('mongoose');
const Float = require('mongoose-float').loadType(mongoose, 2);
const Joi = require('joi');
const { busSchema } = require('./bus');
Joi.objectId = require('joi-objectid')(Joi);

const tripSchema = new mongoose.Schema({
  bus: {
    type: busSchema,
    required: true,
  },
  origin: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  destination: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  trip_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  fare: {
    type: Float,
    required: true,
  },
  // status: {
  //   default: 'active',
  //   type: String,

  // }
});

const Trip = mongoose.model('Trip', tripSchema);

function validateTrip(trip) {
  const schema = {
    origin: Joi.string().min(3).max(100).required(),
    destination: Joi.string().min(3).max(100).required(),
    fare: Joi.number().required(),
    bus: Joi.objectId().required(),
  };

  return Joi.validate(trip, schema);
}

exports.Trip = Trip;
exports.validate = validateTrip;

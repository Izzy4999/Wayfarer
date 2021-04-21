const mongoose = require('mongoose');
const Joi = require('joi');

const busSchema = new mongoose.Schema({
  number_plate: {
    type: String,
    required: true,
  },
  manufacturer: String,
  model: String,
  year: String,
  capacity: {
    type: Number,
    required: true,
  },
});

const Bus = mongoose.model('Bus', busSchema);

function validateBus(bus) {
  const schema = {
    number_plate: Joi.string().required(),
    manufacturer: Joi.string().required(),
    model: Joi.string().required(),
    year: Joi.string(),
    capacity: Joi.number().required(),
  };
  return Joi.validate(bus, schema);
}

exports.Bus = Bus;
exports.validate = validateBus;
exports.busSchema = busSchema;

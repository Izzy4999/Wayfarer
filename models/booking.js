const mongoose = require('mongoose');
const Joi = require('joi');
// Joi.objectId = require('joi-objectid')(Joi)

const bookingSchema = new mongoose.Schema({
  trip: {
    type: new mongoose.Schema({
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
      bus: {
        type: new mongoose.Schema({
          capacity: {
            type: Number,
            required: true,
          },
          number_plate: {
            type: String,
            required: true,
          },
          model: String,
        }),
      },
      trip_date: {
        type: Date,
        required: true,
        default: Date.now,
      },
      fare: {
        type: Number,
        required: true,
      },
    }),
    required: true,
  },
  user: {
    type: new mongoose.Schema({
      first_name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
      },
      last_name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
      },
      email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
      },
    }),
  },
  created_on: {
    type: Date,
    required: true,
    default: Date.now,
  },
  seatNumber: {
    type: Number,
    required: true,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

function validateBooking(booking) {
  const schema = {
    tripId: Joi.objectId().required(),
    userId: Joi.objectId().required(),
    seatNumber: Joi.number().required(),
  };

  return Joi.validate(booking, schema);
}

exports.Booking = Booking;
exports.validate = validateBooking;

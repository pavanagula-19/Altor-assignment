const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  device_brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  processor: {
    type: String,
    required: true,
  },
  sdk_int: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  vehicle_brand: {
    type: String,
    required: true,
  },
  vehicle_cc: {
    type: String,
    required: true,
  },
  vehicle_type: {
    type: String,
    required: true,
  },
  zone: {
    type: String,
    required: true,
  },
});

const DataModel = mongoose.model('Data', dataSchema);

module.exports = DataModel;

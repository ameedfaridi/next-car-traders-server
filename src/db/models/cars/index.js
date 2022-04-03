const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  make: {
    type: "string",
    required: true,
  },
  model: {
    type: "string",
    required: true,
  },
  year: {
    type: "number",
    required: true,
  },
  fuelType: {
    type: "string",
    required: true,
  },
  power: {
    type: "string",
    required: true,
  },
  details: {
    type: "string",
    required: true,
  },
  price: {
    type: "string",
    required: true,
  },
  averagePrice:{
    type:"number",
    required:true
  },
  photoUrl: {
    type: "string",
    required: true,
  },
});

const Car = mongoose.model("Car", CarSchema);

module.exports = Car;

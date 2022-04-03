const mongoose = require("mongoose");

const FaqSchema = new mongoose.Schema({
  question: {
    type: "string",
    required: true,
  },
  answer: {
    type: "string",
    required: true,
  },
});

const FAQ = mongoose.model("FAQ", FaqSchema);

module.exports = FAQ;

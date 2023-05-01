const mongoose = require("mongoose");

const tripSchema = mongoose.Schema({
  name: {
    type: String,
    rquired: true,
  },
  placeid: {
    type: Number,
    required: true,
  },
  adminid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("Trip", tripSchema);

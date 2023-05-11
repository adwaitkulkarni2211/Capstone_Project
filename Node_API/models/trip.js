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
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: {
    type: [
      {
        sender: {
          type: String,
          required: true,
        },
        time: {
          type: Date,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        room: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Trip",
          required: true,
        },
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("Trip", tripSchema);

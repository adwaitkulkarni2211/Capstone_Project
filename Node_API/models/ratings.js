const mongoose = require("mongoose");

const ratingsSchema = mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  placeid: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  tags: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("Rating", ratingsSchema);

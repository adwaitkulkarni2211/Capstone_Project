const mongoose = require("mongoose");

const New_PlacesSchema = mongoose.Schema({
  features__id: {
    type: Number,
    required: true,
  },
  features__geometry__coordinates__001: {
    type: Number,
    required: true,
  },
  features__geometry__coordinates__002: {
    type: Number,
    required: true,
  },
  features__properties__name: {
    type: String,
    required: true,
  },
  features__properties__kinds: { type: String, required: true },
});

module.exports = mongoose.model("New_Places", New_PlacesSchema);

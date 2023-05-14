const mongoose = require("mongoose");

const PlacesCounter_Schema = mongoose.Schema({
  place_id: {
    type: Number,
    required: true,
  },
  place_name: {
    type: String,
    required: true,
  },
  reviews_counter:{
    type:Number,
    required: true,
    default :0,
  },
  average_rating:{
    type: Float32Array,
    required: true,
    default:0,
  },
  tags_counter:{
    type:Number,
    required: true,
    default: 0
  },
  nature_counter:{
    type:Number,
    required: true,
    default: 0
  },
  trek_counter:{
    type:Number,
    required: true,
    default: 0
  },
  religious_counter:{
    type:Number,
    required: true,
    default: 0
  },
  historic_counter:{
    type:Number,
    required: true,
    default: 0
  },
  themePark_counter:{
    type:Number,
    required: true,
    default: 0
  },
  entertainment_counter:{
    type:Number,
    required: true,
    default: 0
  },
  architecture_counter:{
    type:Number,
    required: true,
    default: 0
  },
});

module.exports = mongoose.model("Places_Counter", PlacesCounter_Schema);

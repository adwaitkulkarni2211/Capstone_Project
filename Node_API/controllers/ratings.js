const Rating = require("../models/ratings");
const mongoose = require("mongoose");

exports.saveRating = async (req, res) => {
  //check if rating already exists
  try {
    const rating = await Rating.findOne({
      userid: req.profile._id,
      placeid: req.place.features__id,
    });

    if (rating) {
      return res.json({
        error: "Rating already exists",
      });
    }

    const newRating = new Rating({
      userid: req.profile._id,
      placeid: req.place.features__id,
      rating: req.body.rating,
      tags: req.body.tags,
    });

    const saved_rating = await newRating.save();

    res.json({
      userid: saved_rating.userid,
      placeid: saved_rating.placeid,
      rating: saved_rating.rating,
      tags: saved_rating.tags,
    });
  } catch (err) {
    console.log("SAVERATING ERR:", err);
    return res.json({
      error: err,
    });
  }
};

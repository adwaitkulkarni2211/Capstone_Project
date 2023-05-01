const Trip = require("../models/trip");
const mongoose = require("mongoose");

exports.createTrip = async (req, res) => {
  try {
    const newTrip = new Trip({
      placeid: req.place.features__id,
      adminid: req.profile._id,
      members: [req.profile._id],
    });

    const savedTrip = await newTrip.save();

    res.json({
      placeid: savedTrip.placeid,
      adminid: savedTrip.adminid,
      members: savedTrip.members,
    });
  } catch (error) {
    console.log("CREATETRIP ERR", error);
    return res.json({
      error: error,
    });
  }
};

const Trip = require("../models/trip");
const mongoose = require("mongoose");

exports.getTripById = async (req, res, next, id) => {
  Trip.findById(id)
    .then((trip) => {
      if (!trip) {
        throw "trip not found in DB";
      }
      req.trip = trip;
      next();
    })
    .catch((err) => {
      if (err) {
        return res.status(400).json({
          error: "trip not found in DB",
        });
      }
    });
};

exports.isAuthenticatedToEnterTrip = async (req, res) => {
  try {
    const userFound = req.trip.members.includes(req.profile._id);
    if (userFound) {
      res.json({
        userid: req.profile._id,
        trip: req.trip._id,
      });
    } else {
      throw "NOT AUTHENTICATED TO ENTER TRIP";
    }
  } catch (error) {
    console.log("NOT AUTHENTICATED TO ENTER TRIP", error);
    return res.status(400).json({
      error: error,
    });
  }
};

exports.createTrip = async (req, res) => {
  try {
    const newTrip = new Trip({
      name: req.body.name,
      placeid: req.place.features__id,
      adminid: req.profile._id,
      members: [req.profile._id],
    });

    const savedTrip = await newTrip.save();

    res.json({
      name: savedTrip.name,
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

exports.getMyTrips = async (req, res) => {
  try {
    const myTrips = await Trip.find({ members: { $in: [req.profile._id] } });

    if (!myTrips) {
      throw "NO TRIPS FOUND";
    }

    res.json({
      myTrips: myTrips,
    });
  } catch (error) {
    console.log("GETMYTRIPS ERROR: ", error);
    return res.status(400).json({
      error: error,
    });
  }
};

exports.storeMessage = async (req, res) => {
  const newMessages = [...req.body.currentTrip.messages, req.body.newMessage];
  try {
    await Trip.findByIdAndUpdate(
      { _id: req.body.currentTrip._id },
      { messages: newMessages }
    );

    const updatedTrip = await Trip.findById(req.body.currentTrip._id);

    res.json({
      _id: updatedTrip._id,
      messages: updatedTrip.messages,
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

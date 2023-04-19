const New_Places = require("../models/new_places");

exports.getPlaceById = (req, res, next, id) => {
  New_Places.findOne({ features__id: id })
    .then((place) => {
      if (!place) {
        return res.status(400).json({
          error: "place not found in DB",
        });
      }
      req.place = place;
      next();
    })
    .catch((err) => {
      if (err) {
        return res.status(400).json({
          error: "place not found in DB",
        });
      }
    });
};

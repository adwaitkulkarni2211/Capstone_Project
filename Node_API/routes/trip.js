const express = require("express");
const router = express.Router();
const { getUserById } = require("../controllers/user");
const { getPlaceById } = require("../controllers/new_places");
const { createTrip } = require("../controllers/trip");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

router.param("adminid", getUserById);
router.param("placeid", getPlaceById);

router.post(
  "/trip/:adminid/:placeid/createTrip",
  isSignedIn,
  isAuthenticated,
  createTrip
);

module.exports = router;

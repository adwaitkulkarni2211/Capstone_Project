const express = require("express");
const router = express.Router();
const { getUserById } = require("../controllers/user");
const { getPlaceById } = require("../controllers/new_places");
const {
  createTrip,
  getTripById,
  isAuthenticatedToEnterTrip,
  getMyTrips,
} = require("../controllers/trip");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

router.param("adminid", getUserById);
router.param("userid", getUserById);
router.param("placeid", getPlaceById);
router.param("tripid", getTripById);

router.post(
  "/trip/:adminid/:placeid/createTrip",
  isSignedIn,
  isAuthenticated,
  createTrip
);

router.get(
  "/trip/:userid/:tripid/isAuthenticatedToEnterTrip",
  isSignedIn,
  isAuthenticated,
  isAuthenticatedToEnterTrip
);

router.get("/trip/:userid/getMyTrips", isSignedIn, isAuthenticated, getMyTrips);

module.exports = router;

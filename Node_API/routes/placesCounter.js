const express = require("express");
const { getUserById, addVisitedPlaces } = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const router = express.Router();
router.param("userid", getUserById);
router.post(
    "/placesCounter/:userid/updatePlacesCounter",
    isSignedIn,
    isAuthenticated,
    addVisitedPlaces
);

module.exports = router;
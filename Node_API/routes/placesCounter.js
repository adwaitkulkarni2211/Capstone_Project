const express = require("express");
const { getUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { updatePlacesCounters } = require("../controllers/placesCounter");
const router = express.Router();

router.param("userid", getUserById);
router.post(
    "/placesCounter/:userid/updatePlacesCounter",
    isSignedIn,
    isAuthenticated,
    updatePlacesCounters
);

module.exports = router;
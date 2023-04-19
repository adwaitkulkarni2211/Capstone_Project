const express = require("express");
const router = express.Router();
const { getUserById } = require("../controllers/user");
const { getPlaceById } = require("../controllers/new_places");
const { saveRating } = require("../controllers/ratings");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

router.param("userid", getUserById);
router.param("placeid", getPlaceById);

router.post(
  "/rating/:userid/:placeid/saveRating",
  isSignedIn,
  isAuthenticated,
  saveRating
);

module.exports = router;

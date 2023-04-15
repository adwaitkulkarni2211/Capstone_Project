const express = require("express");
const router = express.Router();
const { addVisitedPlaces, getUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

router.param("userid", getUserById);

router.put(
  "/user/:userid/addVisitedPlaces",
  isSignedIn,
  isAuthenticated,
  addVisitedPlaces
);

module.exports = router;

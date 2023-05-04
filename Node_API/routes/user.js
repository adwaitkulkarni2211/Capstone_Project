const express = require("express");
const router = express.Router();
const {
  addVisitedPlaces,
  getUserById,
  getUsersByName,
} = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

router.param("userid", getUserById);

router.put(
  "/user/:userid/addVisitedPlaces",
  isSignedIn,
  isAuthenticated,
  addVisitedPlaces
);

router.post(
  "/user/:userid/getUsersByName",
  isSignedIn,
  isAuthenticated,
  getUsersByName
);

module.exports = router;

var express = require("express");
var router = express.Router();
const { check } = require("express-validator");
const { signout, signup, signin } = require("../controllers/auth");

router.post(
  "/signup",
  [
    //using express validator for this validation
    check("name")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long"),

    check("email").isEmail().withMessage("email is required"),

    check("password")
      .isLength({ min: 3 })
      .withMessage("password must be at least 3 characters long"),
  ],
  signup
);

router.post(
  "/signin",
  [
    //using express validator for this validation
    check("email").isEmail().withMessage("email is required"),

    check("password").isLength({ min: 3 }).withMessage("password is required"),
  ],
  signin
);

router.get("/signout", signout);

module.exports = router;

const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt1 = require("jsonwebtoken");
var { expressjwt: jwt } = require("express-jwt");

exports.signup = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = new User(req.body);

  try {
    const saved_user = await user.save();
    res.json({
      name: saved_user.name,
      email: saved_user.email,
      id: saved_user._id,
    });
  } catch (err) {
    console.log("SIGNUP ERROR:", err);
    return res.status(400).json({
      error: "NOT able to save user in the DB",
    });
  }
};

exports.signin = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        error: "User email not found",
      });
    }
    if (!user.authenticate(req.body.password)) {
      return res.status(401).json({
        error: "Email and password don't match",
      });
    }

    //creating token
    const token = jwt1.sign({ _id: user._id }, process.env.SECRET);
    //putting token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });
    //send resopnse to front end
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: err,
    });
  }
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signed out successfully",
  });
};

//protected routes
exports.isSignedIn = jwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not an admin, access denied",
    });
  }
  next();
};

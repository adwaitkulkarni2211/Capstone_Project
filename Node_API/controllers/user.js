const User = require("../models/user");

exports.getUserById = (req, res, next, id) => {
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          error: "user not found in DB",
        });
      }
      req.profile = user;
      next();
    })
    .catch((err) => {
      if (err) {
        return res.status(400).json({
          error: "user not found in DB",
        });
      }
    });
};


exports.addVisitedPlaces = async (req, res) => {
  try {
    const origHistory = req.profile.history;
    const newHistory = req.body.history;
    const history = [...origHistory, ...newHistory];

    // logic to add newHistory to placesCounter schema 

    

    const origUser = await User.findByIdAndUpdate(
      { _id: req.profile._id },
      { history: history }
    );

    const updatedUser = await User.findOne({ _id: req.profile._id });

    res.json({
      name: updatedUser.name,
      email: updatedUser.email,
      history: updatedUser.history,
    });
  } catch (err) {
    console.log("ERROR IN SAVING HISTORY");
    return res.status(400).json({
      error: "Could not save history in database",
    });
  }
};

exports.getUsersByName = async (req, res) => {
  try {
    const regex = new RegExp(`.*${req.body.name.split("").join(".*")}.*`, "i");
    const users = await User.find({ name: regex }).sort({ name: 1 });

    if (users.length === 0) {
      throw "NO USER FOUND.";
    }

    res.json({
      users: users,
    });
  } catch (error) {
    console.log("GET USER BY NAME ERROR: ", error);
    return res.status(400).json({
      error: error,
    });
  }
};

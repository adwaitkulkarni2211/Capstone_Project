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
    console.log(history);

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

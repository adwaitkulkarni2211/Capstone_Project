const User = require("../models/user");
const Places_Counter = require("../models/placesCounter");
const user = require("../models/user");
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

    newHistory.forEach(async (item) =>{
      const place_id = item.placeid;
      const rating = item.rating;
      let tags_counter = 0; 
      const tagCount = {};
      tagCount["architecture"] = 0;
      tagCount["nature"] = 0;
      tagCount["trek"] = 0;
      tagCount["religious"] = 0;
      tagCount["historic"] = 0;
      tagCount["themepark"] = 0;
      tagCount["entertainment"] = 0;
      const tags = item.tags;
      tags.forEach((tag) =>{
        tagCount[tag]++;
        tags_counter++;
      })

      const exists = await Places_Counter.exists({place_id : place_id})

        if(exists){
          await Places_Counter.updateOne(
            { _id: exists._id },
            {
              $inc: {
                reviews_counter: 1,
                tags_counter: tags_counter,
                architecture_counter: tagCount["architecture"],
                nature_counter: tagCount["nature"],
                trek_counter: tagCount["trek"],
                religious_counter: tagCount["religious"],
                historic_counter: tagCount["historic"],
                themePark_counter: tagCount["themepark"],
                entertainment_counter: tagCount["entertainment"]
              },
              $set: {
                average_rating: (exists.average_rating * exists.reviews_counter + rating) / (exists.reviews_counter + 1)
              }
            }
          );

        }else {
          await Places_Counter.create({
            place_id,
            reviews_counter: 1,
            average_rating: rating,
            tags_counter,
            nature_counter: tagCount["nature"],
            trek_counter: tagCount["trek"],
            religious_counter: tagCount["religious"],
            historic_counter: tagCount["historic"],
            themePark_counter: tagCount["themepark"],
            entertainment_counter: tagCount["entertainment"],
            architecture_counter: tagCount["architecture"]
          });
        }
      

    })

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

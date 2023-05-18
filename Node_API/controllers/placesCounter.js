const Places_Counter = require("../models/placesCounter");
const user = require("../models/user");

exports.updatePlacesCounters = async (req, res) => {
  const newHistory = req.body.history;
  try {
    newHistory.forEach(async (item) => {
      const place_id = item.placeid;
      const rating = item.rating;
      let tags_counter = 0;
      const tagCount = {};
      tagCount["architecture"] = 0;
      tagCount["nature"] = 0;
      tagCount["trek"] = 0;
      tagCount["religious"] = 0;
      tagCount["historic"] = 0;
      tagCount["themePark"] = 0;
      tagCount["entertainment"] = 0;
      const tags = item.tags;
      tags.forEach((tag) => {
        tagCount[tag]++;
        tags_counter++;
      });

      const exists = await Places_Counter.exists({ place_id: place_id });
      console.log(exists);

      // 6915415

      if (exists) {
        const place_counter = await Places_Counter.findOne({ _id: exists._id });

        await Places_Counter.updateOne(
          { place_id: place_id },
          {
            $set: {
              average_rating:
                (parseInt(place_counter.average_rating) *
                  parseInt(place_counter.reviews_counter) +
                  parseInt(rating)) /
                parseInt(place_counter.reviews_counter + 1),
            },
            $inc: {
              reviews_counter: 1,
              tags_counter: tags_counter,
              architecture_counter: tagCount["architecture"],
              nature_counter: tagCount["nature"],
              trek_counter: tagCount["trek"],
              religious_counter: tagCount["religious"],
              historic_counter: tagCount["historic"],
              themePark_counter: tagCount["themePark"],
              entertainment_counter: tagCount["entertainment"],
            },
          }
        );
      } else {
        await Places_Counter.create({
          place_id,
          reviews_counter: 1,
          average_rating: rating,
          tags_counter,
          nature_counter: tagCount["nature"],
          trek_counter: tagCount["trek"],
          religious_counter: tagCount["religious"],
          historic_counter: tagCount["historic"],
          themePark_counter: tagCount["themePark"],
          entertainment_counter: tagCount["entertainment"],
          architecture_counter: tagCount["architecture"],
        });
      }
    });

    res.json({
      message: "successfully updated place counter",
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      error: e,
    });
  }
};

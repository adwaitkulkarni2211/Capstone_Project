//Importing libraries
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

//Importing Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const ratingRoutes = require("./routes/ratings");
const tripRoutes = require("./routes/trip");

//DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch(() => {
    console.log("ERROR CONNECTING TO DB");
  });

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

//Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", ratingRoutes);
app.use("/api", tripRoutes);

//Starting server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

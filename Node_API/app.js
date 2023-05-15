//Importing libraries
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const io = require("./socket");

//Importing Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const ratingRoutes = require("./routes/ratings");
const tripRoutes = require("./routes/trip");
const updatePlacesCounterRoutes = require("./routes/placesCounter")

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
app.use("/api", updatePlacesCounterRoutes)

//socket.io stuff
const server = require("http").createServer(app);

io.attach(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

//Starting server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

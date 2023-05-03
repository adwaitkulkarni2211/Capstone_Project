//Importing libraries
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const io = require("./socket");

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

//socket.io stuff
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3001",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("User Connected", socket.id);

//   socket.on("join_room", (data) => {
//     socket.join(data);
//     console.log(`User with id ${socket.id} joined the room ${data}`);
//   });

//   socket.on("to_backend", (data) => {
//     console.log(
//       `User with socket id ${socket.id} has sent the message: ${JSON.stringify(
//         data
//       )}`
//     );

//     socket.to(JSON.stringify(data.room)).emit("from_backend", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected", socket.id);
//   });
// });
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

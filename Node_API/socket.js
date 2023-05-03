const io = require("socket.io")();

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with id ${socket.id} joined the room ${data}`);
  });

  socket.on("to_backend", (data) => {
    console.log(
      `User with socket id ${socket.id} has sent the message: ${JSON.stringify(
        data
      )}`
    );

    socket.to(JSON.stringify(data.room)).emit("from_backend", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

module.exports = io;

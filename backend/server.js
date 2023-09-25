const express = require("express");
// const data = require("./data/data");
const dotenv = require("dotenv");
const connectDatabase = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandlers");

const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

app.use(express.json());
dotenv.config();

connectDatabase();

// app.get("/chats", (req, res) => {
//   res.send(data);
// });

app.use("/api/user", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

// -----------------deployment code setup----------------------
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "frontend", "build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}
// ---------------------------------------

// development ------------------
const port = process.env.PORT || 5000;
httpServer.listen(5000, (req, res) => {
  console.log(`your server is up on ${port}`);
});
// ------------ ------------------

app.use(notFound); // the error which is thrown in this function gets caught by below middleware
app.use(errorHandler);
io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (_id) => {
    socket.join(_id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.members) return console.log("chat.members not defined");

    chat.members.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

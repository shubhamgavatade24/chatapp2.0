"use strict";

var express = require("express"); // const data = require("./data/data");


var dotenv = require("dotenv");

var connectDatabase = require("./config/db");

var userRoutes = require("./routes/userRoutes");

var chatRoutes = require("./routes/chatRoutes");

var messageRoutes = require("./routes/messageRoutes");

var _require = require("./middleware/errorHandlers"),
    notFound = _require.notFound,
    errorHandler = _require.errorHandler;

var _require2 = require("http"),
    createServer = _require2.createServer;

var _require3 = require("socket.io"),
    Server = _require3.Server;

var path = require("path");

var app = express();
var httpServer = createServer(app);
var io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000" // credentials: true,

  }
});
app.use(express.json());
dotenv.config();
connectDatabase(); // app.get("/chats", (req, res) => {
//   res.send(data);
// });

app.use("/api/user", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes); // -----------------deployment code setup----------------------

var __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express["static"](path.join(__dirname1, "frontend", "build")));
  app.get("*", function (req, res) {
    return res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", function (req, res) {
    res.send("API is running..");
  });
} // ---------------------------------------
// development ------------------


var port = process.env.PORT || 5000;
httpServer.listen(5000, function (req, res) {
  console.log("your server is up on ".concat(port));
}); // ------------ ------------------

app.use(notFound); // the error which is thrown in this function gets caught by below middleware

app.use(errorHandler);
io.on("connection", function (socket) {
  console.log("Connected to socket.io");
  socket.on("setup", function (_id) {
    socket.join(_id);
    socket.emit("connected");
  });
  socket.on("join chat", function (room) {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("new message", function (newMessageRecieved) {
    var chat = newMessageRecieved.chat;
    if (!chat.members) return console.log("chat.members not defined");
    chat.members.forEach(function (user) {
      if (user._id == newMessageRecieved.sender._id) return;
      socket["in"](user._id).emit("message recieved", newMessageRecieved);
    });
  });
  socket.off("setup", function () {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
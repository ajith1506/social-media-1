const express = require("express");
const db = require("./config/db");
const app = express();
const users = require("./Routes/api/users");
const chat = require("./Routes/api/chat");
const posts = require("./Routes/api/posts");
const message = require("./Routes/api/message");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport");
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);

dotenv.config(); // Load environment variables

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173/",
  "https://chat-app-akl.netlify.app",
];

// Socket.IO setup with CORS
const io = socketio(server, {
  pingTimeout: 60000,
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS setup for Express
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Passport middleware for authentication
app.use(passport.initialize());
require("./config/password")(passport);

// Routes
app.use("/api/users", users);
app.use("/api/post", posts);
app.use("/api/chat", chat);
app.use("/api/message", message);

// Socket.IO events
io.on("connection", (socket) => {
  console.log("User Connected");

  socket.on("setup", (userData) => {
    socket.join(userData.id);
    console.log("User setup:", userData.id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room:", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

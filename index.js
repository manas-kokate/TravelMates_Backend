import http from "http";
import app from "./src/app.js";
import { Server } from "socket.io";
import connectDB from "./src/config/db.js";
import Connection from "./src/models/connection.js";

const server = http.createServer(app);
const onlineUsers = new Map();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected ", socket.id);

  // register user with socket id
  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
  })

  //send message to a user
  socket.on("sendMessage", async (data) => {
    try {
      const { receiverId, content } = data;

      const connection = await Connection.findOne({
        status: "accepted",
        $or: [
          { senderId: req.id, receiverId },
          { senderId: receiverId, receiverId: req.id }
        ]
      });

      if (!connection) {
        return socket.emit("error", "Not allowed to chat");
      }

      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", {
          senderId,
          message,
        });
      }
    } catch (error) {
      return socket.emit("error", "Internal Server Error.." + error.message);
    }
  })

  if (receiver.isBot) {
    socket.emit("receive_message", botMessage);
  }

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
})

server.listen(3000, () => {
  connectDB();
  console.log("Server is running....");
})


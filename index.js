import http from "http";
import app from "./src/app.js";
import { Server } from "socket.io";
import connectDB from "./src/config/db.js";
import Connection from "./src/models/connection.js";
import Message from "./src/models/message.js";

const server = http.createServer(app);
const onlineUsers = new Map();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected ", socket.id);

  socket.on("join", (userId) => {
    if (!userId) return;
    socket.data.userId = String(userId);
    onlineUsers.set(String(userId), socket.id);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const senderId = socket.data.userId;
      const { receiverId, content } = data || {};

      if (!senderId || !receiverId || !content?.trim()) {
        return socket.emit("error", { message: "Missing sender, receiver, or message content" });
      }

      const connection = await Connection.findOne({
        status: "accepted",
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      });

      if (!connection) {
        return socket.emit("error", { message: "Not allowed to chat" });
      }

      const newMessage = await Message.create({
        senderId,
        receiverId,
        content: content.trim(),
      });

      const payload = {
        _id: String(newMessage._id),
        senderId,
        receiverId,
        content: newMessage.content,
        createdAt: newMessage.createdAt,
      };

      socket.emit("message_sent", payload);

      const receiverSocketId = onlineUsers.get(String(receiverId));
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", payload);
      }
    } catch (error) {
      return socket.emit("error", { message: "Internal Server Error: " + error.message });
    }
  });

  socket.on("disconnect", () => {
    const uid = socket.data.userId;
    if (uid && onlineUsers.get(uid) === socket.id) {
      onlineUsers.delete(uid);
    }
    console.log("User Disconnected");
  });
});

server.listen(3000, () => {
  connectDB();
  console.log("Server is running....");
});

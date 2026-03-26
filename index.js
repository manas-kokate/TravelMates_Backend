import http from "http";
import app from "./src/app.js";
import {Server} from "socket.io";
import connectDB from "./src/config/db.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection",(socket)=>{
  console.log("User connected ", socket.id);
  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
})

server.listen(3000,()=>{
  connectDB();
  console.log("Server is running....");
})


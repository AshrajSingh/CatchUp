import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import http from 'http'
import { Server } from 'socket.io'
import loginRoute from './routes/loginRoute.js'
import signupRoute from './routes/signupRoute.js'
import contactRoute from './routes/contactRoute.js'
import profileRoute from './routes/profileRoute.js'
import messagesRoute, { setSocketIO } from './routes/messagesRoute.js'
import dotenv from "dotenv"

dotenv.config();

const app = express()
app.use(express.json())
app.use(cors());

// Create HTTP server and attach Socket.IO
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

// Pass Socket.IO instance to messagesRoute
setSocketIO(io);

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  // User joins a room (e.g., a conversation)
  socket.on('join-room', (data) => {
    const { roomId, userId } = data;
    socket.join(roomId);
    console.log(`✅ User ${userId} joined room ${roomId} (socket.id: ${socket.id})`);
    console.log(`📊 Sockets in room ${roomId}:`, io.sockets.adapter.rooms.get(roomId)?.size);
  });

  // User leaves a room
  socket.on('leave-room', (data) => {
    const { roomId } = data;
    socket.leave(roomId);
    console.log(`❌ User left room ${roomId}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

app.use(loginRoute)
app.use(signupRoute)
app.use(contactRoute)
app.use(messagesRoute)
app.use(profileRoute)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error(err));

const PORT = 5000;
server.listen(process.env.PORT || PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || PORT}`);
});
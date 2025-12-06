import express from 'express';
import mongoose from 'mongoose';
import { User } from '../models/userModel.js';
import userAuthentication from '../middlewares/userValidation.js';
import { Message } from '../models/messageModel.js';

let io; // Will be set from server.js

const app = express();
app.use(express.json());
const router = express.Router();

// Function to set io instance (called from server.js)
export function setSocketIO(socketIO) {
    io = socketIO;
}

// Helper function to create consistent roomId for 1:1 chat
function createRoomId(userId1, userId2) {
    // Sort IDs to ensure same roomId regardless of who sends first
    return [userId1, userId2].sort().join('-');
}

router.get('/messages/:contactId', userAuthentication, async (req, res) => {
    try {
        const { contactId } = req.params;
        const userId = req.user.user_id

        console.log("roomId: ", contactId)

        // Create deterministic roomId
        const roomId = createRoomId(userId, contactId);

        const savedMessages = await Message.find({ roomId });
        console.log("saved messages: ", savedMessages);
        // Return the array directly so clients receive an Array (not an object wrapper)
        res.status(200).json(savedMessages);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
})

router.post('/message/add', userAuthentication, async (req, res) => {
    const userId = req.user.user_id;
    const { receiverId, message, timeStamp, senderId } = req.body;
    console.log("message payload: ", req.body);
    console.log("userId from auth:", userId, "receiverId from body:", receiverId);

    try {
        // Create deterministic roomId
        const roomId = createRoomId(userId, receiverId);
        console.log(`📝 Creating message for room: ${roomId}`);

        const newMessage = await Message.create({
            roomId: roomId,
            senderId: senderId,
            message: message,
            timeStamp: timeStamp
        });

        console.log("message saved: ", newMessage);

        // Emit the message to all clients in this room via Socket.IO
        if (io) {
            const messageObj = newMessage.toObject ? newMessage.toObject() : newMessage;
            io.to(roomId).emit('receive-message', messageObj);
            io.to(senderId).emit('receive-message', messageObj);
            console.log(`🚀 Emitted message to room: ${roomId}`, messageObj);
            
            // Log how many sockets are in this room
            const roomSockets = io.sockets.adapter.rooms.get(roomId);
            console.log(`📊 Sockets in room ${roomId}: ${roomSockets ? roomSockets.size : 0}`);
        } else {
            console.error('❌ Socket.IO instance not available!');
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add message' });
    }
})

export default router
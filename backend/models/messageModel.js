import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  // Identifier for the conversation/room. For 1:1 you can use the contact user id or a deterministic room id.
  roomId: { type: String, required: true, index: true },

  // Sender user id
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },

  // Message text (keep content simple for now)
  message: { type: String, default: '' },

  // Message type (allows future extension for images/files)
  type: { type: String, enum: ['text', 'image', 'file', 'system'], default: 'text' },

  timeStamp: { type: Date, default: Date.now, required: true }

}, {
  timestamps: true
});

// Helpful index to fetch recent messages by room quickly
MessageSchema.index({ roomId: 1, createdAt: -1 });

export const Message = mongoose.model('Message', MessageSchema);
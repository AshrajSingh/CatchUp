import mongoose from "mongoose";
const defaultPic = '../assets/male-profile-icons/male-user-default-pic.jpg';
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    bio: { type: String },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    contactId: { type: String, unique: true, sparse: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status: { type: String, default: 'online' },
    profilePicUrl: { type: String, default: defaultPic }
});

export const User = mongoose.model('Users', UserSchema);
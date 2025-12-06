import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';


const app = express();
app.use(express.json());
const router = express.Router()

router.post('/signup', async (req, res) => {
    const { username, bio, password, contactId, gender } = req.body

    try {
        const existingUser = await User.findOne({ username: username })

        if (existingUser) return res.status(400).json({ message: 'Username already exists' })

        const user = await User.create({ username, bio, password, gender, contactId })
        const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET)
        res.status(201).json({ username: user.username, gender: user.gender, contactId: user.contactId, user_id: user._id, token, message: 'User signed up successfully' })
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to sign up user' })
        console.error(error)
    }
})

export default router

import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';


const app = express();
app.use(express.json());
const router = express.Router()

router.post('/login', async function (req, res) {
    const { username, password } = req.body

    try {
        const existingUser = await User.findOne({ username: username })
        
        // Check if user exists first
        if (!existingUser) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (existingUser.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { user_id: existingUser._id },
            process.env.JWT_SECRET
        )

        res.json({
            message: 'logIn successful',
            user_id: existingUser.id,
            username: existingUser.username,
            contactId: existingUser.contactId,
            token: token
        })
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' })
    }
})

export default router
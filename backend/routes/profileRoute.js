import express from 'express';
import { User } from '../models/userModel.js';
import userAuthentication from '../middlewares/userValidation.js';


const app = express();
app.use(express.json());
const router = express.Router()

router.get('/profile', userAuthentication, async function (req, res) {
    try {
        const userId = req.user.user_id;
        const user = await User.findById(userId)
        const profileData = {
            username: user.username,
            bio: user.bio,
            gender:user.gender,
            contactId: user.contactId,
            profilePicUrl: user.profilePicUrl,
            createdAt: user.createdAt,
            unread: user.unread,
            status: user.status
        }

        console.log("profile from route: ", profileData)
        res.json(profileData);

    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
})

router.post('/profile/profilePic/update', userAuthentication, async (req, res) => {
    try {
        const userId = req.user.user_id
        const { profilePicUrl } = req.body

        console.log("profilePicUrl in route: ", profilePicUrl)

        const updated = await User.findOneAndUpdate(
            { _id: userId },
            { $set: { profilePicUrl } },
            { new: true }
        )
        res.json(updated)
    }
    catch (error) {
        console.error('Update profilePic error:', error);
        res.status(500).json({ message: 'Failed to update profilePic' });
    }
})

export default router
import express from 'express';
import { User } from '../models/userModel.js';
import userAuthentication from '../middlewares/userValidation.js';
import { Contacts } from '../models/contactsModel.js';


const app = express();
app.use(express.json());
const router = express.Router()

router.get('/contacts', userAuthentication, async (req, res) => {
    try {
        //Finding all the contacts for the logged in user
        const userId = req.user.user_id

        const savedContacts = await Contacts.find({ userId }).populate('contacts', 'username bio contactId status profilePicUrl createdAt')
        console.log("saved contacts: ", savedContacts)
        res.status(200).json(savedContacts)
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch contacts' })
    }
})

router.post('/contact/add', userAuthentication, async function (req, res) {
    const userId = req.user.user_id; // MongoDB ObjectId of current user
    let { contactId } = req.body;
    console.log("contactId in route: ", contactId)

    // Defensive: frontend might accidentally pass a ref object ({ current: '...' })
    if (contactId && typeof contactId === 'object' && 'current' in contactId) {
        contactId = contactId.current;
    }

    if (!contactId) return res.status(400).json({ message: 'contactId is required' });

    // Normalize: allow digits and dashes in provided contactId but count digits
    const digits = String(contactId).replace(/[^0-9]/g, '');
    if (digits.length !== 10) return res.status(400).json({ message: 'Invalid contactId format' });

    try {

        console.log("type of contactId in route:", typeof contactId)

        // Find user by the application-level contactId field
        const contactUser = await User.findOne({ contactId: String(contactId) });
        console.log("contactUser._id: ", contactUser)
        if (!contactUser) return res.status(404).json({ message: 'User does not exist' });

        // Now prevent adding yourself by comparing ObjectIds
        if (String(contactUser._id) === String(userId)) {
            return res.status(400).json({ message: 'Cannot add yourself' });
        }

        // Add contactUser._id to the current user's Contacts document (store ObjectId refs)
        const updated = await Contacts.findOneAndUpdate(
            { userId },
            { $addToSet: { contacts: contactUser._id } },
            { upsert: true, new: true }
        ).populate('contacts', 'username bio contactId status unreadCount profilePicUrl createdAt');

        await Contacts.findOneAndUpdate(
            { userId: contactUser._id },
            { $addToSet: { contacts: userId } },
            { upsert: true, new: true }
        ).populate('contacts', 'username bio contactId status unreadCount profilePicUrl createdAt');

        return res.json({ message: 'Contact added successfully', contacts: updated.contacts });
    } catch (error) {
        console.error('Add contact error:', error);
        return res.status(500).json({ message: 'Failed to add contact' });
    }
})

router.delete('/contact/delete/:deleteUserId', userAuthentication, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const deleteUserId = req.params.deleteUserId;
        console.log('Deleting contactId: ', deleteUserId)
        const response = await Contacts.findOneAndUpdate({ userId }, { $pull: { contacts: deleteUserId } }, { new: true });
        res.json(response)
    }
    catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({ message: 'Failed to delete contact' });
    }
})

export default router
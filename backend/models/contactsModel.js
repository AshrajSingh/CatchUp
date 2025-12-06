import mongoose from 'mongoose';

const ContactsSchema = new mongoose.Schema({
    // Reference to the user this contacts document belongs to
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true, unique: true },

    // Array of user _id references representing contacts of userId
    contacts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        }
    ]
}, {
    timestamps: true
});

// Optional: index userId for faster lookups
ContactsSchema.index({ userId: 1 });

export const Contacts = mongoose.model('Contacts', ContactsSchema);
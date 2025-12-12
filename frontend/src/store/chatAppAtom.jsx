import { replace, useNavigate } from "react-router-dom"
import { atom } from "recoil"
const apiURL = 'http://localhost:5000'

export const signUpAtom = atom({
    key: 'signUpAtom',
    default: {
        username: '',
        bio: '',
        password: '',
    }
})
export const logInAtom = atom({
    key: 'logInAtom',
    default: {
        user_id: null,
        username: '',
        password: '',
    }
})
export const authAtom = atom({
    key: 'authAtom',
    default: {
        isLoggedIn: false,
        isChecked: false,
        user: null
    }
})
export const roomsAtom = atom({
    key: 'roomsAtom',
    default: [],
    effects: [
        ({ setSelf, onSet }) => {
            const users = localStorage.getItem("user")
            let user = null, token = null;
            try {
                user = users ? JSON.parse(users) : null;
                token = user?.token;
            } catch (e) {
                user = null;
                token = null;
            }
            if (!user || !token) {
                setSelf([]); // No user/token, just set empty and return
                return;
            }
            fetch(`${apiURL}/contacts`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }).then(res => res.json())
                .then(data => {
                    const contactData = data.flatMap(contactDoc =>
                        contactDoc.contacts.map(contact => ({
                            id: contact._id,
                            contactId: contact.contactId,
                            username: contact.username,
                            bio: contact.bio,
                            status: contact.status,
                            unread: contact.unread,
                            profilePicUrl: contact.profilePicUrl,
                            createdAt: contact.createdAt
                        }))
                    )
                    setSelf(contactData)
                    localStorage.setItem("Contacts", JSON.stringify(contactData))
                }).catch((error) => {
                    console.error('failed to fetch contacts:', error)
                })
            onSet(newValue => { localStorage.setItem("Contacts", JSON.stringify(newValue)) })
        }
    ]
})

export const messageAtom = atom({
    key: 'messageAtom',
    default: [],

})
export const userProfileAtom = atom({
    key: 'userProfileAtom',
    default: []
})
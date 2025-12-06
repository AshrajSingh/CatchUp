import toast from "react-hot-toast";

const apiURL = 'http://localhost:5000'

export async function signInUser({ username, bio, password, gender }, contactId) {
    // Handle sign-in logic here
    console.log("Signing in with:", username, bio, password, gender, contactId);

    // You can add API calls or other logic here
    const response = await fetch(`${apiURL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, bio, password, gender, contactId })
    })
    try {

        const data = await response.json();
        console.log("signin backend response: ", data)
        if (!response.ok) {
            throw new Error(data.message);
        }

        return data
    } catch (error) {
        // throw new Error (error.message || 'Something Went wrong')
        console.error("Auth service error:", error);
        throw error; // Re-throw the error for further handling
    }
}

//--------------------------------------------------------------------------------------------------------

export async function logInUser({ username, password }) {
    console.log("Logging in with:", username, password);

    const logInResponse = await fetch(`${apiURL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })

    try {
        console.log("Response: ", logInResponse)
        const loginData = await logInResponse.json()

        if (!logInResponse.ok) {
            throw new Error(loginData.message)
        }

        return loginData;
    } catch (error) {
        throw error
    }
}

//------------------------------------------------------------------------------------------------------------

export async function addContact(contactId) {
    console.log("AddContact called: ", contactId)

    const users = localStorage.getItem("user")
    const user = JSON.parse(users)
    const token = user.token

    const response = await fetch(`${apiURL}/contact/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ contactId })
    })
    try {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message)
        }
        return data
    }
    catch (error) {
        console.error('Add contact error:', error)
        throw error; // Re-throw so caller can handle it or catch
    }
}

//------------------------------------------------------------------------------------------------------------
//remove contact function

//------------------------------------------------------------------------------------------------------------

//update profilePic function
export async function updateProfilePic(profilePicUrl) {
    console.log("profilePic form userAuth: ", profilePicUrl)

    const users = localStorage.getItem("user")
    const user = JSON.parse(users)
    const token = user.token

    const response = await fetch(`${apiURL}/profile/profilePic/update`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ profilePicUrl })
    })

    try {
        const data = await response.json()
        if (!response.ok) {
            throw new Error(data.message)
        }
        const userData = {
            username: data.username,
            bio: data.bio,
            profilePicUrl: data.profilePicUrl,
            contactId: data.contactId,
            createdAt: data.createdAt,
            status: data.status
        }
        console.log("update profile pic response: ", userData)

        return userData
    }
    catch (error) {
        console.error('update profile pic error: ', error)
    }
}

//------------------------------------------------------------------------------------------------------------
//get all the data for the profile

export async function getProfileData() {
    const users = localStorage.getItem("user")
    const user = JSON.parse(users)
    const token = user.token
    const response = await fetch(`${apiURL}/profile`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    try {
        const data = await response.json()
        if (!response.ok) {
            throw new Error(data.message)
        }
        return data
    }
    catch (error) {
        console.error('get profile data error: ', error)
    }
}

//------------------------------------------------------------------------------------------------------------
//add messages function
export async function addMessages(messages) {
    console.log("message form userAuth: ", messages)
    const users = localStorage.getItem("user")
    const user = JSON.parse(users)
    const token = user.token

    const response = await fetch(`${apiURL}/message/add`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(messages)
    })
    try {
        const messageData = await response.json()
        if (!response.ok) {
            throw new Error(messageData.message)
        }
        return messageData
    }
    catch (error) {
        console.error('Add message error: ', error)
    }
}
import Login from "../component/Login";
import { logInUser, signInUser } from "../frontendServices/userAuth";
import toast, { Toaster } from 'react-hot-toast';
import { useSetRecoilState } from "recoil";
import { authAtom, logInAtom } from "../store/chatAppAtom.jsx";
import { useNavigate } from "react-router-dom";
import { useGenerateContactId } from "../hooks/contactId.js";


export default function LoginPage() {
    const setAuth = useSetRecoilState(authAtom)
    const setLogin = useSetRecoilState(logInAtom)
    const navigate = useNavigate()

    console.log("LoginPage rendered...!!")

    function setUserdetails({ username, password }) {
        console.log("Username and password inside setUserdetails: ", username, password)

        const userData = {
            username: username.trim().replace(/^\s+/g, ''),
            password: password.trim().replace(/^\s+/g, '')
        };

        setLogin(userData)
        return userData
    }

    async function handleLogin({ username, password }) {
        console.log("username and password inside handleLogin: ", username, password)

        const userData = setUserdetails({ username, password })

        try {

            if (!userData.username || !userData.password) {
                toast.error("username or password is empty");
                return;
            }

            const response = await logInUser(userData)
            console.log("Response: ", response)


            //store user details in local storage
            localStorage.setItem("user", JSON.stringify({
                user_id: response.user_id,
                username: response.username,
                token: response.token,
                contactId: response.contactId
            }))

            setAuth({ isLoggedIn: true, isChecked: true, user: userData.username })
            localStorage.setItem("auth", JSON.stringify({ isLoggedIn: true, user: userData.username }))

            navigate('/dashboardPage', { replace: true })

            toast.success(response.message || 'Login Successful')

        } catch (error) {
            toast.error(error.message || 'Login failed. Please try again.');
            console.error("Login error:", error);
        }
    }

    async function handleSignup({ username, bio, password }) {
        console.log("handle signup called with: ", username, bio, password)

        const loadingId = toast.loading('Signing you up...')
        toast.dismiss(loadingId)

        const userData = setUserdetails({ username, bio, password })

        // basic validation
        if (!userData.username || !userData.bio || !userData.password) {
            return toast.error("Please fill in all fields")
        }

        try {
            //validate inputs
            const isValidData = signInSchema.safeParse(userData)

            if (!isValidData.success) {

                isValidData.error.issues.map((err) => toast.error(err.message));
                return;
            }

            //Generating unique contactId for user
            const contactId = useGenerateContactId();


            const response = await signInUser(userData, contactId)


            localStorage.setItem("user", JSON.stringify({
                isLoggedIn: true,
                username: username,
                user_id: response.user_id,
                token: response.token,
                contactId: contactId
            }))

            setAuth({ isLoggedIn: true, isChecked: true, user: username })
            navigate('/dashboardPage', { replace: true })

            toast.success('Signed up successfully!')

        } catch (error) {
            toast.dismiss(loadingId)
            // support Error objects and string messages
            // const message = error?.message || (typeof error === 'string' ? error : 'Signup failed')
            toast.error(error.message)
            console.error('Signup error:', error)
            throw error
        }
    }

    return (
        <>
            <Login onLogin={handleLogin} onSignup={handleSignup} />
            <Toaster
                position="top-right"
                toastOptions={{
                    success: {
                        duration: 3000,
                        style: {
                            background: '#4caf50',
                            color: '#fff',
                        },
                    },
                    error: {
                        duration: 2000,
                        style: {
                            background: '#ef5350',
                            color: '#fff',
                        },
                    },
                }}
            />
        </>
    )
}
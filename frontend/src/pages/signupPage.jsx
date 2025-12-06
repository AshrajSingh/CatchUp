import { useSetRecoilState } from "recoil"
import { authAtom, signUpAtom } from "../store/chatAppAtom"
import Signin from "../component/Signin"
import toast, { Toaster } from "react-hot-toast"
import { signInUser } from "../frontendServices/userAuth"
import { signInSchema } from "../validations/signupValidation"
import { replace, useNavigate } from "react-router-dom"
import { useGenerateContactId } from "../hooks/contactId"

export default function SignupPage() {
    const setSignup = useSetRecoilState(signUpAtom)
    const setAuth = useSetRecoilState(authAtom)
    const navigate = useNavigate()

    function setUserdetails({ username, bio, password, gender }) {
        // keep a simple normalized object and update recoil atom
        console.log("setUserdetails called with: ", username, bio, password, gender)

        const userData = {
            username: username?.trim(),
            bio: bio?.trim(),
            password: password,
            gender: gender
        }
        setSignup(userData)
        return userData
    }

    async function handleSignup({ username, bio, password, gender }) {
        console.log("handle signup called with: ", username, bio, password, gender)

        const loadingId = toast.loading('Signing you up...')
        toast.dismiss(loadingId)

        const userData = setUserdetails({ username, bio, password, gender })

        // basic validation
        if (!userData.username || !userData.password) {
            return toast.error("Username and password is required")
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
                gender:response.gender,
                user_id: response.user_id,
                contactId: contactId,
                token: response.token
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
            <Signin onSignup={handleSignup} />
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
                        duration: 4000,
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
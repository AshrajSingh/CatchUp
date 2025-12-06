import { useRef, useState } from 'react'
import '../stylesheets/login.css'
import { useNavigate } from 'react-router-dom'
export default function Signin({ onSignup }) {
    const navigate = useNavigate();
    const usernameRef = useRef('');
    const bioRef = useRef('');
    const passwordRef = useRef('');
    const genderRef = useRef('');
    const [gender, setGender] = useState('')
    const [loading, setLoading] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    function handleInputChange(e, ref) {
        ref.current = e.target.value;
    }

    async function signupUser() {
        const payload = {
            username: usernameRef.current,
            bio: bioRef.current,
            password: passwordRef.current,
            gender: gender
        }
        try {
            setLoading(true);
            await onSignup(payload);
        } catch (err) {
            console.error('Signup failed in Signin component:', err);
        } finally {
            setLoading(false);
        }
    }

    function handleLoginFlip() {
        setIsFlipped(true);
        setTimeout(() => {
            navigate('/login');
        }, 600); // match animation duration
    }

    return (
        <div className="flip-card">
            <div className={`flip-card-inner${isFlipped ? " flipped" : ""}`}>
                <div className="flip-card-front">
                    <div className='login-wrapper'>
                        <div className='signin-box'>
                            <h2 className="login-title">Sign Up</h2>
                            <p>Create a new account</p>
                            <input className="login-input" type="text" placeholder="Create Username" onChange={(e) => handleInputChange(e, usernameRef)} />
                            <input className="login-input" type="text" placeholder="Add a bio" onChange={(e) => handleInputChange(e, bioRef)} />
                            <input className="login-input" type="password" placeholder="Create a Password" onChange={(e) => handleInputChange(e, passwordRef)} />
                            <label>
                                <input
                                    type="radio"
                                    name='gender'
                                    value='male'
                                    checked={gender == 'male'}
                                    onChange={(e) => setGender(e.target.value)} />
                                <span>Male</span>
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name='gender'
                                    value='female'
                                    checked={gender == 'female'}
                                    onChange={(e) => setGender(e.target.value)} />
                                <span>Female</span>
                            </label>

                            <button className="login-button" onClick={signupUser} disabled={loading}>
                                {loading ? 'Signing up…' : 'SIGN UP'}
                            </button>

                        </div>
                        <div className="sign-up">
                            <h1 className="register-text">Have account?</h1>
                            <p>login and continue discovering the world</p>
                            <button className="signup-button" onClick={handleLoginFlip}>login</button>
                        </div>
                    </div>
                </div>
                <div className="flip-card-back">
                    {/* <div className="login-wrapper"> */}
                    <div className="login-box">
                        <h2 className="login-title">Redirecting to login...</h2>
                    </div>
                    {/* </div> */}
                </div>
            </div>
        </div>
    );
}
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../stylesheets/login.css'

export default function Login({ onLogin }) {
    const navigate = useNavigate();
    const [isFlipped, setIsFlipped] = useState(false);

    const usernameRef = useRef("");
    const passwordRef = useRef("");

    function handleInputChange(e, ref) {
        ref.current = e.target.value
    }

    function logInUser() {
        onLogin({ username: usernameRef.current, password: passwordRef.current })
    }

    function handleSignupClick() {
        setIsFlipped(true);
        setTimeout(() => {
            navigate('/signup');
        }, 600); 
        
    }

    return (
        <>
            <div className="flip-card">
                <div className={`flip-card-inner${isFlipped ? " flipped" : ""}`}>
                    <div className="flip-card-front">
                        <div className="login-wrapper">
                            <div className="login-box">
                                <h2 className="login-title">log in</h2>

                                {/*  Input fields for login */}
                                <input 
                                    className="login-input" 
                                    type="text" 
                                    placeholder="Username" 
                                    onChange={(e) => handleInputChange(e, usernameRef)} 
                                />
                                <input 
                                    className="login-input" 
                                    type="password" 
                                    placeholder="Password" 
                                    onChange={(e) => handleInputChange(e, passwordRef)} 
                                />

                                <div className="login-options">
                                    <button className="forgot-password">Forgot Password ?</button>
                                </div>

                                <button className="login-button" onClick={logInUser}>LOGIN</button>

                            </div>

                            <div className="sign-up">
                                <h1 className="register-text">New here ?</h1>
                                <p>Sign up and discover the world</p>
                                <button 
                                    className="signup-button" 
                                    onClick={handleSignupClick}
                                >
                                    Sign up
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flip-card-back">
                        {/* <div className="login-wrapper"> */}
                            <div className="signin-box">
                                <h2 className="login-title">Redirecting to signup...</h2>
                            </div>
                        {/* </div> */}
                    </div>

                </div>
            </div>

        </>
    );
}
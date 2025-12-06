import { useState } from "react";
import '../stylesheets/menubar.css'

export default function HamburgerMenu({onMenuOpen}) {
            const [isOpen, setIsOpen] = useState(false);

            const toggleMenu = () => {
                setIsOpen(!isOpen);
                onMenuOpen()
            };

            return (
                <div className="demo-container">                    
                    <button 
                        className={`hamburger ${isOpen ? 'active' : ''}`}
                        onClick={toggleMenu}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>)
}
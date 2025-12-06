import { useEffect, useState } from "react";
import "../stylesheets/chatInfo.css";
import { MALE_PROFILE_ICONS, FEMALE_PROFILE_ICONS } from "../frontendServices/profilePics";
import { useRecoilState } from "recoil";
import { roomsAtom } from "../store/chatAppAtom";



export const ChatInfo = ({ user, onProfilePicChange, onDeleteUser, onCloseProfile }) => {
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [showIcons, setShowIcons] = useState(false)
    console.log("MALE_PROFILE_ICONS: ", MALE_PROFILE_ICONS)

    console.log("user: ", user)

    const handleIconSelect = (iconName) => {
        setSelectedIcon(iconName.name);
        onProfilePicChange?.(iconName.emoji);
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${user.username}?`)) {
            onDeleteUser?.(user.id);
        }
    };

    const getStatusClass = (status) => {
        return `status-indicator status-${status}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
        // Output: Dec 4, 2025
    };

    return (
        <div className="user-profile-container">
            <p className="close-user-profile" onClick={onCloseProfile}><span>X</span></p>
            {/* User Details Section */}
            <div className="profile-card">
                <div className="profile-header">
                    <div className="avatar-wrapper">
                        <div className="avatar">
                            {user.profilePicUrl ? (
                                <img src={user.profilePicUrl} alt={user.username} />
                            ) : (
                                <img
                                    src={MALE_PROFILE_ICONS.find((icon) => icon.name === selectedIcon)?.emoji}
                                    alt="default"
                                />
                            )}
                        </div>
                        <div className={getStatusClass(user.status)}></div>
                    </div>

                    <h2 className="username">{user.username}</h2>
                    <span className="status-badge">{user.status.toUpperCase()}</span>
                </div>

                <div className="profile-details">
                    <div className="detail-row">
                        <span className="detail-icon">📞</span>
                        <span className="detail-label">Contact:</span>
                        <span className="detail-value">{user.contactId}</span>
                    </div>

                    <div className="detail-row">
                        <span className="detail-icon">📅</span>
                        <span className="detail-label">Created:</span>
                        <span className="detail-value">{formatDate(user.createdAt)}</span>
                    </div>
                </div>
            </div>
            <div className="profile-card">
                <h3 className="bio">Bio</h3>
                <p className="bio-content">{user.bio ? user.bio : "No bio"}</p>
            </div>

            {/* Profile Picture Selection */}
            <div className="profile-card">
                <h3 className="section-title">
                    <span className="section-icon">👤</span>
                    Change Profile Picture
                    <span className="select-icon-button" onClick={() => setShowIcons(true)} >Change profile</span>
                </h3>
                <div className="icon-grid">

                    {showIcons && user.gender === 'male' && MALE_PROFILE_ICONS.map((src, idx) => (
                        <img
                            key={idx}
                            src={src.emoji}
                            alt={`profile-pic-${idx + 1}`}
                            onClick={() => handleIconSelect(src)}
                            style={{ width: 60, height: 60, cursor: 'pointer', borderRadius: '50%' }}
                            className={`icon-button ${selectedIcon === src.name ? "selected" : ""}`}
                        />
                    ))}

                    {showIcons && user.gender === 'female' && FEMALE_PROFILE_ICONS.map((src, idx) => (
                        <img
                            key={idx}
                            src={src.emoji}
                            alt={`profile-pic-${idx + 1}`}
                            onClick={() => handleIconSelect(src)}
                            style={{ width: 60, height: 60, cursor: 'pointer', borderRadius: '50%' }}
                            className={`icon-button ${selectedIcon === src.name ? "selected" : ""}`}
                        />
                    ))}
                </div>
            </div>

            {/* Delete User Section */}
            <div className="profile-card danger-zone">
                <div className="danger-header">
                    <span className="danger-icon">⚠️</span>
                    <div>
                        <h3 className="section-title">Danger Zone</h3>
                        <p className="danger-description">
                            Permanently delete this contact. This action cannot be undone.
                        </p>
                    </div>
                </div>
                <button className="delete-button" onClick={handleDelete}>
                    <span className="button-icon">🗑️</span>
                    Delete Contact
                </button>
            </div>
        </div>
    );
};

export default ChatInfo;

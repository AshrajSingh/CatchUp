import React, { useEffect, useState } from 'react';
import '../stylesheets/sidebar.css';
import '../stylesheets/dashboardPage.css';
import { addContact, getProfileData } from '../frontendServices/userAuth';
import toast from 'react-hot-toast';
import AddRoom from './AddRoom';
import ChatInfo from './ChatInfo';

export default function Sidebar({ user, onProfilePicChange }) {
  const [showAddRoom, setShowAddRoom] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)

  function showAddRoomModal() {
    setShowAddRoom(true)
  }

  async function addRoom(contactId) {
    console.log("addRoom called");
    console.log("contactId: ", contactId)

    try {
      const response = await addContact(contactId)
      console.log("Response: ", response)

      // response.contacts is an array of contact objects from backend
      if (response && response.contacts && response.contacts.length > 0) {
        // Add the newly added contact to rooms
        const newContact = response.contacts[response.contacts.length - 1];
        setRooms(prevRooms => [...prevRooms, newContact])
      }

      //add contacts data to local storage

      setShowAddRoom(false)
      toast.success("Contact added successfully!")

    } catch (error) {
      toast.error(error.message)
      console.error("Add contact failed:", error)
      setShowAddRoom(false)
    }
  }
  function closeAddRoom() {
    setShowAddRoom(false)
  }
  function closeUserProfile(){
    setShowUserProfile(false)
  }

  return (
    <aside className="sidebar">
      {/* Navigation Section */}
      <nav className="sidebar-nav">
        <button
          className="nav-item"
          data-tooltip="Direct Messages"
        >
          💬<br />Chats
        </button>
        {/* <button
          className="nav-item"
          data-tooltip="Groups"
        >
          👥<br />Groups
        </button> */}
        <button
          className="nav-item primary"
          data-tooltip="New Chat"
          onClick={showAddRoomModal}
        >
          ➕<br />Create Chat
        </button>
      </nav>

      {/* Bottom Section */}
      <div className="sidebar-bottom">

        <button
          className="support-item"
          data-tooltip="Support"
        >
          <a href="mailto:support.balanceo@gmail.com">❓<br />Support</a>
        </button>

        <button className="support-item" data-tooltip="Feedback" >
          <a href="mailto:support.balanceo@gmail.com">💬<br />Feedback </a>
        </button>

        {/* User Profile */}
        <div className="user-profile" onClick={setShowUserProfile}>
          <img src={user?.profilePicUrl} alt={user?.username} />
          {/* <span className="profile-tooltip">{user.username}</span> */}
        </div>

      </div>
      {showAddRoom && (
        <div className="addRoom-overlay">
          <div className="addRoom-content">
            <AddRoom onAdd={addRoom} onCancel={closeAddRoom} />
          </div>
        </div>
      )}
      {
        showUserProfile && (
          <div className="addRoom-overlay">
            <div className="chatinfo-addRoom-content">
              <ChatInfo user={user} onProfilePicChange={onProfilePicChange} onCloseProfile={closeUserProfile}/>
            </div>
          </div>
        )
      }
    </aside>
  );
}

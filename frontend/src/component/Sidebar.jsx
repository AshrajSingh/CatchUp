import React, { useEffect, useState } from 'react';
import '../stylesheets/sidebar.css';
import '../stylesheets/dashboardPage.css';
import { addContact, deleteUser, getProfileData } from '../frontendServices/userAuth';
import toast from 'react-hot-toast';
import AddRoom from './AddRoom';
import ChatInfo from './ChatInfo';
import { useResetData } from '../hooks/resetDataHook';
import { useRecoilState } from 'recoil';
import { roomsAtom } from '../store/chatAppAtom';
import { Navigate, replace, useNavigate } from 'react-router-dom';
import { UserProfile } from './UserProfile';

export default function Sidebar({ user, onProfilePicChange }) {
  const [showAddRoom, setShowAddRoom] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [rooms, setRooms] = useRecoilState(roomsAtom)
  const resetData = useResetData();
  const navigate = useNavigate();

  function showAddRoomModal() {
    setShowAddRoom(true)
  }

  async function addRoom(contactId) {
    console.log("addRoom called");
    console.log("contactId: ", contactId)

    try {
      //check if user is trying to add already added contact
      const isAlreadyAdded = rooms.some(room => room.contactId == contactId)

      if (isAlreadyAdded) {
        toast.error('Contact already added!')
        setShowAddRoom(false)
        return;
      }
      const response = await addContact(contactId)
      console.log("Response: ", response)

      if (response && response.contacts && response.contacts.length > 0) {

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
  function closeUserProfile() {
    setShowUserProfile(false)
  }

  //delete account function
  async function handleDeleteUser(userId, actionType) {
    console.log("Delete user called with id: ", userId)

    if (actionType === 'logoutUser') {
      //calling function to logout user
      handleLogout(userId);
      return;
    }

    if (actionType === 'deleteUser') {

      const response = await deleteUser({ userId })
      console.log("Delete user response: ", response)

      if (response) {
        resetData();
        setShowUserProfile(false);
        navigate('/login', { replace: true });
        
        toast.success('Account deleted successfully!')
        return;
      } else {
        toast.error('Connot delete account. Please try again later.')
      }
    }
  }

  //logout function
  async function handleLogout(userId) {
    console.log("Logout called for userId: ", userId)

    if (window.confirm('Are you sure you want to logout?')) {

      resetData();

      toast.success('Logged out successfully!')
      navigate('/login', { replace: true })
      return;
    }

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
              <UserProfile user={user} onProfilePicChange={onProfilePicChange} onCloseProfile={closeUserProfile} onDeleteUser={handleDeleteUser} />
            </div>
          </div>
        )
      }
    </aside>
  );
}

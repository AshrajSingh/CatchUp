import { useEffect, useState } from "react";
import ChatBox from "../component/ChatBox";
import '../stylesheets/dashboardPage.css'
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import AddRoom from "../component/AddRoom";
import { useRecoilState } from "recoil";
import { roomsAtom, userProfileAtom } from "../store/chatAppAtom";
import { addContact, getProfileData, updateProfilePic } from "../frontendServices/userAuth";
import toast from "react-hot-toast";
import RoomSidebar from "../component/roomSidebar";
import messageIcon from '../assets/message-icon.png'
import ChatInfo from "../component/ChatInfo";
import Sidebar from "../component/Sidebar";


export default function DashboardPage() {
    const [showAddRoom, setShowAddRoom] = useState(false)
    const [showRightPanel, setShowRightPanel] = useState(false)
    const [selectedRoom, setSelectedRoom] = useState(null)
    const [profile, setProfile] = useRecoilState(userProfileAtom)
    const [rooms, setRooms] = useRecoilState(roomsAtom)
    const user = JSON.parse(localStorage.getItem("user"))

    useEffect(() => {
        async function fetchProfileData() {
            const profileData = await getProfileData()

            console.log("profileData from dashboard: ", profileData)

            if (profileData) {
                setProfile(profileData)
            }
            return profileData
        }
        fetchProfileData()
    }, [])

    // console.log("profile from dashboard: ", profile)

    function showAddRoomModal() {
        setShowAddRoom(true)
    }

    //adding new user
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

    useEffect(() => {
        document.body.style.background = "white";
        document.body.style.display = "block";

        return () => {
            document.body.style.background = null;
            document.body.style.display = null;
        }
    }, [])

    async function handleProfilePicChange(profilePicUrl) {
        const response = await updateProfilePic(profilePicUrl)

        console.log("updateProfilePic response(dashboard): ", response)

        if (response && response.profilePicUrl) {
            setProfile(prev => ({ ...prev, profilePicUrl: response.profilePicUrl }));
        }

    }

    function closeUserProfile() {
        setShowRightPanel(false)
    }

    function closeChatBox() {
        setSelectedRoom(null)
        setShowRightPanel(false)
    }

    return (
        <div className="dashboard">
            <PanelGroup autoSaveId={"conditional"} direction="horizontal">
                <>
                    <Panel id="sidebar" order={1} maxSize={5} minSize={5} defaultSize={5}>
                        {profile && <Sidebar user={profile} onProfilePicChange={handleProfilePicChange} />}
                    </Panel>
                    <PanelResizeHandle />
                </>
                <>
                    <Panel id="room-sidebar" order={2} minSize={10} defaultSize={12}>
                        <RoomSidebar rooms={rooms} onAddRoom={showAddRoomModal} onRoomSelect={setSelectedRoom} selectedRoom={selectedRoom} />
                    </Panel>
                    <PanelResizeHandle />
                </>

                {selectedRoom ? (
                    <>
                        <Panel id="chatBox" order={3} minSize={30} >
                            <ChatBox selectedRoom={selectedRoom} onProfileClick={setShowRightPanel} onAddRoom={showAddRoomModal} onCloseChatBox={closeChatBox} />
                        </Panel>
                        <PanelResizeHandle />
                    </>
                ) : (
                    <Panel id="chatbox" className="chatbox-container" order={3} minSize={30} >
                        <div className="chatbox-placeholder">
                            <img src={messageIcon} alt='Message-icon' className='message-icon' />
                            <h1>Your messages</h1>
                            <h2>Select a user to start a conversation</h2>
                            <button className='add-room' onClick={showAddRoomModal}>Add user</button>
                        </div>
                    </Panel>
                )}

                {showAddRoom && (
                    <div className="addRoom-overlay">
                        <div className="addRoom-content">
                            <AddRoom onAdd={addRoom} onCancel={closeAddRoom} />
                        </div>
                    </div>
                )}

                {showRightPanel && (
                    <>
                        <Panel id="roomInfo" order={4} minSize={23} >
                            <ChatInfo user={selectedRoom} onCloseProfile={closeUserProfile} />
                        </Panel>
                        <PanelResizeHandle />
                    </>
                )}

            </PanelGroup>
        </div>
    )
}
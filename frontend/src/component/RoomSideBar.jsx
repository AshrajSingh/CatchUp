import RoomPanel from "./RoomPanels";
import '../stylesheets/roomSidebar.css'
import HamburgerMenu from "./Menubar";

export default function RoomSidebar({ rooms, onRoomSelect, onAddRoom, selectedRoom }) {

    console.log("Room sidebar called: ", rooms)
    function handleAddRoom() {
        console.log("handleAddRoom called")
        onAddRoom();
    }

    return (
        <>
            <div className="room-sidebar">

                <div className="room-header">
                    <h1>Chats</h1>
                    <button className="add-room" onClick={handleAddRoom} >+</button>
                </div>
                <div className="room-list">
                    {rooms.length === 0 ? (
                        <div className="empty-state">
                            No rooms available. Add/Create rooms
                        </div>
                    ) : (
                        rooms.map(room => (
                            <RoomPanel key={room.id} room={room} onSelect={onRoomSelect} isSelected={selectedRoom?.id === room.id} />
                        ))
                    )}
                </div>
            </div>
        </>
    )
}
// RoomPanel.js
import '../stylesheets/roomSidebar.css'

function RoomPanel({ room, onSelect, isSelected }) {
    console.log("inside room panel: ", room)
  return (
    <div 
      className={`room-panel ${isSelected ? 'active' : ''}`} 
      onClick={() => onSelect(room)}
    >
      {/* <img src={room.avatar} alt="Room avatar" className="avatar" /> */}
      <div className="room-details">
        <span className="room-name">{room.username}</span>
        {room.unread > 0 && <span className="badge">{room.unread}</span>}
      </div>
    </div>
  );
}

export default RoomPanel;

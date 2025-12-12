import { useRef } from 'react'
import '../stylesheets/addRoom.css'
export default function AddRoom({ onAdd, onCancel }) {
    const roomRef = useRef()
    const handleAddRoom = (e, ref) => {
        ref.current = e.target.value.trim().replace(/^\s+/g, '')
    }

    return (
        <div className="addRoom">
            <h1>Add new user</h1>
            <h2>Enter user's private number to add them</h2>
            <input type="text" autoFocus inputMode="numeric" pattern="[0-9\-]*" placeholder="Enter user number" onChange={(e) => handleAddRoom(e, roomRef)} />
            <div className="buttons">

                <button className="add" onClick={() => onAdd(roomRef.current)}>Add</button>
                <button className="close" onClick={onCancel} >Close</button>
            </div>
        </div>
    )
}
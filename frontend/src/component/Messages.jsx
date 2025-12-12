import { useRecoilValue } from 'recoil'
import '../stylesheets/messages.css'
import { messageAtom } from '../store/chatAppAtom.jsx'
import toast from 'react-hot-toast'
import { useEffect } from 'react'

export default function Messages({ selectedRoom }) {
    const userId = JSON.parse(localStorage.getItem("user")).user_id
    const messages = useRecoilValue(messageAtom)
    console.log("all message: ", messages)
    console.log("Selected room:", selectedRoom);

    

    return (
        <>
            <div className="no-message">
                {messages.message === '' && <p>No messages</p>}
            </div>
            {messages.map((message, idx) => {
                const isSent = message.senderId?.toString() === userId.toString();

                
                return (
                    <div
                        key={message._id || idx}
                        className={`message-bubble ${isSent ? 'sent' : 'received'}`}>
                        <div className='message-content'>
                            <p>{message.message}</p>
                            <div className="timestamp">
                                <span className='timestamp'>
                                    {new Date(message.timeStamp).toLocaleDateString([], {
                                        year: '2-digit',
                                        month: '2-digit',
                                        day: '2-digit'
                                    })}, {new Date(message.timeStamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    )
}
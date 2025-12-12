import '../stylesheets/chatBox.css'
import sendIcon from '../assets/send-icon.png'
import Messages from './Messages'
import { useEffect, useState, useRef } from 'react'
import { useRecoilState } from 'recoil'
import { messageAtom } from '../store/chatAppAtom'
import { addMessages } from '../frontendServices/userAuth'
import io from 'socket.io-client';

export default function ChatBox({ selectedRoom, onProfileClick, onCloseChatBox }) {
    const userId = JSON.parse(localStorage.getItem("user")).user_id
    console.log("Chatbox selectedRoom: ", selectedRoom)
    console.log("userId: ", userId)
    const [messages, setMessages] = useRecoilState(messageAtom)
    const [text, setText] = useState('')
    const socketRef = useRef(null);
    const roomIdRef = useRef(null);
    const textareaRef = useRef(null);
    const messagesRef = useRef(null)

    const scrollToBottom = () => {
        if (messagesRef.current) {
            messagesRef.current.scrollTo({
                top: messagesRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages])

    // Initialize socket connection (once)
    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io('http://localhost:5000');
            console.log('Socket.IO connected');
        }
        return () => {
            // Keep connection alive
        };
    }, []);

    // Fetch messages when selectedRoom changes
    useEffect(() => {
        if (!selectedRoom || !selectedRoom.id) {
            setMessages([]);
            return;
        }

        const roomId = selectedRoom.id;
        roomIdRef.current = roomId;
        localStorage.setItem("selectedRoom", JSON.stringify(selectedRoom));

        // Fetch existing messages from server
        fetchMessages(roomId);
    }, [selectedRoom, setMessages]);

    // Set up socket listeners separately to ensure they stay active
    useEffect(() => {
        if (!socketRef.current || !roomIdRef.current) {
            return;
        }

        const roomId = roomIdRef.current;

        // Join the room (only once per room change)
        socketRef.current.emit('join-room', { roomId, userId });
        console.log(`Joined room: ${roomId}`);

        // Listen for incoming messages in this room
        const handleReceiveMessage = (msg) => {
            console.log('Received message via socket:', msg);
            console.log('Current roomId:', roomId);

            // Add message if it belongs to the current room and is not a duplicate
            setMessages(prev => {
                if (prev.some(m => m._id === msg._id)) {
                    console.log('Duplicate message, skipping:', msg._id);
                    return prev;
                }
                console.log('Adding new message:', msg);
                return [...prev, msg];
            });
        };

        // Set up the listener
        socketRef.current.on('receive-message', handleReceiveMessage);
        console.log('Socket listener registered for receive-message');

        return () => {
            // Clean up listener when room changes
            if (socketRef.current) {
                socketRef.current.off('receive-message', handleReceiveMessage);
                socketRef.current.emit('leave-room', { roomId });
                console.log(`Left room: ${roomId}`);
            }
        };
    }, [socketRef, userId]);

    async function fetchMessages(contactId) {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = user.token;

            // The backend will compute roomId from userId and contactId
            const response = await fetch(`http://localhost:5000/messages/${contactId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const messagesData = await response.json();
                console.log("Fetched messages from room:", messagesData);
                localStorage.setItem("Messages", JSON.stringify(messagesData))
                setMessages(messagesData);
            } else {
                console.error("Failed to fetch messages:", response.status);
                setMessages([]);
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            setMessages([]);
        }
    }

    function handleMessage(e) {
        setText(e.target.value)
        handleTextareaResize()
    }

    async function handleAddMessage() {
        if (!text || !text.trim()) return

        const newMsg = {
            senderId: userId,
            receiverId: selectedRoom.id,
            message: text.trim(),
            timeStamp: new Date().toISOString()
        }

        console.log("Sending message: ", newMsg)
        setText('')

        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        try {
            // Send to backend (backend will save, emit to room, and socket will push back to all clients)
            const messageData = await addMessages(newMsg)
            console.log("Message response:", messageData)
            setMessages(prev => [...prev, messageData])
            // No need to manually update messages here — socket event will handle it
        } catch (error) {
            console.error("Failed to send message:", error)
        }
    }

    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                onCloseChatBox();
            }
        };

        // Add event listener
        document.addEventListener('keydown', handleEscKey);

        // Cleanup on unmount
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [onCloseChatBox]);
    // Auto-resize textarea
    const handleTextareaResize = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }
    };

    return (
        <div className='chatbox-container'>
            <div className='chat-header'>
                <div className='contact-profile'>
                    <img src={selectedRoom?.profilePicUrl} alt="user-profile" />
                    <h2>{selectedRoom?.username}</h2>
                </div>
                <button onClick={onProfileClick} className='info-icon'>i</button>
            </div>

            {/* Messages Container - will scroll */}
            <div className='messages-container' ref={messagesRef}>
                <Messages selectedRoom={selectedRoom} />
            </div>

            {/* Input stays at bottom */}
            <div className='chat-input'>
                <textarea
                    ref={textareaRef}
                    type="text"
                    placeholder='Type your message here...'
                    autoFocus
                    value={text}
                    onChange={handleMessage}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddMessage();
                        }
                    }}
                    rows={1}
                />
                <button onClick={handleAddMessage}>
                    <img src={sendIcon} alt="send" />
                </button>
            </div>
        </div>
    );

}
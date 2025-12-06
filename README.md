# 💬 Real-Time Chat Application

A full-stack real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io. Features include instant messaging, user authentication, profile customization, and contact management.

## ✨ Features

### Core Features
- 🔐 **User Authentication** - Secure JWT-based authentication system
- 💬 **Real-Time Messaging** - Instant message delivery using Socket.io
- 👥 **Contact Management** - Add and manage contacts
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🌙 **Dark Theme** - Modern dark UI design

### Advanced Features
- ✅ **Online/Offline Status** - Real-time user status indicators
- 🖼️ **Profile Customization** - Upload and change profile pictures
- 📝 **Message Persistence** - All messages stored in MongoDB
- 🔔 **Real-Time Updates** - Socket.io powered live updates
- 🏠 **Chat Rooms** - Organized conversation rooms
- ⌨️ **Keyboard Shortcuts** - ESC to close chat, Enter to send messages
- 🎨 **Custom Avatars** - Choose from multiple profile pictures

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Recoil** - State management
- **Socket.io Client** - Real-time communication
- **CSS3** - Styling
- **React Resizable Panels** - Responsive layout

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM library
- **Socket.io** - WebSocket implementation
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas account)

## 🚀 Installation

### 1. Clone the Repository
- ```git clone https://github.com/AshrajSingh/CatchUp.git```
- ```cd chat-application```

### 2. Backend Setup
- ```Navigate to backend directory```
- ```cd backend```

- Install dependencies
```npm install```

- Create .env file
```cp .env.example .env```

- **Configure `.env` file:**
``` PORT=5000```
```MONGODB_URI=mongodb://localhost:27017/chatapp```

- Or use MongoDB Atlas:
```MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp```
```JWT_SECRET=your_super_secret_jwt_key_here```
```NODE_ENV=development```

- **Generate JWT Secret:**
```node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"```

- **Start Backend Server:**
```npm start```

- Or for development with auto-reload:
```npm run dev```

- Backend will run on `http://localhost:5000`

### 3. Frontend Setup

- Navigate to frontend directory (open new terminal)
```cd frontend```

- Install dependencies
```npm install```

- Start frontend
```npm start```

- Frontend will run on `http://localhost:3000`

## 📁 Project Structure

chat-application/
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── assets/ # Images and static files
│ │ ├── component/ # React components
│ │ │ ├── AddRoom.jsx
│ │ │ ├── ChatBox.jsx
│ │ │ ├── ChatInfo.jsx
│ │ │ ├── Messages.jsx
│ │ │ ├── RoomPanel.jsx
│ │ │ ├── RoomSideBar.jsx
│ │ │ └── Sidebar.jsx
│ │ ├── frontendServices/ # API calls
│ │ │ ├── profilePics.js
│ │ │ └── userAuth.js
│ │ ├── hooks/ # Custom hooks
│ │ ├── pages/ # Page components
│ │ │ ├── dashboardPage.jsx
│ │ │ ├── loginPage.jsx
│ │ │ └── signupPage.jsx
│ │ ├── store/ # Recoil state management
│ │ │ └── chatAppAtom.js
│ │ ├── stylesheets/ # CSS files
│ │ └── App.js
│ ├── package.json
│ └── .env.example
│
├── backend/
│ ├── models/ # Mongoose schemas
│ │ ├── userModel.js
│ │ └── messageModel.js
│ ├── routes/ # API routes
│ │ ├── authRoute.js
│ │ ├── contactRoute.js
│ │ ├── messageRoute.js
│ │ └── profileRoute.js
│ ├── middlewares/ # Custom middleware
│ │ └── userValidation.js
│ ├── config/ # Configuration files
│ │ └── database.js
│ ├── server.js # Entry point
│ ├── package.json
│ └── .env.example
│
├── README.md
├── .gitignore
└── LICENSE

## 🔌 API Endpoints

### Authentication
- POST /api/signup - Register new user
- POST /api/login - User login

### Profile
- GET /api/profile - Get user profile
- POST /api/profile/profilePic/update - Update profile picture

### Contacts
- POST /api/contact/add - Add new contact
- GET /api/contacts - Get all contacts
- DELETE /api/contact/:id - Delete contact

### Messages
- GET /api/messages/:contactId - Get messages with contact
- POST /api/message/add - Send new message

### Socket Events
- join-room - Join a chat room
- leave-room - Leave a chat room
- send-message - Send real-time message
- receive-message - Receive real-time message

## 🎮 Usage

### 1. Sign Up
- Navigate to the signup page
- Enter username, contact ID, password, and bio
- Click "Sign Up"

### 2. Login
- Enter your username and password
- Click "Login"

### 3. Add Contacts
- Click the "+" button in the sidebar
- Enter contact ID of the user you want to add
- Click "Add Contact"

### 4. Start Chatting
- Select a contact from the sidebar
- Type your message in the input field
- Press "Enter" or click send button
- Messages appear in real-time!

### 5. Customize Profile
- Click your profile picture in the sidebar
- Choose a new profile picture from the grid
- Click to apply changes

## 🎨 Screenshots

*Add screenshots here*

### Login Page
![Login](screenshots/login.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Chat Interface
![Chat](screenshots/chat.png)

### Profile Settings
![Profile](screenshots/profile.png)

## 🚀 Future Enhancements

- [ ] Voice and video calling
- [ ] Group chat functionality
- [ ] File and image sharing
- [ ] Message reactions (emoji)
- [ ] Read receipts and typing indicators
- [ ] Message search functionality
- [ ] Dark/Light theme toggle
- [ ] Push notifications
- [ ] End-to-end encryption
- [ ] Message editing and deletion

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
## 👨‍💻 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [Your Name](https://linkedin.com/in/your-profile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Socket.io documentation
- MongoDB documentation
- React documentation
- Recoil state management
- All contributors and supporters

## 📞 Support

For support, email ashrajsingh9@gmail.com or open an issue on GitHub.

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Made with ❤️ and ☕**

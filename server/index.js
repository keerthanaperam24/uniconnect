const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { Server } = require('socket.io');
const http = require('http');

dotenv.config();
const app = express();
const server = http.createServer(app);

// ✅ Updated allowed origins to include Render app
const allowedOrigins = [
  'http://localhost:3000',
  'https://uniconnect-qsai.vercel.app',
  'https://uniconnect-qsai.onrender.com'
];

// ✅ Handle preflight requests
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));

// ✅ Enable CORS
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
    const Message = require('./models/Message');
    try {
      const msg = new Message({ senderId, receiverId, message });
      await msg.save();

      io.to(receiverId).emit('message', { senderId, receiverId, message });
      io.to(senderId).emit('message', { senderId, receiverId, message });
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });
});

// ✅ Define routes
app.use('/api/test', require('./routes/test'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/Posts'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/users', require('./routes/users'));

// ✅ Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require('dotenv').config({ path: '../.env' });
const socketAuth = require('./middlewares/socketAuth');
const Message = require('./models/message');
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next();
  }
  socketAuth(socket, next);
});

io.on('connection', (socket) => {
  if (socket.user) {
    console.log('🟢 Authenticated socket connected:', socket.user.id);
  }
  console.log('🟢 User connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

socket.on('sendMessage', async ({ roomId, senderId, message }) => {
  try {
    const newMessage = await Message.create({
      roomId,
      sender: senderId,
      message
    });

    io.to(roomId).emit('receiveMessage', {
      _id: newMessage._id,
      roomId: newMessage.roomId,
      sender: newMessage.sender,
      message: newMessage.message,
      createdAt: newMessage.createdAt
    });
  } catch (error) {
    console.error('❌ Message save error:', error);
  }
});

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running with WebSockets on port ${PORT}`)
);

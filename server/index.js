const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

// Routes
const authRoutes = require('./routes/auth');
const subjectRoutes = require('./routes/subjects');
const taskRoutes = require('./routes/tasks');

const app = express();
const server = http.createServer(app);
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors()); // Completely open for now to bypass errors
app.use(express.json());

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', message: 'CA Tracker API is running 🎓' }));

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  socket.on('joinSubject', (subjectId) => {
    socket.join(`subject-${subjectId}`);
    console.log(`[Socket] Client ${socket.id} joined subject-${subjectId}`);
  });

  socket.on('leaveSubject', (subjectId) => {
    socket.leave(`subject-${subjectId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
// Start server immediately (Render needs to see the port open)
server.listen(PORT, () => {
    console.log(`✅ Server ready on port ${PORT}`);
});

// Connect MongoDB in the background
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    // One-off name update
    const User = require('./models/User');
    await User.findOneAndUpdate({ email: 'user1@example.com' }, { name: 'Prathana' });
    await User.findOneAndUpdate({ email: 'user2@example.com' }, { name: 'Nitiksha' });
    console.log('✅ Student names updated to Prathana and Nitiksha');
  })
  .catch((err) => {
    console.error('❌ CRITICAL: MongoDB URI is missing or invalid!');
    console.error('Check Render Environment Variables for: MONGODB_URI');
    console.error(err.message);
  });

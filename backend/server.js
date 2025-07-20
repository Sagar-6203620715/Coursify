const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const http = require('http');
const { Server } = require('socket.io');
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const domainRoutes = require("./routes/domainRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const chatRoutes = require("./routes/chatRoutes");
const adminRoutes = require("./routes/adminRoutes");
const courseAdminRoutes = require("./routes/courseAdminRoutes");
const domainAdminRoutes = require("./routes/domainAdminRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const app = express();

const PORT = process.env.PORT || 9000;
const MONGO_URI = process.env.MONGO_URI;

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173', 
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'https://course-comparator.netlify.app',
      'https://your-frontend-domain.netlify.app'
    ];
    
    // Add FRONTEND_URL from environment if it exists
    if (process.env.FRONTEND_URL) {
      allowedOrigins.push(process.env.FRONTEND_URL);
    }
    
    // Add any additional frontend URLs from environment
    if (process.env.ADDITIONAL_FRONTEND_URLS) {
      const additionalUrls = process.env.ADDITIONAL_FRONTEND_URLS.split(',').map(url => url.trim());
      allowedOrigins.push(...additionalUrls);
    }
    
    console.log('CORS check - Origin:', origin);
    console.log('CORS check - Allowed origins:', allowedOrigins);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('CORS: Origin allowed');
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      // In production, be more strict; in development, be more lenient
      if (process.env.NODE_ENV === 'production') {
        callback(new Error('Not allowed by CORS'));
      } else {
        console.log('CORS: Allowing origin in development mode');
        callback(null, true);
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'Origin', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Too many requests from this IP, please try again later."
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));
} else {
  console.warn("MONGO_URI not set. Skipping DB connection.");
}

app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/domains", domainRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/courses", courseAdminRoutes);
app.use("/api/admin/domains", domainAdminRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/visitors", visitorRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.json({ message: "Coursify API" });
});

const server = http.createServer(app);
// Socket.IO CORS configuration
const socketCorsOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', 
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'https://course-comparator.netlify.app',
  'https://your-frontend-domain.netlify.app'
];

// Add environment variables to Socket.IO CORS
if (process.env.FRONTEND_URL) {
  socketCorsOrigins.push(process.env.FRONTEND_URL);
}

if (process.env.ADDITIONAL_FRONTEND_URLS) {
  const additionalUrls = process.env.ADDITIONAL_FRONTEND_URLS.split(',').map(url => url.trim());
  socketCorsOrigins.push(...additionalUrls);
}

const io = new Server(server, {
  cors: {
    origin: socketCorsOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', (domainId) => {
    socket.join(domainId);
    console.log(`User ${socket.id} joined room: ${domainId}`);
  });

  socket.on('chatMessage', (data) => {
    io.to(data.domainId).emit('chatMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// 404 handler
app.all('*', (req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
    status: 404
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const chatRouter = require('./routes/chat.routes');
const cors = require('cors');
const messageRouter = require('./routes/message.routes');
const app = express()
const path = require("path")

// Configure CORS for both development and production
const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL
    : 'http://localhost:5173';

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', 1);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);

// app.use((req, res) => {
//   res.sendFile(path.join(__dirname, "../public", "index.html"));
// });

module.exports = app;
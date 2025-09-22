const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const chatRouter = require('./routes/chat.routes');
const cors = require('cors');
const messageRouter = require('./routes/message.routes');
const app = express()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);


module.exports = app;
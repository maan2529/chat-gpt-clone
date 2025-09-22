const express = require('express');
const { createChat, getChats } = require('../controllers/chat.controller');
const { userAuth } = require('../middlewares/authMiddleware/userAuth.middleware');
const { createChatValidation } = require('../middlewares/validaton.middleware');

const chatRouter = express.Router();

chatRouter.post('/create-chat', userAuth, createChatValidation, createChat)
chatRouter.get('/getAllChats', userAuth, getChats)




module.exports = chatRouter;
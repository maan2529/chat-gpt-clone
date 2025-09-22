const express = require('express');

const { userAuth } = require('../middlewares/authMiddleware/userAuth.middleware');
const { getAllChatById } = require('../controllers/message.controller');

const messageRouter = express.Router();

messageRouter.get('/getAllMessages/:chatId', userAuth, getAllChatById)

module.exports = messageRouter;
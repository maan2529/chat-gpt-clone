const express = require('express');
const { createChat } = require('../controllers/chat.controller');
const { userAuth } = require('../middlewares/authMiddleware/userAuth.middleware')

const chatRouter = express.Router();

chatRouter.post('/chat', userAuth, createChat)



module.exports = chatRouter;
const Message = require("../models/message.model")

// kuch error ara hai

async function getAllChatById(req, res) {
    try {


        const { chatId } = req.params;

        if (!chatId) {
            res.status(400).json({
                message: "chatId is require "
            })
            return
        }

        const allMessages = await Message.find({ chat: chatId })
            .sort({ createdAt: 1 })
            .select({ _id: 1, role: 1, text: 1 }); // old to new
        
        return res.status(200).json({
            data: allMessages,
            success: true,
            message: "fatched all message successfully "

        })
    } catch (error) {
        res.status(500).json({ message: error.message });
        // throw Error(error)
    }
}

module.exports = {
    getAllChatById
}
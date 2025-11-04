const Message = require("../models/message.model")

async function getAllChatById(req, res) {
    try {

        const { chatId } = req.params;

        if (!chatId) {
            return res.status(400).json({
                message: "Chat ID is required"
            })
        }

        const allMessages = await Message.find({ chat: chatId })
            .sort({ createdAt: 1 })
            .select({ _id: 1, role: 1, text: 1 });
        
        return res.status(200).json({
            data: allMessages,
            success: true,
            message: "Messages fetched successfully"
        })
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({ 
            message: "Failed to fetch messages",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = {
    getAllChatById
}
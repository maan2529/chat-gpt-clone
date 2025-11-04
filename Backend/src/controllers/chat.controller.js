const chatModel = require("../models/chat.models");

async function createChat(req, res) {
    try {
        const { title } = req.body;
        const user = req.user

        if (!title) {
            return res.status(400).json({
                message: "Title is required"
            })
        }

        const chat = await chatModel.create({
            user: user._id,
            title: title
        })

        return res.status(201).json({
            message: "Chat created successfully",
            chat: chat,
        })

    } catch (error) {
        console.error("Error creating chat:", error);
        return res.status(500).json({
            message: "Failed to create chat",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}
async function getChats(req, res) {
    try {
        const user = req.user

        const chat = await chatModel.find({
            user: user._id
        }).sort({ createdAt: -1 })

        return res.status(200).json({
            message: "Chats fetched successfully",
            success: true,
            chat: chat,
        })

    } catch (error) {
        console.error("Error fetching chats:", error);
        return res.status(500).json({
            message: "Failed to fetch chats",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

module.exports = {
    createChat,
    getChats
}
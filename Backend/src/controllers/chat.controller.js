const chatModel = require("../models/chat.models");

async function createChat(req, res) {
    console.log("create chat called")
    try {
        const { title } = req.body;
        const user = req.user

        const chat = await chatModel.create({
            user: user._id,
            title: title
        })


        return res.status(201).json({
            message: "chat created",
            chat: chat,
        })


    } catch (error) {
        res.status(401).json({
            message: "chat not created"
        })
        throw Error("Error while creating chat" + error)
    }
}
async function getChats(req, res) {
    try {

        const user = req.user

        const chat = await chatModel.find({
            user: user._id
        })

        

        return res.status(200).json({
            message: "chat fetched",
            success: true,
            chat: chat,
        })


    } catch (error) {
        res.status(401).json({
            message: "erros in getting chats"
        })
        throw Error("Error while creating chat" + error)
    }
}

module.exports = {
    createChat,
    getChats
}
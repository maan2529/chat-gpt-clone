const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chat',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    role: {
        type: String,
        enum: ["user", "model"],
        required: true
    },
    text: {
        type: String,
        required: true
    }

}, { timestamps: true })

const Message = mongoose.model("Message", messageSchema)

module.exports = Message


const Message = require("../models/message.model");

const GoogleGenAI = require("@google/genai").GoogleGenAI
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

//basic level of add short term memory to ai , but not right way to do it 
// const contents = [
// ]; 

async function getAIResponse(messages, cb) {
    // Fetch only messages from the specific chat to avoid memory leak and data exposure
    const contents = (await Message.find({ chat: messages.chatId }).sort({ createdAt: 1 })).map(msg => (
        {
            role: msg.role,
            parts: [{
                text: msg.text,
            }]
        }
    ))

    const response = await ai.models.generateContentStream({
        model: "gemini-2.0-flash",
        contents: contents,
        config: {
            systemInstruction: "Always respond in markdown only.",
        },

    })

    let text = '';

    for await (const chunks of response) {
        cb(chunks.text)
        text += chunks.text
    }

    return text;
}

module.exports = {
    getAIResponse
}
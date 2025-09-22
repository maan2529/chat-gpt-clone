const Message = require("../models/message.model");

const GoogleGenAI = require("@google/genai").GoogleGenAI
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

//basic level of add short term memory to ai , but not right way to do it 
// const contents = [
// ];
// console.log(contents)

async function getAIResponse(messages, cb) {
    // contents.push({
    //     role: 'user',
    //     parts: [{
    //         text: messages
    //     }]
    // })
    const contents = (await Message.find()).map(msg => (
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

    // console.log("response", response)
    for await (const chunks of response) {
        console.log(chunks.text)
        cb(chunks.text)
        text += chunks.text
    }


    // contents.push({
    //     role: 'model',
    //     parts: [{
    //         text,
    //     }]
    // })

    // console.log(response.text)
    return text;
}

module.exports = {
    getAIResponse
}
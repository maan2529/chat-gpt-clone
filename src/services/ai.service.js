const GoogleGenAI = require("@google/genai").GoogleGenAI
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})
const contents = [

];
console.log(contents)

async function getAIResponse(messages, cb) {
    contents.push({
        role: 'user',
        parts: [{
            text: messages
        }]
    })
    const response = await ai.models.generateContentStream({
        model: "gemini-2.0-flash",
        contents: contents,
    })

    let text = '';

    console.log("response", response)
    for await (const chunks of response) {
        cb(chunks.text)
        text += chunks.text
    }

    contents.push({
        role: 'model',
        parts: [{
            text,
        }]
    })

    // console.log(response.text)
    return text;
}

module.exports = {
    getAIResponse
}
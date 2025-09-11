const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')
const cookie = require("cookie");
const { getAIResponse } = require("../services/ai.service")
function initSocket(httpServer) {

    const io = new Server(httpServer)

    // adding authentication so only authenticated use can send message 

    io.use((socket, next) => {


        const cookies = socket.handshake?.headers?.cookie; // in string format

        const { token } = cookies ? cookie.parse(cookies) : {}  // in objedct format


        if (!token) {
            return next(new Error("not Authenticated"))
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            socket.user = decoded
            next()
        } catch (error) {
            return next(new Error("not Authenticated"))
        }
    })
    io.on('connection', (socket) => {


        socket.on('ai-message', async (message) => {
            try {
                await getAIResponse(message, (chunksText) => {

                    socket.emit("ai-response", chunksText)
                })


            } catch (error) {
                socket.emit("ai-response", { error: "Something went wrong" })
            }

        })

        socket.on("disconnect", () => {
            console.log("user disconnected", socket.user);
        })

    })
}

module.exports = initSocket
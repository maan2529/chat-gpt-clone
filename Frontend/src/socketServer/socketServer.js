// socket.js
import { io } from "socket.io-client";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Replace with your backend URL
const socket = io(backendUrl, {
    transports: ["websocket"], // force WebSocket (avoid polling delays)
    withCredentials: true,     // needed if using CORS with credential
});

export default socket;
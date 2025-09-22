import { configureStore } from '@reduxjs/toolkit'
import chatReducer from './feature/chat/chatSlice.js'
import messageReducer from './feature/message/messageSlice.js'

export default configureStore({
    reducer: {
        chat: chatReducer,
        message: messageReducer,
    },
})

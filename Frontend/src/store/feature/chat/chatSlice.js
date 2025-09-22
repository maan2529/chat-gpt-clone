import { createSlice } from '@reduxjs/toolkit'

export const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: []
    },
    reducers: {
        addChatToStore: (state, action) => {
            state.chats = action.payload
        },

        appendToChatStore: (state, action) => {
            state.chats.push(action.payload)
        },
        removeChatFromStore: (state) => {
            state.chats = []
        }
    },
})

export const { addChatToStore, removeChatFromStore, appendToChatStore } = chatSlice.actions

export default chatSlice.reducer
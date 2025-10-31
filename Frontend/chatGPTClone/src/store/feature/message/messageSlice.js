// store/feature/message/messageSlice.js
import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name: "message",
    initialState: {
        messages: [],
        currentChatId: null,
        isLoading: false
    },

    reducers: {
        setAllMessages: (state, action) => {
            state.messages = action.payload || [];
        },

        addMessages: (state, action) => {
            if (action.payload) {
                state.messages.push(action.payload);
            }
        },

        streamMessage: (state, action) => {
            const { _id, chunk } = action.payload;
            if (!_id || chunk === undefined) return;

            const existingMsgIndex = state.messages.findIndex(msg => msg._id === _id);

            if (existingMsgIndex !== -1) {
                // Update existing message
                const currentText = state.messages[existingMsgIndex].text || "";
                state.messages[existingMsgIndex].text = currentText + " " + chunk;
            } else {
                // Create new message
                state.messages.push({
                    _id,
                    role: "model",
                    text: chunk,
                });
            }
        },

        removeMessages: (state) => {
            state.messages = [];
        },

        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload;
        },

        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },

        // Remove a specific message
        removeMessage: (state, action) => {
            const messageId = action.payload;
            state.messages = state.messages.filter(msg => msg._id !== messageId);
        },

        // Update a specific message
        updateMessage: (state, action) => {
            const { _id, updates } = action.payload;
            const messageIndex = state.messages.findIndex(msg => msg._id === _id);

            if (messageIndex !== -1) {
                state.messages[messageIndex] = {
                    ...state.messages[messageIndex],
                    ...updates
                };
            }
        }
    }
});

export const {
    setAllMessages,
    addMessages,
    removeMessages,
    streamMessage,
    setCurrentChatId,
    setLoading,
    removeMessage,
    updateMessage
} = messageSlice.actions;

export default messageSlice.reducer;
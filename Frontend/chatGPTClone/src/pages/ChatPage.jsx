import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { useLocation, useParams } from 'react-router';
import { io } from "socket.io-client";
import socket from '../socketServer/socketServer';
import { useSelector, useDispatch } from 'react-redux'
import { addMessages, removeMessages, setAllMessages, streamMessage } from '../store/feature/message/messageSlice';
import useGetAllChats from '../hooks/message/messageHook';
import InputBox from '../components/inputBox';

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { updateCachedMessages } from '../utils/chatCache';

const ChatPage = () => {
    const { chatId } = useParams();
    const chatEndRef = useRef(null);
    const dispatch = useDispatch();
    const messages = useSelector((state) => state.message.messages);
    const isComponentMounted = useRef(true);
    const lastChatId = useRef(null);

    const { data, error, isLoading, isCached } = useGetAllChats(chatId);

    // Handle input submit
    const handleOnSubmit = useCallback((data) => {
        if (!chatId || !data.userText?.trim()) return;

        const chatMsg = {
            _id: Date.now().toString(),
            role: "user",
            text: data.userText.trim(),
        };

        dispatch(addMessages(chatMsg));

        // Backend call
        socket.emit("ai-message", {
            chatId: chatId,
            text: data.userText.trim()
        });
    }, [chatId, dispatch]);

    // Cleanup when chat changes or component unmounts
    useEffect(() => {
        if (!messages.length) return;

        const lastMsg = messages[messages.length - 1];

        // 👉 If user sends a message, scroll smoothly
        if (lastMsg.role === "user") {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
        // 👉 If AI is streaming (markdown/code), use auto first, then smooth once it's stable
        else {
            chatEndRef.current?.scrollIntoView({ behavior: "auto" });
            requestAnimationFrame(() => {
                chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
            });
        }
    }, [messages]);
    // Don't include messages in deps to avoid excessive updates

    // Update cache when messages change (debounced)
    useEffect(() => {
        if (!chatId || !messages.length) return;

        const timeoutId = setTimeout(() => {
            if (isComponentMounted.current) {
                updateCachedMessages(chatId, messages);
            }
        }, 1000); // 1 second debounce

        return () => clearTimeout(timeoutId);
    }, [chatId, messages]);

    // Socket listener for AI responses
    useEffect(() => {
        if (!chatId) return;

        const handleAIResponse = (aiResponse) => {
            // FIXED: Better validation and logging for debugging
            console.log("🤖 AI Response received:", aiResponse);

            if (!aiResponse?.messageId) {
                console.warn("Invalid AI response or component unmounted:", aiResponse);
                return;
            }

            // FIXED: Ensure chunksText is properly handled
            const chunk = aiResponse.chunksText || aiResponse.chunk || "";

            dispatch(streamMessage({
                _id: aiResponse.messageId,
                chunk: chunk,
            }));

            console.log("💬 Streamed chunk:", { messageId: aiResponse.messageId, chunk });
        };

        socket.on("ai-response", handleAIResponse);

        return () => {
            socket.off("ai-response", handleAIResponse);
        };
    }, [dispatch, chatId]);

    // Safe auto-scroll
    const scrollToBottom = useCallback(() => {
        if (!chatEndRef.current || !isComponentMounted.current) return;

        try {
            // Check if element is still in DOM
            if (document.contains(chatEndRef.current)) {
                chatEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
        } catch (error) {
            console.warn("Scroll error (safe to ignore):", error);
        }
    }, []);

    // Auto-scroll when messages change
    useEffect(() => {
        if (!messages?.length) return;

        const lastMsg = messages[messages.length - 1];
        if (!lastMsg) return;

        if (lastMsg.role === "user") {
            scrollToBottom();
        } else {
            // For AI responses, wait for DOM updates
            requestAnimationFrame(() => {
                if (isComponentMounted.current) {
                    scrollToBottom();
                }
            });
        }
    }, [messages, scrollToBottom]);

    // Show loading state
    if (isLoading && !isCached) {
        return <div>Loading messages...</div>;
    }

    // Show error state
    if (error) {
        return <div>Error loading messages: {error.message}</div>;
    }

    return (
        <div className="flex flex-col h-screen bg-[#212223] text-white pt-13">
            {/* Chat Messages */}

            <div className="sidebar flex-1 p-4 space-y-4 overflow-auto sm:px-10 md:px-30">

                {messages && messages.length < 1 && <div>No data Available</div>}
                {messages ? messages.map((msg) => (
                    <div
                        key={msg._id}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            key={msg._id}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`px-4 py-3 rounded-lg max-w-[65ch] text-base leading-relaxed
      prose prose-invert prose-pre:whitespace-pre-wrap prose-pre:overflow-x-auto
      ${msg.role === "user"
                                        ? "bg-[#404245] text-white rounded-br-none"
                                        : "bg-[#292b2c] text-gray-100 rounded-bl-none"}
    `}
                            >
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        code({ node, inline, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || "");
                                            return !inline && match ? (
                                                <SyntaxHighlighter
                                                    {...props}
                                                    style={oneDark}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    customStyle={{
                                                        margin: "1em 0",
                                                        borderRadius: "0.5rem",
                                                        fontSize: "0.9rem",
                                                    }}
                                                >
                                                    {String(children).replace(/\n$/, "")}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code
                                                    className="bg-zinc-800 px-2 py-0.5 rounded text-orange-300 text-sm"
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            );
                                        },
                                    }}
                                >
                                    {msg.text}
                                </ReactMarkdown>
                            </div>
                        </div>


                    </div>

                )) : <div>No Chats Available</div>}
                <div ref={chatEndRef}></div>
            </div>

            {/* Input Box */}
            <div className="w-full p-5 sm:p-5  flex justify-center items-center bg-[#212223]">
                <InputBox handleOnSubmit={handleOnSubmit} />
            </div>
        </div>
    );
};

export default ChatPage;

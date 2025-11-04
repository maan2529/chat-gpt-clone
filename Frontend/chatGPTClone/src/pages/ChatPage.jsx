import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { useLocation, useParams } from 'react-router';
import { io } from "socket.io-client";
import socket from '../socketServer/socketServer';
import { useSelector, useDispatch } from 'react-redux'
import { addMessages, removeMessages, setAllMessages, streamMessage, setLoading } from '../store/feature/message/messageSlice';
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
    const isAITyping = useSelector((state) => state.message.isLoading);
    const isComponentMounted = useRef(true);
    const lastChatId = useRef(null);
    const location = useLocation();

    const { data, error, isLoading, isCached } = useGetAllChats(chatId);
    const [isAwaitingAI, setIsAwaitingAI] = useState(false);
    // Handle input submit
    const handleOnSubmit = useCallback((data) => {
        if (!chatId || !data.userText?.trim()) return;

        const chatMsg = {
            _id: Date.now().toString(),
            role: "user",
            text: data.userText.trim(),
        };

        dispatch(setLoading(true));
        dispatch(addMessages(chatMsg));

        socket.emit("ai-message", {
            chatId: chatId,
            text: data.userText.trim()
        });
    }, [chatId, dispatch]);

    // In ChatPage.jsx
    useEffect(() => {
        if (!chatId || !socket.connected) return;

        const initialMessage = location?.state?.data;
        if (!initialMessage?.text) return;

        dispatch(setLoading(true));

        const emitMessage = () => {
            socket.emit("ai-message", {
                chatId,
                text: initialMessage.text,
            });
        };

        if (socket.connected) {
            const timeoutId = setTimeout(emitMessage, 100);
            return () => clearTimeout(timeoutId);
        } else {
            socket.once('connect', emitMessage);
            return () => socket.off('connect', emitMessage);
        }
    }, [chatId, location?.state, dispatch]);

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
            if (!aiResponse) return;

            if (aiResponse.chatId && aiResponse.chatId !== chatId) {
                return;
            }

            if (aiResponse.error) {
                dispatch(setLoading(false));
                console.error("AI response error:", aiResponse.error);
                return;
            }

            if (aiResponse.chunk && aiResponse.messageId) {
                dispatch(streamMessage({
                    _id: aiResponse.messageId,
                    chunk: aiResponse.chunk,
                }));
                return;
            }

            if (aiResponse.done) {
                dispatch(setLoading(false));
            }
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

    useEffect(() => {
        return () => {
            dispatch(setLoading(false));
        };
    }, [dispatch]);

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

            <div className="sidebar flex-1 p-4 overflow-auto">
                <div className="mx-auto w-full max-w-[48rem] space-y-4">
                    {messages && messages.length < 1 && <div>No data Available</div>}
                    {messages ? messages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`px-4 py-3 rounded-lg max-w-[90%] text-base leading-relaxed
      ${msg.role === "user"
                                            ? "bg-[#404245] text-white rounded-br-none prose prose-invert prose-pre:whitespace-pre-wrap prose-pre:overflow-x-auto"
                                            : "bg-[#292b2c] text-gray-100 rounded-bl-none prose prose-invert prose-pre:whitespace-pre-wrap prose-pre:overflow-x-auto prose-headings:text-emerald-400 prose-headings:font-bold prose-strong:text-yellow-300 prose-strong:font-bold prose-em:text-pink-300 prose-a:text-blue-400 prose-a:underline hover:prose-a:text-blue-300 prose-code:text-orange-300 prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-blockquote:border-l-emerald-500 prose-blockquote:text-gray-300 prose-ul:text-gray-200 prose-ol:text-gray-200 prose-li:marker:text-emerald-400"}
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
                                                            border: "1px solid #10b981",
                                                            boxShadow: "0 0 10px rgba(16, 185, 129, 0.1)"
                                                        }}
                                                    >
                                                        {String(children).replace(/\n$/, "")}
                                                    </SyntaxHighlighter>
                                                ) : (
                                                    <code
                                                        className="bg-zinc-800 px-2 py-0.5 rounded text-orange-300 text-sm font-mono"
                                                        {...props}
                                                    >
                                                        {children}
                                                    </code>
                                                );
                                            },
                                            h1: ({ children }) => <h1 className="text-2xl font-bold text-emerald-400 mt-4 mb-2">{children}</h1>,
                                            h2: ({ children }) => <h2 className="text-xl font-bold text-emerald-400 mt-3 mb-2">{children}</h2>,
                                            h3: ({ children }) => <h3 className="text-lg font-bold text-emerald-400 mt-2 mb-1">{children}</h3>,
                                            strong: ({ children }) => <strong className="font-bold text-yellow-300">{children}</strong>,
                                            em: ({ children }) => <em className="italic text-pink-300">{children}</em>,
                                            a: ({ href, children }) => <a href={href} className="text-blue-400 underline hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>,
                                            blockquote: ({ children }) => <blockquote className="border-l-4 border-emerald-500 pl-4 py-2 my-2 text-gray-300 italic bg-zinc-800/50 rounded-r">{children}</blockquote>,
                                            ul: ({ children }) => <ul className="list-disc list-inside my-2 space-y-1 text-gray-200">{children}</ul>,
                                            ol: ({ children }) => <ol className="list-decimal list-inside my-2 space-y-1 text-gray-200">{children}</ol>,
                                            li: ({ children }) => <li className="marker:text-emerald-400 marker:font-bold">{children}</li>,
                                        }}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>

                    )) : <div>No Chats Available</div>}
                    {isAITyping && (
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <span className="inline-flex h-2 w-2">
                                <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                            </span>
                            <span className="animate-pulse">AI is responding...</span>
                        </div>
                    )}
                    <div ref={chatEndRef}></div>
                </div>
            </div>

            {/* Input Box */}
            <div className="w-full px-4 py-5 sm:px-6 bg-[#212223]">
                <div className="mx-auto w-full max-w-[48rem] flex justify-center">
                    <InputBox handleOnSubmit={handleOnSubmit} containerClassName="max-w-[86rem]" />
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
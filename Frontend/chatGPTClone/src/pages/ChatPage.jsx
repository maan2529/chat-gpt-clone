import { ChartArea } from 'lucide-react';
import React, { useState } from 'react'
import InputBox from '../components/inputBox';

const ChatPage = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: "ai", text: "Hello! How can I help you today? Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit saepe odio voluptate, optio et, rem deserunt omnis pariatur cum praesentium voluptatum ratione ex repellat exercitationem earum vero illo, quis incidunt? Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit saepe odio voluptate, optio et, rem deserunt omnis pariatur cum praesentium voluptatum ratione ex repellat exercitationem earum vero illo, quis incidunt? Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit saepe odio voluptate, optio et, rem deserunt omnis pariatur cum praesentium voluptatum ratione ex repellat exercitationem earum vero illo, quis incidunt?Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit saepe odio voluptate, optio et, rem deserunt omnis pariatur cum praesentium voluptatum ratione ex repellat exercitationem earum vero illo, quis incidunt?Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit saepe odio voluptate, optio et, rem deserunt omnis pariatur cum praesentium voluptatum ratione ex repellat exercitationem earum vero illo, quis incidunt?Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit saepe odio voluptate, optio et, rem deserunt omnis pariatur cum praesentium voluptatum ratione ex repellat exercitationem earum vero illo, quis incidunt?" },
        { id: 2, sender: "user", text: "Can you explain React in simple terms?" },
        { id: 3, sender: "ai", text: "Sure! React is a JavaScript library for building user interfaces." },
    ]);


    const sendMessage = () => {
        console.log("msg send to ai")
    }
   

    return (
        <div className="flex flex-col h-screen bg-[#212223] text-white pt-13 ">
            {/* Chat Messages */}
            <div className="sidebar flex-1  p-4 space-y-4 overflow-auto sm:px-10 md:px-30 ">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >

                        <div className={`px-4 py-2 rounded-lg max-w-xs sm:max-w-md text-sm sm:text-base ${msg.sender === "user" ? "bg-[#404245] text-white rounded-br-none" : "bg-[#292b2c] text-gray-100 rounded-bl-none"}`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Box */}
            <div
                className="w-full   p-2   flex justify-center items-center bg-[#212223]"
            >
                <InputBox />
            </div>
        </div >
    )
};

export default ChatPage
import { ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router';
import InputBox from '../components/inputBox';
import { useSelector, useDispatch } from 'react-redux'
import { addMessages } from '../store/feature/message/messageSlice';
import socket from '../socketServer/socketServer';

import axios from 'axios';
import { useCreateChat } from '../hooks/titleHooks/titleHook';


const HomePage = () => {
    const dispatch = useDispatch()
    const { mutate, error, isLoading } = useCreateChat()

    const navigate = useNavigate()
    const [title, setTitle] = useState(null)

    const handleOnSubmit = async (data) => {

        console.log(data)
        try {
            const firstMsg = {
                _id: Date.now(),
                role: "user",
                text: data.userText,
            };

            dispatch(addMessages(firstMsg));

            mutate(data.userText, {
                onSuccess: (chat) => {
                    console.log(chat)

                    navigate(`/home/chat/${chat.chat._id}`, {
                        state: { data: firstMsg }
                    })
                    socket.emit("ai-message", {
                        chatId: chat.chat._id,
                        text: data.userText,
                    });

                }
            })

        } catch (error) {
            console.error("API ERROR:", error.response?.data || error.message);
        }
    };



    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="relative flex  flex-col justify-center h-full px-5 sm:px-0 ">

            {/* Main Chat Area */}
            <div className=" flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-semibold text-white mb-4">How can I help you today?</h1>
                </div>
            </div>


            {/* Input Area */}
            <div
                className="w-full p-6 fixed bottom-2 left-0  md:static md:flex md:justify-center"
            >
                <InputBox handleOnSubmit={handleOnSubmit} />
            </div>

        </div>
    )
}

export default HomePage
import { ChevronRight } from 'lucide-react'
import React from 'react'
import { useOutletContext } from 'react-router';
import InputBox from '../components/inputBox';

const HomePage = () => {
    const { isOpen, setIsOpen } = useOutletContext();
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
                className="w-full p-4 fixed bottom-2 left-0  md:static md:flex md:justify-center"
            >
                <InputBox />
            </div>

        </div>
    )
}

export default HomePage
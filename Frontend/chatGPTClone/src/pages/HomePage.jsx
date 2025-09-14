import { ChevronRight } from 'lucide-react'
import React from 'react'

const HomePage = ({ isOpen, setIsOpen }) => {
    return (
        <div className="relative flex  flex-col justify-center h-full px-5 sm:px-0 ">

            {/* mobile toggle button */}

            <div onClick={() => setIsOpen(true)} className='sm:hidden absolute top-0 bg-[#212223] w-[100%] h-15 flex items-center pl-1'>
                <button
                    className="p-1.5 rounded-full shadow-lg"
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Main Chat Area */}
            <div className=" flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-semibold text-white mb-4">How can I help you today?</h1>
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 ">
                <div className="max-w-xl mx-auto  ">
                    <div className="relative ">
                        <input
                            type="text"
                            placeholder="Message ChatGPT..."
                            className="w-full bg-[#191a1b] text-white rounded-full px-4 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#191a1b] "
                        />
                        <button className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white md:transform-[rotate(90deg)]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage
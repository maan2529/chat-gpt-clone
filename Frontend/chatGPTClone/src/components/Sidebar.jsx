import React from "react";
import {
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    Settings,
    Home,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";


const Sidebar = ({ isOpen, setIsOpen, error, isLoading }) => {
    const data = useSelector((state) => state.chat.chats);
    // console.log(data)
    const navigate = useNavigate()

    if (isLoading) {
        <div>Loading...</div>
    }
    if (error) {
        <div>Error in chat fatching...</div>
    }
    

    return (
        <div
            className={`fixed top-0 left-0 h-screen bg-[#181818] text-gray-200 transition-all duration-300 flex flex-col  border-r border-gray-700 z-10  ${isOpen ? " w-[260px]" : " w-0 hidden sm:block sm:w-[60px]"}`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute top-4 right-[-14px] bg-[#242929f2] hover:bg-gray-600 p-1.5 rounded-full shadow-md transition"
            >
                {isOpen ? <ChevronLeft size={18} /> : <ChevronRight className="hidden sm:block" size={18} />}
            </button >

            {/* Header */}
            < div className="p-4" >
                {
                    isOpen ? (
                        <h1 className="text-xl font-semibold mb-4" > ChatGPT Clone</h1>
                    ) : (
                        <div className="hidden sm:flex items-center justify-center">🤖</div>
                    )}
            </div >

            {/* Chat History (Scrollable) */}
            < nav className="sidebar flex-1 flex flex-col space-y-1 px-2 overflow-y-auto" >
                {/* New Chat Button */}
                < button onClick={() => navigate('/home')} className="flex items-center gap-3 hover:bg-[#282a2b] p-2 rounded-md cursor-pointer text-left w-full font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {isOpen && <span>New chat</span>}
                </button >

                {/* Chat History Items */}
                {/* map over chat response from backend */}
                {data && data.length > 0 ? (<div className="space-y-1">
                    {data?.slice().reverse().map((chat, i) => (
                        <button
                            onClick={() => navigate(`/home/chat/${chat._id}`)}
                            key={chat._id}
                            className="flex items-center gap-3 w-full hover:bg-[#282a2b] p-2 rounded-md cursor-pointer text-lg font-medium text-gray-300 hover:text-white "
                        >
                            <MessageSquare size={16} />
                            {isOpen && <span className="truncate">{chat?.title}</span>}
                        </button>
                    ))}
                </div>) : (<div className="space-y-1">
                    <div
                        onClick={() => navigate('/home')}
                        className="flex items-center  gap-3 w-full hover:bg-[#282a2b] p-2 rounded-md cursor-pointer text-md font-bold text-gray-300 hover:text-white "
                    >

                        {isOpen && <span className="truncate">No Chats Available</span>}
                    </div>
                </div>)
                }

            </nav >

            {/* Footer (Profile Section) */}
            < div className="p-3 w-full border-t border-gray-700" >
                {
                    isOpen ? (
                        <div className="flex items-center gap-3" >
                            
                            < img
                                src="https://i.pravatar.cc/100" // replace with your image
                                alt="profile"
                                className="w-9 h-9 rounded-full"
                            />

                            {/* Name + Account Type */}
                            < div >
                                <p className="text-sm font-medium">Maan</p>
                                <p className="text-xs text-gray-400">Free Plan</p>
                                {/* If premium: <p className="text-xs text-yellow-400">Premium</p> */}
                            </div>
                        </div >
                    ) : (
                        <div className="flex justify-center">
                            <img
                                src="https://i.pravatar.cc/100"
                                alt="profile"
                                className="w-8 h-8 rounded-full"
                            />
                        </div>
                    )}
            </div >
        </div >
    );
};

export default Sidebar;

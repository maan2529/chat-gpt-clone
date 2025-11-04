    import React, { useState } from "react";
    import {
        ChevronLeft,
        ChevronRight,
        MessageSquare,
        Settings,
        Home,
        LogOut,
    } from "lucide-react";
    import { useNavigate } from "react-router";
    import { useDispatch, useSelector } from "react-redux";
    import { useLogout } from "../hooks/auth/authHook";
    import { removeChatFromStore } from "../store/feature/chat/chatSlice";
    import { removeMessages } from "../store/feature/message/messageSlice";

    const Sidebar = ({ isOpen, setIsOpen, error, isLoading }) => {
        const data = useSelector((state) => state.chat.chats);
        const [isHoveringProfile, setIsHoveringProfile] = useState(false);
        const navigate = useNavigate()
        const dispatch = useDispatch();
        const { mutate: logoutUser, isPending: isLoggingOut } = useLogout();

        if (isLoading) {
            <div>Loading...</div>
        }
        if (error) {
            <div>Error in chat fatching...</div>
        }

        function handleLogout() {
            if (isLoggingOut) return;
            logoutUser(undefined, {
                onSuccess: () => {
                    dispatch(removeChatFromStore());
                    dispatch(removeMessages());
                    navigate("/");
                }
            });
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
                                className="flex items-center gap-3 w-full hover:bg-[#282a2b] p-2 rounded-md cursor-pointer text-lg font-medium text-gray-300 hover:text-white"
                            >
                                <span className="flex-shrink-0">
                                    <MessageSquare size={16} />
                                </span>
                                {isOpen && (
                                    <span className="truncate text-left">
                                        {chat?.title}
                                    </span>
                                )}
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
                <div className="p-3 w-full border-t border-gray-700">
                    {isOpen ? (
                        <div
                            className="relative flex items-center gap-3 pr-16"
                            onMouseEnter={() => setIsHoveringProfile(true)}
                            onMouseLeave={() => setIsHoveringProfile(false)}
                        >
                            <img
                                src="https://i.pravatar.cc/100"
                                alt="profile"
                                className="w-9 h-9 rounded-full"
                            />

                            {/* Name + Account Type */}
                            <div>
                                <p className="text-sm font-medium">Maan</p>
                                <p className="text-xs text-gray-400">Free Plan</p>
                            </div>

                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className={`absolute right-0 flex items-center gap-2 rounded-md bg-red-500/90 px-3 py-1 text-sm font-medium text-white transition-all duration-200 ${isHoveringProfile ? "opacity-100 translate-x-0" : "pointer-events-none opacity-0 translate-x-2"}`}
                            >
                                <LogOut size={14} />
                                {isLoggingOut ? "Logging out" : "Logout"}
                            </button>
                        </div>
                    ) : (
                        <div
                            className="relative flex justify-center"
                            onMouseEnter={() => setIsHoveringProfile(true)}
                            onMouseLeave={() => setIsHoveringProfile(false)}
                        >
                            <img
                                src="https://i.pravatar.cc/100"
                                alt="profile"
                                className="w-8 h-8 rounded-full"
                            />
                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className={`absolute -bottom-10 rounded-md bg-red-500/90 px-2 py-1 text-xs font-medium text-white transition-all duration-200 ${isHoveringProfile ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-1"}`}
                            >
                                {isLoggingOut ? "Logging..." : "Logout"}
                            </button>
                        </div>
                    )}
                </div>
            </div >
        );
    };

    export default Sidebar;

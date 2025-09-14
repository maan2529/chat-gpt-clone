import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import HomePage from "../pages/HomePage";

const MainLayout = () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="h-[100%] flex  text-white">
            {/* Sidebar */}
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

            {/* Main Content */}
            <div
                className={`flex-1 transition-all duration-300 bg-[#212223] 
                ${isOpen ? "sm:ml-[260px]" : "sm:ml-[60px]"}`}
            >
                <HomePage isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
        </div>
    );
};

export default MainLayout;

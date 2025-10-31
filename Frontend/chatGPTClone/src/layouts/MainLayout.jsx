import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import HomePage from "../pages/HomePage";
import { Outlet } from "react-router";
import { ChevronRight } from "lucide-react";
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useGetTitle } from "../hooks/titleHooks/titleHook";


const MainLayout = () => {
    const [isOpen, setIsOpen] = useState(true);

    const { data, error, isFetching } = useGetTitle();


    return (
        <div className="h-[100%] flex  text-white ">
            {/* Sidebar */}
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} error={error} isLoading={isFetching} />


            {/* mobile toggle button (afterwords make a component for this)*/}
            <div onClick={() => setIsOpen(true)} className='sm:hidden absolute top-0 bg-[#212223] w-[100%] h-14 flex items-center pl-1'>
                <button
                    className="p-1.5 rounded-full shadow-lg"
                >
                    <ChevronRight size={18} />
                </button>
            </div>


            {/* Main Content */}
            <div
                className={`flex-1 sm:mt-0 transition-all duration-300 bg-[#212223] 
                ${isOpen ? "sm:ml-[260px]" : "sm:ml-[60px]"}  h-screen`}
            >
                <Outlet context={{ isOpen, setIsOpen }} />
               
            </div>
        </div>
    );
};

export default MainLayout;

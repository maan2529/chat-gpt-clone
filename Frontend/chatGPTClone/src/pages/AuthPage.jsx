import React, { useState, useEffect } from 'react';

import LoginSignup from './LogIn';
import { Outlet } from 'react-router';
import { BrainCircuit } from 'lucide-react';
const ClaudeSignIn = () => {

    const [currentDemo, setCurrentDemo] = useState(0);


    // Demo conversations that auto-scroll
    const demoConversations = [
        {
            prompt: "Write a Python function to find the longest common subsequence between two strings.",
            response: `def longest_common_subsequence(str1, str2):
    m, n = len(str1), len(str2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if str1[i-1] == str2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]

# Example usage:
result = longest_common_subsequence("ABCDGH", "AEDFHR")
print(result)  # Output: 3`
        },
        {
            prompt: "Explain quantum computing in simple terms",
            response: "Quantum computing is like having a super-powered computer that can explore many possibilities simultaneously. While classical computers use bits (0 or 1), quantum computers use quantum bits or 'qubits' that can exist in multiple states at once through a phenomenon called superposition.\n\nImagine you're in a maze trying to find the exit. A classical computer would try one path at a time, but a quantum computer could explore all paths simultaneously, dramatically speeding up the process for certain types of problems.\n\nKey concepts:\n• Superposition: Qubits can be both 0 and 1 simultaneously\n• Entanglement: Qubits can be mysteriously connected\n• Quantum advantage: Exponentially faster for specific problems"
        },
        {
            prompt: "Create a marketing email for a sustainable coffee brand",
            response: `Subject: ☕ Brew Better, Feel Better - Your Morning Just Got an Upgrade

Hi [Name],

What if your morning coffee could change the world, one cup at a time?

At GreenBean Co., we believe great coffee shouldn't cost the earth. That's why every bean is:

✓ Ethically sourced from small-scale farmers
✓ Carbon-neutral shipping
✓ Compostable packaging
✓ Fair trade certified

This week only: Get 20% off your first order with code SUSTAINABLE20

Taste the difference that conscious choices make.

[Shop Now Button]

Cheers to better mornings,
The GreenBean Team`
        }
    ];

    // Example usage:
    // console.log(demoConversations.length); // 3
    // console.log(demoConversations[0].prompt);
    // console.log(demoConversations[1].response);

    // Auto-scroll through demos

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDemo((prev) => (prev + 1) % demoConversations.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);


    return (
        <div className="min-h-screen flex flex-col lg:flex-row" style={{ backgroundColor: '#020202' }}>
            {/* Left Side - Login Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 lg:py-12">
                {/* <LoginSignup /> */}
                <Outlet />
            </div>

            {/* Right Side - Demo Conversations (Hidden on mobile) */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden" style={{ backgroundColor: '#030303' }}>
                <div className="absolute  inset-0 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-900 opacity-20 "></div>

                <div className="relative h-full flex items-center justify-center p-6 xl:p-8  ml-[10%]">
                    <div className="max-w-xl xl:max-w-2xl w-full">
                        <div
                            key={currentDemo}
                            className="animate-fadeIn space-y-4 xl:space-y-6"
                        >
                            {/* User Message */}
                            <div className="flex justify-end">
                                <div className="rounded-2xl rounded-tr-md px-4 xl:px-6 py-3 xl:py-4 max-w-xs xl:max-w-sm text-white shadow-lg border border-gray-600" style={{ backgroundColor: '#020202' }}>
                                    <p className="text-xs xl:text-sm leading-relaxed">{demoConversations[currentDemo].prompt}</p>
                                </div>
                            </div>

                            {/* AI Response */}
                            <div className="flex justify-start">
                                <div className="rounded-2xl rounded-tl-md px-4 xl:px-6 py-3 xl:py-4 max-w-md xl:max-w-lg text-gray-100 shadow-lg border border-gray-500" style={{ backgroundColor: '#040404' }}>
                                    <div className="flex items-center mb-2 xl:mb-3">
                                        <div className="w-5 h-5 xl:w-8 xl:h-8 bg-orange-500 rounded-full flex items-center justify-center mr-2 xl:mr-3">
                                            <span className="text-white text-xs font-bold"><BrainCircuit /></span>
                                        </div>
                                        <span className="text-xs xl:text-sm text-gray-300">MyAI</span>
                                    </div>
                                    <div className="text-xs xl:text-sm leading-relaxed whitespace-pre-wrap text-white">
                                        {demoConversations[currentDemo].response}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Demo indicators */}
                <div className="absolute bottom-6 xl:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {demoConversations.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-colors ${index === currentDemo ? 'bg-orange-500' : 'bg-gray-600'
                                }`}
                        />
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                 from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                animation: fadeIn 0.8s ease-out;
                }`}
            </style>
        </div>
    );
};

export default ClaudeSignIn;
import React, { useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form';

const InputBox = ({ handleOnSubmit, isLoading = false, containerClassName = "" }) => {
    const textareaRef = useRef(null);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        
        const adjustHeight = () => {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        };
        
        textarea.addEventListener('input', adjustHeight);
        return () => textarea.removeEventListener('input', adjustHeight);
    }, []);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const { ref: formRegisterRef, ...registerProps } = register("userText", { required: true });

    function onSubmit(data) {
        handleOnSubmit(data);
        reset();
    }

    return (
        <div className={`w-full ${containerClassName}`}>
            <form className="relative" onSubmit={handleSubmit(onSubmit)}>
                <div className="relative">
                    <textarea
                        ref={(el) => {
                            textareaRef.current = el;
                            formRegisterRef(el);
                        }}
                        placeholder={isLoading ? "Creating chat..." : "Message ChatGPT..."}
                        disabled={isLoading}
                        className="w-full bg-[#2a2a2a] text-white rounded-2xl border border-gray-700/50 px-6 py-[18px] pr-16 text-[15px] leading-6 placeholder:text-gray-500 focus:outline-none focus:border-orange-300/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed resize-none max-h-48 overflow-y-auto hide-scrollbar"
                        style={{ minHeight: "60px" }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(onSubmit)();
                            }
                        }}
                        {...registerProps}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <svg
                                className="w-5 h-5 rotate-90"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                            </svg>
                        )}
                    </button>
                </div>

                <div className="flex items-center justify-between mt-2 px-2 text-xs text-gray-500">
                    {errors.userText ? <span>Message is required.</span> : <span>Press Enter to send, Shift + Enter for new line</span>}
                </div>
            </form>
        </div>
    );
}

export default InputBox
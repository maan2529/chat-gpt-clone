import React from 'react'
import { useForm } from 'react-hook-form';
const InputBox = ({ handleOnSubmit, isLoading = false }) => {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    function onSubmit(data) {
        handleOnSubmit(data)

        reset()
    }

    return (
        <div className="max-w-2xl w-full ">
            <div className="relative">
                <form className="relative" onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="text"
                        placeholder={isLoading ? "Creating chat..." : "Message ChatGPT..."}
                        disabled={isLoading}
                        className="w-full bg-[#191a1b] text-white rounded-full px-8 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#191a1b] disabled:opacity-50 disabled:cursor-not-allowed"
                        {...register('userText', { required: true })}

                    />
                    {errors.userText && <p>Chat is require.</p>}

                    {/* will remove it latter */}

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <svg
                                className="w-5 h-5 transform-[rotate(90deg)]"
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
                </form>
            </div>
        </div>
    )
}

export default InputBox
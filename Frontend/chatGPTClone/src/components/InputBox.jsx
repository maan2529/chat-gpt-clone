import React from 'react'
import { useForm } from 'react-hook-form';
const InputBox = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    return (
        <div className="max-w-2xl w-full ">
            <div className="relative">

                <input
                    type="text"
                    placeholder="Message ChatGPT..."
                    className="w-full bg-[#191a1b] text-white rounded-full px-4 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#191a1b]"
                    {...register('lastName', { required: true })}

                />
                {errors.lastName && <p>Last name is required.</p>}
                
                {/* will remove it latter */}

                <button className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
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
                </button>
            </div>
        </div>
    )
}

export default InputBox
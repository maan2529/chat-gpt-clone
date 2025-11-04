import { BrainCircuit, Eye, EyeOff } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { useRegister } from '../hooks/auth/authHook';

const LoginSignup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const { mutate, error, isSuccess } = useRegister();
    const navigate = useNavigate()

    const onSubmit = async (data) => {
        setIsLoading(true);
        // Simulate API call
        mutate(data, {
            onSuccess: (data) => {
                console.log(data)
                navigate('/home')
            },
            onError: (error) => {
                console.log(error);
            }
        })

        setTimeout(() => {
            // console.log('Form data:', data);
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="max-w-sm sm:max-w-md w-full space-y-2 sm:space-y-6">
            {/* Logo and Header */}
            <div className="text-center">
                <div className="mx-auto h-10 w-10 sm:h-12 sm:w-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                    <span className="text-white font-bold text-lg sm:text-xl"><BrainCircuit /></span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome back</h1>
                <p className="text-gray-400 text-base sm:text-lg">Sign in to your account</p>

                {error && <div className='text-red-600 font-semibold'>{error.response.data.message}</div>}

                {isSuccess && <div className='text-green-400 font-semibold '>User Created Success</div>}
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-3">

                {/* Username */}
                <div>

                    <input
                        {...register('username', { required: 'Username is required' })}
                        type="text"
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        style={{ backgroundColor: '#030303' }}
                        placeholder="Enter your username"
                    />
                    {errors.username && (
                        <p className="mt-2 text-sm text-red-400">{errors.username.message}</p>
                    )}
                </div>

                {/* First Name */}
                <div>

                    <input
                        {...register('fullName.firstName', { required: 'First name is required' })}
                        type="text"
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        style={{ backgroundColor: '#030303' }}
                        placeholder="Enter your first name"
                    />
                    {errors.fullName?.firstName && (
                        <p className="mt-2 text-sm text-red-400">{errors.fullName.firstName.message}</p>
                    )}
                </div>

                {/* Last Name */}
                <div>

                    <input
                        {...register('fullName.lastName', { required: 'Last name is required' })}
                        type="text"
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        style={{ backgroundColor: '#030303' }}
                        placeholder="Enter your last name"
                    />
                    {errors.fullName?.lastName && (
                        <p className="mt-2 text-sm text-red-400">{errors.fullName.lastName.message}</p>
                    )}
                </div>

                {/* Email Field */}
                <div>

                    <input
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                            }
                        })}
                        type="email"
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        style={{ backgroundColor: '#030303' }}
                        placeholder="Enter your email"
                    />
                    {errors.email && (
                        <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
                    )}
                </div>

                {/* Password Field */}
                <div className="relative">

                    <input
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 8,
                                message: 'Password must be at least 8 characters'
                            }
                        })}
                        type={showPassword ? "text" : "password"}
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 pr-10 text-sm sm:text-base text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        style={{ backgroundColor: '#030303' }}
                        placeholder="Enter your password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {errors.password && (
                        <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>
                    )}
                </div>

                {/* Existing "Remember me" + Button etc remain unchanged */}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full font-medium py-3 sm:py-4 px-4 rounded-lg flex items-center justify-center text-sm sm:text-base text-white hover:opacity-90 disabled:opacity-70 bg-gray-800 mt-6"

                >
                    {isLoading ? "Signing in..." : "Sign in"}
                </button>
            </form>

            <p className="text-center text-xs sm:text-sm text-gray-500">
                Already have an account?{"  "}
                <Link to="/" className="text-white hover:underline" >
                    Sign In
                </Link>
            </p>
        </div>
    )
}

export default LoginSignup;

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { BrainCircuit } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useLogin } from '../hooks/auth/authHook';


const LogIn = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const { mutate, isPending, error, success } = useLogin()
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(false);

    const onSubmit = async (data) => {

        setIsLoading(true);
        // console.log(isPending)
        // console.log(errors)

        mutate(data, {
            onSuccess: (data) => {
                console.log(data)
                setSuccessMessage(true);
                navigate('/home')
            },
            onError: (error) => {
                console.log(error)
                setErrorMessage(error.response.data.message);
            }

        })

        setTimeout(() => {
            // console.log('Form data:', data);
            setIsLoading(false);
        }, 2000);
    };



    return (
        <div className="max-w-sm sm:max-w-md w-full space-y-3 sm:space-y-4">
            {/* Logo and Header */}
            <div className="text-center">
                <div className="mx-auto h-10 w-10 sm:h-12 sm:w-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4 sm:mb-4">
                    <span className="text-white font-bold text-xl sm:text-xl"><BrainCircuit /></span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome back</h1>
                <p className="text-gray-400 text-base sm:text-lg">Sign in to your account</p>
                {/* Display error message if exists */}
                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {errorMessage}
                    </div>
                )}
                {successMessage && <div className='text-green-400 font-semibold '>User Created Success</div>}
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-3">
                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                        Email address
                    </label>
                    <input
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                            }
                        })}
                        type="email"
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-white placeholder-gray-400 border border-gray-600 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        style={{ backgroundColor: '#030303' }}
                        placeholder="Enter your email"
                    />
                    {errors.email && (
                        <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                        Password
                    </label>
                    <input
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 8,
                                message: 'Password must be at least 8 characters'
                            }
                        })}
                        type="password"
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-white placeholder-gray-400 border border-gray-600 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        style={{ backgroundColor: '#030303' }}
                        placeholder="Enter your password"
                    />
                    {errors.password && (
                        <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>
                    )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-end">
                    {/* <div className="flex items-center">
                        <input
                            {...register('remember')}
                            type="checkbox"
                            className="h-4 w-4 text-orange-500 border-gray-600 rounded focus:ring-orange-500"
                            style={{ backgroundColor: '#030303' }}
                        />
                        <label htmlFor="remember" className="ml-2 text-sm text-white">
                            Remember me
                        </label>
                    </div> */}
                    <a href="#" className="text-sm text-orange-500 hover:text-orange-400 transition-colors">
                        Forgot password?
                    </a>
                </div>

                {/* Sign In Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full font-medium py-3 sm:py-4 px-4 rounded-lg transition-colors flex items-center justify-center text-sm sm:text-base text-white hover:opacity-90 disabled:opacity-70 bg-gray-800"

                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing in...
                        </>
                    ) : (
                        'Sign in'
                    )}
                </button>
            </form>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 text-gray-400 bg-[#020202]">OR</span>
                </div>
            </div>

            {/* Social Login */}
            {/* <div className="space-y-3">
                <button
                    className="w-full font-medium py-3 sm:py-4 px-4 rounded-lg border border-gray-600 transition-colors flex items-center justify-center text-sm sm:text-base text-white hover:opacity-90 bg-gray-800"

                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>
            </div> */}


            <p className="text-center text-xs sm:text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <Link to="/signUp" className="text-white hover:underline" >
                    Sign Up
                </Link>
            </p>
        </div>
    )
}

export default LogIn
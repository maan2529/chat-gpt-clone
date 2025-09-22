import { useMutation } from "@tanstack/react-query";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function useLogin() {
    async function loginUser(data) {

        try {
            const response = await axios.post(`${backendUrl}/api/auth/login`, data, { withCredentials: true })

            return response.data
        } catch (error) {
            throw error
        }
    }
    const mutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error) => {
            console.log(error)

        }
    })

    const { mutate, isPending, error, data } = mutation;
    // console.log(data)
    return { mutate, isPending, error, data }
}
function useRegister() {
    async function registerUser(data) {

        try {
            const response = await axios.post(`${backendUrl}/api/auth/register`, data, { withCredentials: true })

            return response.data

        } catch (error) {
            throw error
        }
    }
    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error) => {
            console.log(error)

        }
    })

    const { mutate, isPending, error, data, isSuccess } = mutation;
    // console.log(data)
    return { mutate, isPending, error, data, isSuccess }
}

export {
    useLogin,
    useRegister
}
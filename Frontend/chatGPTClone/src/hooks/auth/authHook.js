import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeChatFromStore } from "../../store/feature/chat/chatSlice";
import { removeMessages } from "../../store/feature/message/messageSlice";
import { clearCache } from "../../utils/chatCache";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function useLogin() {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
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
            queryClient.clear();
            clearCache();
            dispatch(removeChatFromStore());
            dispatch(removeMessages());
            console.log(data);
        },
        onError: (error) => {
            console.log(error?.message)

        }
    })

    const { mutate, isPending, error, data } = mutation;
    // console.log(data)
    return { mutate, isPending, error, data }
}
function useRegister() {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

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

function useLogout() {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    async function logoutUser() {
        try {
            const response = await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true })
            return response.data
        } catch (error) {
            throw error
        }
    }

    const mutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: (data) => {
            queryClient.clear();
            clearCache();
            dispatch(removeChatFromStore());
            dispatch(removeMessages());
            console.log(data)
        },
        onError: (error) => {
            console.log(error?.message || error)
        }
    })

    const { mutate, isPending, error, data } = mutation;
    return { mutate, isPending, error, data }
}

export {
    useLogin,
    useRegister,
    useLogout
}
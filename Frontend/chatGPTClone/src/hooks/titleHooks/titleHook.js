import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addChatToStore, appendToChatStore } from "../../store/feature/chat/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;


function useGetTitle() {

    const dispatch = useDispatch()
    const currentChats = useSelector((state) => state.chat.chats);

    async function getAllChats() {
        const response = await axios.get(
            `${backendUrl}/api/chat/getAllChats`,
            { withCredentials: true }
        );
        // console.log("data fetched", response.data)
        return response.data;
    }

    const { data, error, isFetching } = useQuery({
        queryKey: ["chats"],
        queryFn: getAllChats,

        onSuccess: (data) => {
            if (!Array.isArray(data?.chat)) return;
            dispatch(addChatToStore(data.chat));
        },

        onError: (err) => {
            console.log(err)
        }

    });

    // bcz jab dubara refrsh karta hu  to cache se data nikal ke de raha hai aur vo onSuccess me nahi ata ,
    useEffect(() => {
        if (!Array.isArray(data?.chat)) return;

        if (data.chat.length === 0) {
            if (currentChats.length !== 0) {
                dispatch(addChatToStore([]));
            }
            return;
        }

        if (currentChats.length === 0) {
            dispatch(addChatToStore(data.chat));
            return;
        }

        const hasDifferences =
            currentChats.length !== data.chat.length ||
            currentChats.some((chat, index) => chat?._id !== data.chat[index]?._id);

        if (hasDifferences) {
            dispatch(addChatToStore(data.chat));
        }
    }, [data, dispatch, currentChats]);
    // console.log("data is ", data && data.chat)
    // if (data) {
    //     // console.log(data.chat)
    //     dispatch(addChatToStore(data.chat))
    // }

    return { data, error, isFetching };
}


function useCreateChat() {
    const queryClient = useQueryClient()
    const dispatch = useDispatch()
    async function createChats(userText) {

        try {
            const response = await axios.post(
                `${backendUrl}/api/chat/create-chat`,
                { title: userText },
                { withCredentials: true }
            );
            // console.log(response.data)
            return response.data;
        } catch (error) {
            console.error("API Error in createChats:", error);
            throw error;
        }
    }

    const { mutate, data, error, isLoading } = useMutation({
        mutationFn: createChats,
        onSuccess: (data) => {
            dispatch(appendToChatStore(data.chat))
            queryClient.invalidateQueries({ queryKey: ["chats"] });
        },
        onError: (error) => {
            console.error("Mutation onError called with:", error);
        }
    });

    let title = data && data.chat

    return { mutate, title, error, isLoading };
}



export { useGetTitle, useCreateChat }

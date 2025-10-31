import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addChatToStore, appendToChatStore } from "../../store/feature/chat/chatSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;


function useGetTitle() {

    const dispatch = useDispatch()
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
            // console.log(data)
            dispatch(addChatToStore(data.chat))

        },

        onError: (err) => {
            console.log(err)
        }

    });

    // bcz jab dubara refrsh karta hu  to cache se data nikal ke de raha hai aur vo onSuccess me nahi ata ,
    useEffect(() => {
        if (data?.chat) {
            console.log("useEffect called with:", data.chat);
            dispatch(addChatToStore(data.chat));
        }
    }, [data, dispatch]);
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
            console.log("Mutation onSuccess called with:", data.chat);
            // queryClient.invalidateQueries(['chats']); // refech chats 
            // queryClient.setQueriesData(['chats'], (old) => [...old, data]);
            //saving new data in cache 
        },
        onError: (error) => {
            console.error("Mutation onError called with:", error);
        }
    });

    let title = data && data.chat

    console.log("title", title);

    return { mutate, title, error, isLoading };
}



export { useGetTitle, useCreateChat }

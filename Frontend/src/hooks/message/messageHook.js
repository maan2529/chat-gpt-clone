// hooks/useGetAllChats.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { setAllMessages } from "../../store/feature/message/messageSlice";
import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { getCachedMessages, cacheMessages, isChatCached } from "../../utils/chatCache";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function useGetAllChats(chatId) {
    const dispatch = useDispatch();
    const isInitialLoad = useRef(true);

    async function fetchData() {
        try {
            const response = await axios.get(
                `${backendUrl}/api/message/getAllMessages/${chatId}`,
                { withCredentials: true }
            );

            const messages = response.data?.data || [];

            // Cache the messages
            cacheMessages(chatId, messages);

            // Update Redux
            dispatch(setAllMessages(messages));

            return messages;
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            throw error;
        }
    }

    const { data, error, isLoading, isFetching } = useQuery({
        queryKey: ["getAllChats", chatId],
        queryFn: fetchData,
        enabled: !!chatId,
        staleTime: 1000 * 60 * 5, // 5 minutes - consider cached data fresh
        gcTime: 1000 * 60 * 15, // 15 minutes - keep in React Query cache
        // Don't refetch on window focus for cached chats
        refetchOnWindowFocus: (query) => !isChatCached(chatId),
    });

    // Handle initial cache load and Redux hydration
    useEffect(() => {
        if (!chatId) return;

        // Check cache first
        const cachedMessages = getCachedMessages(chatId);

        if (cachedMessages && isInitialLoad.current) {
            // Load from cache immediately
            dispatch(setAllMessages(cachedMessages));
            console.log(`Loaded ${cachedMessages.length} messages from cache for chat: ${chatId}`);
        }

        isInitialLoad.current = false;

        // Reset flag when chatId changes
        return () => {
            isInitialLoad.current = true;
        };
    }, [chatId, dispatch]);

    // Update Redux when fresh data arrives from API
    useEffect(() => {
        if (data && !isLoading) {
            dispatch(setAllMessages(data));
            console.log(`Loaded ${data.length} messages from API for chat: ${chatId}`);
        }
    }, [data, dispatch, isLoading, chatId]);

    return {
        data,
        error,
        isLoading,
        isFetching,
        isCached: isChatCached(chatId),
        hasData: !!data?.length
    };
}

export default useGetAllChats;
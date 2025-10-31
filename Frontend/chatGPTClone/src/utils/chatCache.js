// utils/chatCache.js
const CHAT_CACHE_KEY = "ai_chat_cache_v1";
const MAX_CACHED_CHATS = 3;

// Cache structure: { order: [chatId1, chatId2, chatId3], data: { chatId1: messages[], chatId2: messages[] } }

function loadCache() {
    try {
        const raw = localStorage.getItem(CHAT_CACHE_KEY);
        if (!raw) return { order: [], data: {} };

        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.order) || !parsed.data) {
            return { order: [], data: {} };
        }
        return parsed;
    } catch (error) {
        console.error("Failed to load chat cache:", error);
        return { order: [], data: {} };
    }
}

function saveCache(cache) {
    try {
        localStorage.setItem(CHAT_CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.error("Failed to save chat cache:", error);
    }
}

// Get cached messages for a specific chat
export function getCachedMessages(chatId) {
    if (!chatId) return null;

    const cache = loadCache();
    const messages = cache.data[chatId];

    if (messages) {
        // Move this chat to the most recent position (LRU)
        touchChat(chatId);
        return messages;
    }

    return null;
}

// Save messages for a chat and manage FIFO
export function cacheMessages(chatId, messages) {
    if (!chatId || !Array.isArray(messages)) return;

    const cache = loadCache();

    // Remove chatId from current position if it exists
    const existingIndex = cache.order.indexOf(chatId);
    if (existingIndex !== -1) {
        cache.order.splice(existingIndex, 1);
    }

    // Add to front (most recent)
    cache.order.unshift(chatId);
    cache.data[chatId] = messages;

    // Implement FIFO: remove oldest chats if we exceed limit
    while (cache.order.length > MAX_CACHED_CHATS) {
        const oldestChatId = cache.order.pop();
        delete cache.data[oldestChatId];
    }

    saveCache(cache);
}

// Mark a chat as recently accessed (move to front)
function touchChat(chatId) {
    const cache = loadCache();
    const index = cache.order.indexOf(chatId);

    if (index > 0) {
        // Move to front
        cache.order.splice(index, 1);
        cache.order.unshift(chatId);
        saveCache(cache);
    }
}

// Update cached messages for a specific chat (for real-time updates)
export function updateCachedMessages(chatId, messages) {
    if (!chatId || !Array.isArray(messages)) return;

    const cache = loadCache();

    // Only update if this chat is already cached
    if (cache.data[chatId]) {
        cache.data[chatId] = messages;
        touchChat(chatId);
        saveCache(cache);
    }
}

// Remove a chat from cache
export function removeChatFromCache(chatId) {
    if (!chatId) return;

    const cache = loadCache();
    const index = cache.order.indexOf(chatId);

    if (index !== -1) {
        cache.order.splice(index, 1);
        delete cache.data[chatId];
        saveCache(cache);
    }
}

// Check if a chat is cached
export function isChatCached(chatId) {
    if (!chatId) return false;
    const cache = loadCache();
    return cache.data.hasOwnProperty(chatId);
}

// Get cache statistics (for debugging)
export function getCacheStats() {
    const cache = loadCache();
    return {
        cachedChats: cache.order.length,
        maxCapacity: MAX_CACHED_CHATS,
        chatIds: [...cache.order], // most recent first
        totalMessages: Object.values(cache.data).reduce((sum, messages) => sum + messages.length, 0)
    };
}

// Clear entire cache
export function clearCache() {
    try {
        localStorage.removeItem(CHAT_CACHE_KEY);
    } catch (error) {
        console.error("Failed to clear cache:", error);
    }
}
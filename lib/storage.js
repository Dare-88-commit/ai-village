const CHAT_STORAGE_KEY = 'ai-village-chat';

export function saveChat(messages) {
    try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
        console.error("Failed to save chat:", error);
    }
}

export function loadChat() {
    try {
        const saved = localStorage.getItem(CHAT_STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error("Failed to load chat:", error);
        return null;
    }
}

export function clearChat() {
    try {
        localStorage.removeItem(CHAT_STORAGE_KEY);
    } catch (error) {
        console.error("Failed to clear chat:", error);
    }
}
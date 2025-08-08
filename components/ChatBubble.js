export default function ChatBubble({ text, isUser }) {
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-2 animate-fade-in`}>
            {/* AI Avatar (only shown for AI messages) */}
            {!isUser && (
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                    AI
                </div>
            )}

            {/* Message Bubble */}
            <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 shadow-sm ${isUser
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                    }`}
            >
                {text.split('\n').map((para, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>{para}</p>
                ))}
            </div>

            {/* User Avatar Placeholder (optional) */}
            {isUser && (
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                    YOU
                </div>
            )}
        </div>
    );
}
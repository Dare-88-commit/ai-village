import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { getAnswer } from '../lib/qa';
import { saveChat, loadChat, clearChat } from '../lib/storage';
import { Send, Trash2, Mic } from 'lucide-react';
import Link from 'next/link';
import ChatBubble from '../components/ChatBubble';

const DEFAULT_MESSAGE = {
  text: "Hi! I'm your offline study buddy. Ask about science or math!",
  isUser: false
};

export default function Home() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([DEFAULT_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize on client-side only
  useEffect(() => {
    setIsHydrated(true);

    // Load saved chat from localStorage
    const savedChat = loadChat();
    if (savedChat) {
      setMessages(savedChat);
    }

    // Initialize speech recognition
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (err) => {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Save to localStorage whenever messages change
  useEffect(() => {
    if (isHydrated) {
      saveChat(messages);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isHydrated]);

  const startVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in your browser');
      return;
    }
    setIsListening(true);
    recognitionRef.current.start();
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const newMessages = [...messages, { text: input, isUser: true }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const answer = await getAnswer(input);
      setMessages([...newMessages, { text: answer, isUser: false }]);
    } catch (error) {
      setMessages([...newMessages, {
        text: "I'm having some technical difficulties. Try again later.",
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear the conversation?')) {
      clearChat();
      setMessages([DEFAULT_MESSAGE]);
    }
  };

  if (!isHydrated) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Loading AI Village...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900">
      <Head>
        <title>AI Village - Offline Study Assistant</title>
        <meta name="description" content="Curriculum-aligned answers without internet" />
        <link rel="icon" href="/images/logo.png" />
      </Head>

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-green-600 p-4 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/images/logo.png"
              alt="AI Village Logo"
              className="w-10 h-10 rounded-full mr-3 object-contain border-2 border-white/30"
              width={40}
              height={40}
            />
            <div>
              <h1 className="text-xl font-bold tracking-tight">AI Village</h1>
              <p className="text-sm text-white/80 -mt-1 font-medium">Offline Education for All</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Clear conversation"
            >
              <Trash2 size={18} />
            </button>
            <Link
              href="/about"
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
            >
              About
            </Link>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="container mx-auto max-w-3xl space-y-3">
          {messages.map((msg, i) => (
            <ChatBubble key={i} text={msg.text} isUser={msg.isUser} />
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-2xl rounded-bl-none px-4 py-2 shadow-sm border border-gray-100 dark:border-gray-600">
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="container mx-auto max-w-3xl flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about photosynthesis..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Send size={18} />
            )}
          </button>
          <button
            onClick={startVoiceInput}
            disabled={isListening}
            className={`rounded-full w-12 h-12 flex items-center justify-center transition-colors ${isListening
              ? 'bg-red-600 animate-pulse'
              : 'bg-green-600 hover:bg-green-700'
              } text-white disabled:opacity-50`}
            title={isListening ? "Listening..." : "Tap to speak"}
          >
            <Mic size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
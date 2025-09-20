import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Import axios
import VoiceBot from '../assets/VoiceBot.png';


const SendIcon = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
    >
        <path
            d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2 .01 7z"
            fill="currentColor"
        />
    </svg>
);

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hi! How can I help you with the Markr system today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isLoading, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {

            const res = await axios.post('http://localhost:6969/api/chatbot', {
                message: input // Correctly send the message in the request body
            });

            const botMessage = { sender: 'bot', text: res.data.response };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Failed to fetch chatbot response:", error);
            setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I am having trouble connecting. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-50 font-sans">

            <div className={`w-80 h-[400px] bg-white rounded-xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>

                <div className="bg-gray-800 text-white p-4 rounded-t-xl flex justify-between items-center shadow-md">
                    <h3 className="font-bold text-lg">Markr Assistant</h3>
                    <button onClick={() => setIsOpen(false)} className="text-2xl leading-none hover:text-gray-300">&times;</button>
                </div>


                <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
                    <div className="flex flex-col space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="px-4 py-2 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                                    <div className="flex items-center justify-center gap-1.5">
                                        <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>


                <form onSubmit={handleSubmit} className="p-3 border-t bg-white rounded-b-xl flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" disabled={isLoading} className="ml-3 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-blue-700 disabled:bg-blue-300 transition-colors">
                        <SendIcon />
                    </button>
                </form>
            </div>


            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`absolute bottom-0 right-0 w-14 h-14 flex items-center justify-center drop-shadow-2xl transition-all duration-300 ease-in-out hover:scale-110 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
            >
                <img src={VoiceBot} alt="Chatbot" className="w-13 h-13" />
            </button>
        </div>
    );
};

export default Chatbot;
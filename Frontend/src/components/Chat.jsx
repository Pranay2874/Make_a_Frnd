// Chat.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom"; 
import SocketConnection from "../Socket";

const Chat = () => {
    const { usertargetId } = useParams();
    const location = useLocation();
    const partnerUsername = location.state?.partnerUsername || "Friend";
    const navigate = useNavigate();
    
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isConnected, setIsConnected] = useState(true);
    const socket = SocketConnection();

    const messagesEndRef = useRef(null);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        socket.on("receiveMessage", (message) => {
            setMessages((prevMessages) => [...prevMessages, { ...message, isMine: false }]);
        });
        
        socket.on("partnerDisconnected", () => {
            setIsConnected(false);
            setMessages((prev) => [...prev, { text: `${partnerUsername} has disconnected. 😔`, isSystem: true }]);
        });

        return () => {
            socket.off("receiveMessage");
            socket.off("partnerDisconnected");
        };
    }, [socket, partnerUsername]);

    const sendMessage = () => {
        if (newMessage.trim() && isConnected) {
            const messageText = newMessage.trim();
            
            socket.emit("sendMessage", { partnerId: usertargetId, message: messageText });
            
            setMessages((prevMessages) => [...prevMessages, { 
                senderUsername: localStorage.getItem("username") || 'You', 
                text: messageText, 
                isMine: true 
            }]);
            
            setNewMessage("");
        }
    };
    
    // NEW: Skip Chat Function
    const handleSkipChat = () => {
        socket.emit("disconnectFromChat");
        setIsConnected(false);
        navigate("/home");
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Chat Header */}
            <div className="p-4 bg-white shadow-md flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-700">
                    Chatting with: <span className="text-[#4071f4]">{partnerUsername}</span>
                </h3>
                {/* NEW: Skip Chat Button */}
                <button
                    onClick={handleSkipChat}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition duration-200"
                >
                    Skip Chat 
                </button>
                
                {/* Disconnected message area */}
                {!isConnected && (
                    <p className="text-red-500 text-sm mt-1 absolute bottom-0 left-0 w-full text-center p-2 bg-red-100">Chat ended. Your friend disconnected.</p>
                )}
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${
                            msg.isSystem 
                                ? 'bg-yellow-100 text-sm italic text-center w-full'
                                : msg.isMine 
                                    ? 'bg-[#4071f4] text-white' 
                                    : 'bg-white text-gray-800 border border-gray-200'
                        }`}>
                            {!msg.isSystem && <p className={`font-semibold text-xs mb-1 opacity-80 ${msg.isMine ? 'text-white' : 'text-gray-600'}`}>{msg.senderUsername}</p>}
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex space-x-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={isConnected ? "Type your message..." : "Cannot send message. Partner disconnected."}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4071f4]"
                        disabled={!isConnected}
                        // Corrected onKeyPress handler to ensure clean syntax for build
                        onKeyPress={(e) => { 
                            if (e.key === 'Enter') {
                                sendMessage();
                            }
                        }}
                    />
                    <button 
                        onClick={sendMessage}
                        className={`px-4 py-2 font-semibold rounded-lg transition duration-200 ${
                            isConnected && newMessage.trim()
                                ? 'bg-[#4071f4] text-white hover:bg-[#345edb]' 
                                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        }`}
                        disabled={!isConnected || !newMessage.trim()}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
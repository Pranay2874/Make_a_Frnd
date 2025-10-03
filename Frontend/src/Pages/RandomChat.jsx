// randomchat.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SocketConnection from "../Socket";

const RandomChat = () => {
    const navigate = useNavigate();
    const [waitingMessage, setWaitingMessage] = useState("");
    const socket = SocketConnection(); // Get the singleton socket instance

    useEffect(() => {
        socket.emit("joinRandomChat");

        socket.on("waitingForMatch", (message) => {
            setWaitingMessage(message);
        });

        socket.on("startChat", ({ partnerSocketId, partnerUsername }) => {
            console.log("Started chat with:", partnerUsername, partnerSocketId);
            // Redirect to the dedicated chat route with the partner's ID
            navigate(`/chat/${partnerSocketId}`, { state: { partnerUsername } }); 
        });

        return () => {
            socket.off("waitingForMatch");
            socket.off("startChat");
        };
    }, [socket, navigate]); // socket dependency is safe now as it's a singleton

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Random Chat: Finding a Friend</h2>
            <p className="text-gray-600">{waitingMessage}</p>
        </div>
    );
};

export default RandomChat;
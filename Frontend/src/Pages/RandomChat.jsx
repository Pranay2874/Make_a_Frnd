import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import SocketConnection from "../Socket";

const RandomChat = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [waitingMessage, setWaitingMessage] = useState("");
    const socket = SocketConnection();

    useEffect(() => {
        socket.emit("joinRandomChat");

        socket.on("waitingForMatch", (message) => {
            setWaitingMessage(message); // Display waiting message while finding a random match
        });

        socket.on("startChat", ({ partnerSocketId, partnerUsername }) => {
            console.log("Started chat with:", partnerUsername, partnerSocketId);
            // Redirect to the dedicated chat route with the partner's ID
            navigate(`/chat/${partnerSocketId}`, { state: { partnerUsername } }); 
        });

        // The user doesn't stay on this screen once a match is found, 
        // so no message sending logic is needed here.

        return () => {
            socket.off("waitingForMatch");
            socket.off("startChat");
        };
    }, [socket, navigate]);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Random Chat: Finding a Friend</h2>
            <p className="text-gray-600">{waitingMessage}</p>
        </div>
    );
};

export default RandomChat;
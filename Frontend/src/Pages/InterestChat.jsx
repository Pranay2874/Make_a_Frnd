import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SocketConnection from "../Socket";

const InterestChat = () => {
    const { interest } = useParams();
    const [waitingMessage, setWaitingMessage] = useState("");
    const socket = SocketConnection();
    const navigate = useNavigate();
    const decodedInterest = decodeURIComponent(interest); // Decode the URL parameter

    useEffect(() => {
        // Emit interest to the server
        socket.emit("joinInterestChat", decodedInterest);

        socket.on("waitingForMatch", (message) => {
            setWaitingMessage(message);
        });

        socket.on("startChat", (data) => {
            console.log("Started chat with:", data.partnerUsername);
            // Navigate to the chat page once a match is found
            navigate(`/chat/${data.partnerSocketId}`, { state: { partnerUsername: data.partnerUsername } });
        });
        
        // Handle the 30-second timeout from the server
        socket.on("noInterestMatchFound", () => {
            setWaitingMessage("No one found with that interest. Switching to Random Chat...");
            // Automatically switch to random chat after a brief message delay
            setTimeout(() => {
                navigate("/RandomChat"); 
            }, 2000); 
        });

        return () => {
            socket.off("waitingForMatch");
            socket.off("startChat");
            socket.off("noInterestMatchFound");
        };
    }, [socket, decodedInterest, navigate]);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Interest Chat</h2>
            <p className="text-lg mb-2">You are searching for: <span className="font-semibold text-indigo-600">{decodedInterest}</span></p>
            <p className="text-gray-600">{waitingMessage}</p>
        </div>
    );
};

export default InterestChat;
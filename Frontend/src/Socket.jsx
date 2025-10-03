// socket.jsx
import io from "socket.io-client";
import { BACKEND_URL } from "../config"; // Assuming BACKEND_URL is defined elsewhere

// Declare a variable to hold the single socket instance
let socket; 

const SocketConnection = () => {
    // Check if the socket is already created
    if (!socket) {
        // Create the connection only once
        socket = io(BACKEND_URL); 
        
        // Optional: Add listeners for debugging the connection state
        // socket.on("connect", () => console.log("Socket connected:", socket.id));
        // socket.on("disconnect", () => console.log("Socket disconnected"));
    }
    return socket; // Return the existing or newly created instance
};

export default SocketConnection;
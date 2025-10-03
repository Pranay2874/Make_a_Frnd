import io from "socket.io-client";
import { BACKEND_URL } from "../config";

let socket; // Declare the socket variable globally

const SocketConnection = () => {
  if (!socket) { // Only create a new connection if it doesn't exist already
    socket = io(BACKEND_URL, {
      transports: ["websocket"], // Optional: Ensures WebSocket is used for transport
      reconnect: true, // Automatically reconnect if the connection is lost
    });

    socket.on("connect_error", (err) => {
      console.error("Connection failed:", err); // Handle connection errors
    });
  }

  return socket;
};

export default SocketConnection;

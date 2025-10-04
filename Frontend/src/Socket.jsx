import io from "socket.io-client";
import { BACKEND_URL } from "../config"; 
let socket; 

const SocketConnection = () => {

    if (!socket) {
        socket = io(BACKEND_URL);   
    }
    return socket; 
};

export default SocketConnection;
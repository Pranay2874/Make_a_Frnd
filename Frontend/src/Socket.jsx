import io from "socket.io-client";
import { BACKEND_URL } from "../config";

const SocketConnection = () => {
  return io(BACKEND_URL); // Connect to the backend using Socket.IO
};

export default SocketConnection;

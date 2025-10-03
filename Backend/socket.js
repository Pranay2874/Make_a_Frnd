const socket = require("socket.io");

// Store users based on interest for Interest Chat
// activeUsers[interest] will hold an array of { id: socket.id, username: string }
let activeUsers = {};
// Store users in the Random Chat queue
// randomChatQueue will hold an array of { id: socket.id, username: string }
let randomChatQueue = [];
// Store currently matched pairs: { [socketId1]: socketId2, [socketId2]: socketId1 }
let matchedPairs = {};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173", // Frontend URL
      methods: ["GET", "POST"]
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    let currentUser = null; // To store the connected user's data (e.g., username)

    // A crucial step: Users should authenticate/identify themselves after connecting.
    // For simplicity, we'll assume a 'setUser' event is sent from the frontend after successful login/signup.
    socket.on("setUser", (username) => {
      currentUser = { id: socket.id, username };
      console.log(`User ${username} set for socket ${socket.id}`);
    });

    // Handle Random Chat join
    socket.on("joinRandomChat", () => {
      if (!currentUser) return socket.emit("error", "User not identified.");
      
      // Prevent user from joining if they are already waiting or matched
      if (randomChatQueue.some(u => u.id === socket.id) || Object.keys(matchedPairs).includes(socket.id)) {
        return;
      }

      if (randomChatQueue.length > 0) {
        // Match found
        const matchedUser = randomChatQueue.shift(); // Get the first user
        
        // Establish the match
        matchedPairs[currentUser.id] = matchedUser.id;
        matchedPairs[matchedUser.id] = currentUser.id;

        io.to(matchedUser.id).emit("startChat", { partnerSocketId: currentUser.id, partnerUsername: currentUser.username });
        io.to(currentUser.id).emit("startChat", { partnerSocketId: matchedUser.id, partnerUsername: matchedUser.username });
        console.log(`Random match: ${currentUser.username} (${currentUser.id}) and ${matchedUser.username} (${matchedUser.id})`);
      } else {
        // No match, join queue
        randomChatQueue.push(currentUser);
        socket.emit("waitingForMatch", "Waiting for a random chat partner...");
        console.log(`${currentUser.username} (${currentUser.id}) added to random queue.`);
      }
    });

    // Handle Interest Chat join
    socket.on("joinInterestChat", (interest) => {
      if (!currentUser) return socket.emit("error", "User not identified.");
      const normalizedInterest = interest.toLowerCase().trim();

      // Check for existing match in the interest queue
      if (activeUsers[normalizedInterest] && activeUsers[normalizedInterest].length > 0) {
        // Match found
        const matchedUser = activeUsers[normalizedInterest].shift();

        // Establish the match
        matchedPairs[currentUser.id] = matchedUser.id;
        matchedPairs[matchedUser.id] = currentUser.id;

        io.to(matchedUser.id).emit("startChat", { partnerSocketId: currentUser.id, partnerUsername: currentUser.username });
        io.to(currentUser.id).emit("startChat", { partnerSocketId: matchedUser.id, partnerUsername: matchedUser.username });
        console.log(`Interest match (${normalizedInterest}): ${currentUser.username} and ${matchedUser.username}`);
      } else {
        // No match, join interest queue
        if (!activeUsers[normalizedInterest]) activeUsers[normalizedInterest] = [];
        activeUsers[normalizedInterest].push(currentUser);
        socket.emit("waitingForMatch", `Looking for someone interested in: ${normalizedInterest}`);

        // Set a timeout to automatically switch to Random Chat (30 seconds)
        const timeout = setTimeout(() => {
          // Check if the user is still in the interest queue
          activeUsers[normalizedInterest] = activeUsers[normalizedInterest].filter(u => u.id !== socket.id);
          
          // Switch to Random Chat
          socket.emit("noInterestMatchFound"); // Frontend will handle cleanup and re-emit joinRandomChat
          console.log(`${currentUser.username} timed out for interest ${normalizedInterest}.`);
        }, 30000); // 30 seconds
        
        // Store the timeout ID on the socket for cleanup if a match happens early
        socket.interestTimeout = timeout;
      }
    });
    
    // Handle message sending
    socket.on("sendMessage", (data) => {
      const partnerId = matchedPairs[socket.id];
      if (partnerId) {
        io.to(partnerId).emit("receiveMessage", { 
          senderId: socket.id, 
          senderUsername: currentUser?.username || 'Unknown', // Use username
          text: data.message 
        });
      }
    });

    // Handle disconnections
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      
      // Clear interest timeout if it exists
      if (socket.interestTimeout) {
          clearTimeout(socket.interestTimeout);
      }
      
      // Remove from the Random Chat queue
      randomChatQueue = randomChatQueue.filter(u => u.id !== socket.id);

      // Remove from active users list based on interest
      for (const interest in activeUsers) {
        activeUsers[interest] = activeUsers[interest].filter(u => u.id !== socket.id);
      }
      
      // Handle cleanup for matched user
      const partnerId = matchedPairs[socket.id];
      if (partnerId) {
          io.to(partnerId).emit("partnerDisconnected"); // Notify the partner
          delete matchedPairs[socket.id];
          delete matchedPairs[partnerId];
          console.log(`Match dissolved between ${socket.id} and ${partnerId}`);
      }
    });
  });
};

module.exports = initializeSocket;
const socket = require("socket.io");

// Store users based on interest for Interest Chat
let activeUsers = {};
// Store users in the Random Chat queue
let randomChatQueue = [];
// Store currently matched pairs: { [socketId1]: socketId2, [socketId2]: socketId1 }
let matchedPairs = {};

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: ["http://localhost:5173", "https://make-a-frnd.vercel.app"],
            methods: ["GET", "POST"],
        },
    });

    // Helper function to dissolve a match
    const dissolveMatch = (userSocketId) => {
        const partnerId = matchedPairs[userSocketId];
        if (partnerId) {
            io.to(partnerId).emit("partnerDisconnected"); // Notify the partner
            delete matchedPairs[userSocketId];
            delete matchedPairs[partnerId];
            console.log(`Match dissolved between ${userSocketId} and ${partnerId}`);
            return true;
        }
        return false;
    };

    // Helper function to remove a user from all queues
    const removeFromAllQueues = (userId) => {
        let wasInQueue = false;
        // 1. Random Chat Queue
        const initialRandomLength = randomChatQueue.length;
        randomChatQueue = randomChatQueue.filter(u => u.id !== userId);
        if (randomChatQueue.length < initialRandomLength) wasInQueue = true;

        // 2. Interest Chat Queues
        for (const interest in activeUsers) {
            const initialInterestLength = activeUsers[interest].length;
            activeUsers[interest] = activeUsers[interest].filter(u => u.id !== userId);
            // Clean up empty interest arrays
            if (activeUsers[interest].length === 0) {
                delete activeUsers[interest];
            } else if (activeUsers[interest].length < initialInterestLength) {
                wasInQueue = true;
            }
        }
        return wasInQueue;
    };

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        let currentUser = null; 

        // CRITICAL STEP: Frontend MUST emit 'setUser' immediately after connecting
        socket.on("setUser", (username) => {
            currentUser = { id: socket.id, username };
            console.log(`User ${username} set for socket ${socket.id}`);
            
            // Clean up any stale state on connection/re-identification
            removeFromAllQueues(socket.id);
            dissolveMatch(socket.id);
        });

        socket.on("disconnectFromChat", () => {
            if (dissolveMatch(socket.id)) {
                console.log(`${currentUser?.username} intentionally disconnected from chat.`);
            } else {
                console.log(`${currentUser?.username} tried to skip, but wasn't in a match.`);
            }
        });

        // Handle Random Chat join
        socket.on("joinRandomChat", () => {
            if (!currentUser) return socket.emit("error", "User not identified.");
            if (matchedPairs[socket.id]) return;
            
            removeFromAllQueues(socket.id); // Clear from Interest Queue

            if (randomChatQueue.length > 0) {
                const matchedUser = randomChatQueue.shift();
                
                matchedPairs[currentUser.id] = matchedUser.id;
                matchedPairs[matchedUser.id] = currentUser.id;

                io.to(matchedUser.id).emit("startChat", { partnerSocketId: currentUser.id, partnerUsername: currentUser.username });
                io.to(currentUser.id).emit("startChat", { partnerSocketId: matchedUser.id, partnerUsername: matchedUser.username });
                console.log(`Random match: ${currentUser.username} and ${matchedUser.username}`);
            } else {
                randomChatQueue.push(currentUser);
                socket.emit("waitingForMatch", "Waiting for a random chat partner...");
                console.log(`${currentUser.username} added to random queue.`);
            }
        });

        // Handle Interest Chat join
        socket.on("joinInterestChat", (interest) => {
            if (!currentUser) return socket.emit("error", "User not identified.");
            const normalizedInterest = interest.toLowerCase().trim();

            if (matchedPairs[socket.id]) return;
            
            removeFromAllQueues(socket.id); // Clear from Random Queue

            // Clear any previous interest timeout before starting a new one
            if (socket.interestTimeout) {
                clearTimeout(socket.interestTimeout);
                delete socket.interestTimeout;
            }

            if (activeUsers[normalizedInterest] && activeUsers[normalizedInterest].length > 0) {
                const matchedUser = activeUsers[normalizedInterest].shift();
                
                // Establish the match
                matchedPairs[currentUser.id] = matchedUser.id;
                matchedPairs[matchedUser.id] = currentUser.id;

                io.to(matchedUser.id).emit("startChat", { partnerSocketId: currentUser.id, partnerUsername: currentUser.username });
                io.to(currentUser.id).emit("startChat", { partnerSocketId: matchedUser.id, partnerUsername: matchedUser.username });
                console.log(`Interest match (${normalizedInterest}): ${currentUser.username} and ${matchedUser.username}`);
            } else {
                if (!activeUsers[normalizedInterest]) activeUsers[normalizedInterest] = [];
                activeUsers[normalizedInterest].push(currentUser);
                socket.emit("waitingForMatch", `Looking for someone interested in: ${normalizedInterest}`);

                // Set a timeout to automatically switch to Random Chat (30 seconds)
                const timeout = setTimeout(() => {
                    const isStillWaiting = activeUsers[normalizedInterest]?.some(u => u.id === socket.id);
                    if (isStillWaiting) {
                        // Remove from interest queue
                        activeUsers[normalizedInterest] = activeUsers[normalizedInterest].filter(u => u.id !== socket.id);
                        
                        // Switch to Random Chat (Client will handle re-emission)
                        socket.emit("noInterestMatchFound"); 
                        console.log(`${currentUser.username} timed out for interest ${normalizedInterest}.`);
                    }
                    delete socket.interestTimeout; // Clear the reference regardless
                }, 30000); 
                
                socket.interestTimeout = timeout;
            }
        });
        
        // Handle message sending
        socket.on("sendMessage", (data) => {
            const partnerId = matchedPairs[socket.id];
            if (partnerId) {
                io.to(partnerId).emit("receiveMessage", { 
                    senderId: socket.id, 
                    senderUsername: currentUser?.username || 'Unknown',
                    text: data.message 
                });
            } else {
                socket.emit("error", "You are not currently matched with anyone.");
            }
        });

        // Handle disconnections
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            
            if (socket.interestTimeout) {
                clearTimeout(socket.interestTimeout);
                delete socket.interestTimeout;
            }
            
            removeFromAllQueues(socket.id);
            dissolveMatch(socket.id); // Check if they were in a match
        });
    });
};

module.exports = initializeSocket;
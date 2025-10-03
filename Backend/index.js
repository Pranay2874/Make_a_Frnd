require("dotenv").config({ path: "./.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require('http');

const initializeSocket = require("./socket");

const userRouter = require("./user"); // Import user routes

const app = express();
const server = http.createServer(app);
initializeSocket(server);


const allowedOrigins = [
    "http://localhost:5173",          // Local Development URL
    "https://make-a-frnd.vercel.app" // Deployed Frontend URL (Vercel)
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRouter);

app.get("/", (req, res) => {
    res.send("MakeAFRnd Backend is Running");
});

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
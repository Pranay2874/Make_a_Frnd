// profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { BACKEND_URL } from "../../config"; 
import SocketConnection from "../Socket";
const Profile = () => {
    const [username, setUsername] = useState("Loading...");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newUsername, setNewUsername] = useState(""); // State for new username input
    const [updateMessage, setUpdateMessage] = useState(null); // Feedback for update
    const [updateLoading, setUpdateLoading] = useState(false);
    const navigate = useNavigate();

    const fetchProfile = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/signin");
            return;
        }

        try {
            const response = await axios.get(`${BACKEND_URL}/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            const currentUsername = response.data.username;
            setUsername(currentUsername);
            setNewUsername(currentUsername); // Initialize input with current username
            setLoading(false);
        } catch (err) {
            // ... (Error handling remains the same) ...
            console.error("Profile fetch error:", err);
            setError("Failed to load profile. Please sign in again.");
            setLoading(false);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                navigate("/signin");
            }
        }
    };
    
    useEffect(() => {
        fetchProfile();
    }, [navigate]);

    // ==========================================================
    // NEW: Handle Username Update
    // ==========================================================
    const handleUpdateUsername = async () => {
        if (newUsername.trim().toLowerCase() === username.toLowerCase()) {
            setUpdateMessage({ type: 'info', text: "Username is the same. No update needed." });
            return;
        }

        if (newUsername.trim().length < 3) {
             setUpdateMessage({ type: 'error', text: "Username must be at least 3 characters long." });
            return;
        }

        setUpdateLoading(true);
        setUpdateMessage(null);
        const token = localStorage.getItem("token");

        try {
            const response = await axios.put(`${BACKEND_URL}/update-username`, 
                { newUsername: newUsername.trim() },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            const updatedUsername = response.data.username;
            setUsername(updatedUsername); // Update display state
            localStorage.setItem("username", updatedUsername); // Update local storage
            setUpdateMessage({ type: 'success', text: "Username changed successfully! 🎉" });
            
            // Re-identify the user to the socket server with the new name
            SocketConnection().emit("setUser", updatedUsername); 
        } catch (err) {
            const msg = err.response?.data?.message || "An unexpected error occurred.";
            setUpdateMessage({ type: 'error', text: msg });
            // Revert input field to current confirmed username on failure
            setNewUsername(username); 
        } finally {
            setUpdateLoading(false);
        }
    };


    const displayContent = () => {
        // ... (Loading/Error handling remains the same) ...
        if (loading) {
            return <div className="text-gray-500 text-xl">Loading profile data...</div>;
        }
        if (error) {
            return <div className="text-red-500 text-xl">{error}</div>;
        }
        
        return (
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
                <div className="text-6xl text-indigo-600 mb-6 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15a7.488 7.488 0 0 0-5.982 3.725M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </div>
                <p className="text-center text-gray-500 mb-2">Logged in as:</p>
                <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-6">
                    {username}
                </h2>
                
                {/* Username Change Form */}
                <div className="mt-6 border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Change Username</h3>
                    <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Enter new unique username"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 mb-3"
                        disabled={updateLoading}
                    />
                    <button
                        onClick={handleUpdateUsername}
                        className={`w-full px-4 py-2 font-semibold rounded-lg transition duration-200 ${
                            updateLoading 
                                ? 'bg-indigo-300 text-white cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                        disabled={updateLoading}
                    >
                        {updateLoading ? 'Updating...' : 'Save New Username'}
                    </button>

                    {/* Update Feedback Message */}
                    {updateMessage && (
                        <p className={`mt-3 text-sm text-center font-medium ${
                            updateMessage.type === 'error' ? 'text-red-500' : 
                            updateMessage.type === 'success' ? 'text-green-500' : 'text-gray-500'
                        }`}>
                            {updateMessage.text}
                        </p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 font-inter">
            <Header />
            <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-indigo-600 mb-8">Your Profile</h1>
                {displayContent()}
            </div>
        </div>
    );
};

export default Profile;
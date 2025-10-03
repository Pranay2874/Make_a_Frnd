import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// FIX: Corrected import path for Header, assuming it is one level up and in the 'components' folder
import Header from "../components/Header";
// FIX: Corrected import path for config, assuming it is one level up from 'pages'

import { BACKEND_URL } from "../../config"; 


const Profile = () => {
    const [username, setUsername] = useState("Loading...");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                // If no token, redirect to login
                navigate("/signin");
                return;
            }

            try {
                // Make a protected GET request to fetch the profile
                const response = await axios.get(`${BACKEND_URL}/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                setUsername(response.data.username);
                setLoading(false);
            } catch (err) {
                console.error("Profile fetch error:", err);
                setError("Failed to load profile. Please sign in again.");
                setLoading(false);
                // Optionally clear token and redirect if the token is expired/invalid
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("username");
                    navigate("/signin");
                }
            }
        };

        fetchProfile();
    }, [navigate]);

    const displayContent = () => {
        if (loading) {
            return <div className="text-gray-500 text-xl">Loading profile data...</div>;
        }
        if (error) {
            return <div className="text-red-500 text-xl">{error}</div>;
        }
        
        return (
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
                <div className="text-6xl text-indigo-600 mb-6 text-center">
                    {/* Placeholder icon for user */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15a7.488 7.488 0 0 0-5.982 3.725M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </div>
                <p className="text-center text-gray-500 mb-2">Logged in as:</p>
                <h2 className="text-4xl font-extrabold text-gray-900 text-center">
                    {username}
                </h2>
                <p className="text-sm text-gray-500 text-center mt-4">
                    This is your unique chat ID.
                </p>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 font-inter">
            {/* Include Header */}
            <Header />
    
            {/* Main Profile Content */}
            <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-indigo-600 mb-8">Your Profile</h1>
                {displayContent()}
            </div>
        </div>
    );
};

export default Profile;

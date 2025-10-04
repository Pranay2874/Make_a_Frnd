import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Card from "../components/Card";
import SocketConnection from "../Socket"; 

export const Home = () => {
    const navigate = useNavigate();
    const interestInputRef = useRef(null);
    const [message, setMessage] = useState(null);
    const socket = SocketConnection(); 

    useEffect(() => {
        const username = localStorage.getItem("username"); 
        if (username) {
            socket.emit("setUser", username);
        } else {
        
            navigate("/signin");
        }
    }, [socket, navigate]);


    const startRandomChat = () => {
        navigate("/RandomChat");
    };

   
    const startInterestChat = () => {
        const interest = interestInputRef.current?.value;
        if (interest && interest.trim() !== "") {
           
            navigate(`/InterestChat/${encodeURIComponent(interest.trim())}`); 
        } else {
            setMessage("Please enter an interest.");
        }
    };
    
    
    return (
        <div className="min-h-screen bg-gray-50 font-inter">
            <Header />            
            <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
                    Find Your Next Friend!
                </h1>

                <div className="grid md:grid-cols-2 gap-10">
                    
                    <Card
                        title="Random Chat"
                        subtitle="Start chatting immediately with a random online user."
                        showInput={false}
                        onStart={startRandomChat}
                    />

                  
                    <Card
                        title="Interest Chat"
                        subtitle="Enter a topic below to filter matches for deeper conversations."
                        showInput={true}
                        inputPlaceholder="e.g., coding, gaming, travel, music"
                        onStart={startInterestChat}
                        interestInputRef={interestInputRef}
                    />
                </div>

                {message && <div className="text-center text-red-500 mt-4">{message}</div>}
            </main>
        </div>
    );
};
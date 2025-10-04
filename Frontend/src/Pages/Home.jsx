import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Card from "../components/Card";
import SocketConnection from "../Socket";
import { BACKEND_URL } from "../../config";

export const Home = () => {
  const navigate = useNavigate();
  const interestInputRef = useRef(null);
  const [message, setMessage] = useState(null);
  const socket = SocketConnection();

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");

      // If username already cached, identify to socket and continue
      if (username) {
        socket.emit("setUser", username);
        return;
      }

      // If we have a token but no cached username, fetch profile to restore it
      if (token) {
        try {
          const res = await axios.get(`${BACKEND_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res?.data?.username) {
            localStorage.setItem("username", res.data.username);
            socket.emit("setUser", res.data.username);
            return;
          }
        } catch {
          // Token might be invalid/expired; fall through to signin
          localStorage.removeItem("token");
          localStorage.removeItem("username");
        }
      }

      // No username and no valid token → go to signin
      navigate("/signin");
    };

    init();
  }, [socket, navigate]);

  const startRandomChat = () => {
    navigate("/RandomChat");
  };

  const startInterestChat = () => {
    const interest = interestInputRef.current?.value;
    if (interest && interest.trim() !== "") {
      setMessage(null);
      navigate(`/InterestChat/${encodeURIComponent(interest.trim())}`);
    } else {
      setMessage("Please enter an interest.");
    }
  };

  return (
    <div className="min-h-dvh bg-gray-50 font-inter">
      {/* Sticky header for mobile */}
      <Header />

      {/* Main Content */}
      <main
        className="
          mx-auto w-full
          px-4 pt-6 pb-24           /* comfy padding on small screens */
          sm:px-6 sm:pt-10 sm:pb-16
          md:max-w-5xl
        "
      >
        <h1
          className="
            text-3xl sm:text-4xl md:text-5xl
            font-extrabold text-gray-900 text-center
            leading-tight
          "
        >
          Find Your Next Friend!
        </h1>

        <p
          className="
            mt-3 sm:mt-4 text-center
            text-sm sm:text-base text-gray-600
            px-2 sm:px-0
          "
        >
          Jump into a random chat or match by a shared interest. It’s quick, simple, and fun.
        </p>

        {/* Cards */}
        <div
          className="
            mt-8 sm:mt-10
            grid grid-cols-1 md:grid-cols-2
            gap-6 sm:gap-8 md:gap-10
          "
        >
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

        {/* Helper / validation message */}
        {message && (
          <div className="text-center text-red-500 mt-4 text-sm sm:text-base px-2">
            {message}
          </div>
        )}
      </main>

      {/* Bottom spacer on mobile so content isn't cramped near nav bars */}
      <div className="h-4 sm:h-0" />
    </div>
  );
};

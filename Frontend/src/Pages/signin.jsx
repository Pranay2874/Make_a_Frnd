import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../config"; 
import { UserIcon } from "../components/UserIcon";
import { LockIcon } from "../components/LockIcon";

export const Signin = () => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const signin = async () => {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    try {
      
      localStorage.removeItem("token");

      const response = await axios.post(`${BACKEND_URL}/signin`, {
        username,
        password,
      });

      if (response.data.token) {
    
        localStorage.removeItem("username");
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("username", response.data.username);
  navigate("/home");
      } else {
        alert("Signin failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Signin failed. Please try again.");
    }
  };

  return (
    <div className="bg-[#4071f4] flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-4xl text-white mb-4">Make a frnd</h1>

        <div className="p-6 w-80 bg-white border border-gray-100 rounded-lg shadow-md">
          <h2 className="font-medium text-xl text-center mb-5 text-gray-700">Sign In</h2>

          <div className="mb-3 relative">
            <UserIcon />
            <input
              ref={usernameRef}
              type="text"
              placeholder="Enter Your Username"
              className="border border-gray-300 w-full h-10 p-3 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-[#4071f4] pl-10"
            />
          </div>

          <div className="mb-5 relative">
            <LockIcon />
            <input
              ref={passwordRef}
              type="password"
              placeholder="Password"
              className="border border-gray-300 w-full h-10 p-3 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-[#4071f4] pl-10"
            />
          </div>

          <div className="mb-4">
            <button
              onClick={signin}
              className="w-full bg-[#4071f4] text-white text-sm font-semibold py-2 rounded-md hover:bg-[#345edb] transition duration-200"
            >
              Sign In
            </button>
          </div>

          <div className="text-center text-xs text-gray-500">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-[#4071f4] hover:underline"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

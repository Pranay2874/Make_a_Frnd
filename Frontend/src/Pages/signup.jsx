import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../config";  
import { UserIcon } from "../components/UserIcon";
import { LockIcon } from "../components/LockIcon";

export const Signup = () => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  async function signup() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    try {
    
      const response = await axios.post(`${BACKEND_URL}/signup`, {
        username,
        password,
      });

    
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username); 
      
    // alert("You have signed up!");

      
      navigate("/home");  
    } catch (error) {
      console.error(error);
      alert("Signup failed. Please try again.");
    }
  }

  return (
    <div className="bg-[#4071f4] flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-4xl text-white mb-4">Make a frnd</h1>

        <div className="p-6 w-80 bg-white border border-gray-100 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl">
          <h2 className="font-medium text-xl text-center mb-5 text-gray-700">Sign Up</h2>

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
              onClick={signup}
              className="w-full bg-[#4071f4] text-white text-sm font-semibold py-2 rounded-md hover:bg-[#345edb] transition duration-200"
            >
              Sign Up
            </button>
          </div>

          <div className="text-center text-xs text-gray-500">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-[#4071f4] hover:underline focus:outline-none"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

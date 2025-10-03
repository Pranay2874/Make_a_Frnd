import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logout logic: clear token or session and redirect to Signin page
    // You can use Axios to logout the user or just clear the session locally
    navigate("/signin"); // Redirect to signin page after logout
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 text-3xl font-extrabold text-indigo-600">
            MakeAFrnd
          </div>
          <div className="flex space-x-4">
            <button onClick={() => navigate('/home')} className="text-gray-600 hover:text-indigo-600 transition duration-150">
              Home
            </button>
            <button onClick={() => navigate('/about')} className="text-gray-600 hover:text-indigo-600 transition duration-150">
              About Us
            </button>
            <button onClick={() => navigate('/profile')} className="text-gray-600 hover:text-indigo-600 transition duration-150">
              Profile
            </button>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 transition duration-150 font-medium">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

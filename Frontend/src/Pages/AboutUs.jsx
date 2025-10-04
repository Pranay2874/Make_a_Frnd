import React from "react";
import Header from "../components/Header"; // Import Header component

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-inter">
            {/* Include Header */}
            <Header />

            {/* Main Profile Content */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-indigo-600 mb-4">About Us</h1>
                    <p className="text-lg text-gray-700">
                        View 
                    </p>
                
                </div>
            </div>
        </div>
    );
};

export default AboutUs;

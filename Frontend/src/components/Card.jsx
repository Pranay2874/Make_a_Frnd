import React from "react";
import { PlayIcon } from "../components/PlayIcon"; // Assuming PlayIcon component exists

const Card = ({ title, subtitle, showInput, onStart, inputPlaceholder, interestInputRef }) => {
    return (
        <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm transform hover:scale-[1.03] transition duration-300 ease-in-out border-t-4 border-indigo-500">
            <h3 className="text-3xl font-extrabold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-500 text-sm mb-6 text-center">{subtitle}</p>
            
            {showInput && (
                <div className="w-full mb-6">
                    <input
                        ref={interestInputRef}
                        type="text"
                        placeholder={inputPlaceholder}
                        className="w-full px-4 py-2 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 transition duration-150"
                    />
                </div>
            )}

            {/* Start Chat Button */}
            <button
                onClick={onStart}
                className="flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-700 hover:shadow-xl transition duration-300 transform hover:translate-y-[-2px] active:translate-y-0"
            >
                Start Chat
                <PlayIcon />
            </button>
        </div>
    );
};

export default Card;

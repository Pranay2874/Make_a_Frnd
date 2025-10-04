import React from "react";
import { PlayIcon } from "../components/PlayIcon"; 

const StartChatButton = ({ onClick, title }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-700 hover:shadow-xl transition duration-300 transform hover:translate-y-[-2px] active:translate-y-0"
        >
            {title}
            <PlayIcon />
        </button>
    );
};

export default StartChatButton;

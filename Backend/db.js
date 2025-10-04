const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    
    username: { 
        type: String, 
        unique: true, 
        required: true,
        lowercase: true,
        trim: true,
        minlength: 3 
    },
    password: { 
        type: String, 
        required: true, 
        minlength: 6 
    },
    isOnline: {
        type: Boolean,
        default: false 
    }
}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);

module.exports = { userModel };
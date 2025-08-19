const mongoose = require('mongoose');

// Create user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required!"]
    },
    role: {
        type: String,
        required: [true, "Role is required"]
    }
},
    {
        timestamps:  true
    }
);

module.exports = mongoose.model("User", userSchema);

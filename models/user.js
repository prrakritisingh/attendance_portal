const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    stdno: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: String,
        unique: true
    },
    branch: {
        type: String,
        required: true
    },
    section: {
        type: Number,
        required: true
    },
    domain: {
        type: String
    },
    year: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", userSchema);
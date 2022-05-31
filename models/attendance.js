const mongoose = require("mongoose");
const { getTime, getDate } = require("../utils/datetime");

const attendanceSchema = new mongoose.Schema({
    recid: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    in: {
        type: String,
        default: getTime
    },
    out: {
        type: String,
        default: getTime
    },
    duration: {
        type: Number,
        default: 0
    },
    present: {
        type: Boolean,
        default: false
    },
    date: {
        type: String,
        default: getDate
    }
});

module.exports = mongoose.model("Record", attendanceSchema, "attendance");
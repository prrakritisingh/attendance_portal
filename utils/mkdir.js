const fs = require("fs");

exports.logDir = () => {
    if (!fs.existsSync("logs")) {
        fs.mkdirSync("logs");
    }
}

exports.dataDir = () => {
    if (!fs.existsSync("data")) {
        fs.mkdirSync("data");
    }
}
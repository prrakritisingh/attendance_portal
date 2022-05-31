const fs = require("fs");
const path = require("path");

module.exports = function logger(req, res, next) {
    const date = new Date();
    const filename = `${date.toISOString().split('T')[0]}.log`;
    const PATH = path.join(path.dirname(require.main.filename), "logs", filename);
    const TS = date.toISOString();
    const stream = fs.createWriteStream(PATH, { flags: 'a' });
    stream.write(`${TS} - ${req.protocol} ${req.method}: @ ${req.path}  FROM:${req.ip} (${req.hostname})  URL:${req.url}\n`);
    stream.end();
    next();
}
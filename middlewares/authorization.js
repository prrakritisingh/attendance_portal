const jwt = require("jsonwebtoken");

module.exports = function authorization(req, res, next) {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = data.id;
            return next();
        } catch (err) {
            return res.status(403).redirect("/admin/login");
        }
    }
    return res.status(401).redirect("/admin/login");
}
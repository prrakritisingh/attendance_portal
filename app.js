if (process.env.NODE_ENV !== "production") require("dotenv").config();

const express = require("express");
const cookieparser = require("cookie-parser");
const path = require("path");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const logger = require("./middlewares/logger");

const { logDir, dataDir } = require("./utils/mkdir");
const { connect } = require("./config/dbConfig");

const app = express();
logDir();
dataDir();
connect();

const HOST = process.env.HOST;
const PORT = process.env.PORT;
const PUBLIC = path.join(path.dirname(require.main.filename), "public");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieparser());
app.use(express.static(PUBLIC));
app.use(logger);

app.use(userRoutes);
app.use("/admin", adminRoutes);

app.listen(PORT, HOST, () => {
    console.log(`server running on ${HOST}:${PORT}`);
});
const mongoose = require("mongoose");

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URI)
        .then(res => {
            console.log("connected with DB");
        })
        .catch(err => {
            console.log(`connection failed: ${err}`);
        });

    mongoose.connection.on("error", err => {
        console.log(`DB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
        console.log("DB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
        console.log("reconnected with DB");
    })

    const gracefulExit = () => {
        mongoose.connection.close(() => {
            console.log("mongoose connection closed: app termination");
            process.exit(0);
        });
    }
    process.on("SIGINT", gracefulExit);
    process.on("SIGTERM", gracefulExit);
}
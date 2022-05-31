const bcrypt = require("bcrypt");
const User = require("../models/user");
const Record = require("../models/attendance");
const { getDate, getTime, calculateInterval } = require("../utils/datetime");

exports.handleHome = (req, res) => {
    res.status(200).send("<h1>Coming Soon</h1>");
}

exports.getLogin = (req, res) => {
    res.status(200).send("<h1>Coming Soon</h1>");
}

exports.getDashboard = (req, res) => {
    res.status(200).render("user/dashboard", {
        title: "Username | BDCoE",
        data: {
            // fetched user data
        }
    });
}

exports.getMarkAttendance = (req, res) => {
    res.status(200).render("user/mark", {
        title: "Attendance | BDCoE"
    });
}

// api

exports.postAttendancev1 = async (req, res) => {
    const { username, password } = req.body;
    try {
        // find user & validate password
        const member = await User.findOne({ "username": username });
        if (!member) {
            return res.status(401).json({
                message: "Invalid Username",
                error: "Unauthorised"
            });
        }

        const match = await bcrypt.compare(password, member.password);
        if (!match) {
            return res.status(403).json({
                message: "Invalid Password",
                error: "Forbidden"
            });
        }

        const exit = await Record.findOne({ recid: `${username}.${getDate()}` });
        if (!exit) {
            // user entry
            const record = new Record({ username, recid: `${username}.${getDate()}` });
            const saved = await record.save();
            return res.status(201).json({
                message: "Entry Time Recorded",
                data: {
                    in: saved.in,
                    out: "pending",
                    duration: saved.duration
                }
            });
        } else {
            if (exit.present) {
                return res.status(200).json({
                    message: "Already Checked Out",
                    data: {
                        in: exit.in,
                        out: exit.out,
                        duration: exit.duration
                    }
                });
            }
            exit.out = getTime();
            exit.duration = calculateInterval(exit.out, exit.in);
            exit.present = true;
            await exit.save();

            // user exit successful
            res.status(200).json({
                message: "Exit Time Recorded",
                data: {
                    in: exit.in,
                    out: exit.out,
                    duration: exit.duration
                }
            });
        }
    } catch (err) {
        return res.status(400).json({
            message: "Error",
            error: err.message
        });
    }
}

exports.postRegisterv1 = async (req, res) => {
    const { username, email, password, fullname, stdno, contact, branch, section, year } = req.body;
    try {
        const hash = await bcrypt.hash(password, 7);
        const user = new User({ username: username.trim().toLowerCase(), email, password: hash, fullname, stdno, contact, branch, section, year });
        const saved = await user.save();
        return res.status(201).json({
            message: "User Registered Successfully",
            data: saved
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: "Error",
            error: err.message
        });
    }
}
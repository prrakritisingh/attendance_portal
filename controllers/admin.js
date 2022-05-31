const jwt = require("jsonwebtoken");
const csvwriter = require("csv-writer");
const path = require("path");
const Record = require("../models/attendance");
const User = require("../models/user");

exports.handleHome = (req, res) => {
    res.status(301).redirect("/admin/dashboard");
}

exports.getLogin = (req, res) => {
    res.status(200).render("admin/login", {
        title: "Admin | BDCoE"
    });
}

exports.getDashboard = (req, res) => {
    res.status(200).render("admin/dashboard", {
        title: "Admin | BDCoE"
    });
}

// api

exports.getAttendancev1 = async (req, res) => {
    const date = req.params.date;
    try {
        const records = await Record.find({ date }).sort({ duration: -1, year: 1 });
        return res.status(200).json({
            message: `Data for ${date}`,
            data: records
        });
    } catch (err) {
        return res.status(400).json({
            message: "No Records Found",
            error: err.message
        });
    }
}

exports.getAttendancev2 = async (req, res) => {
    const username = req.params.name;
    try {
        const records = await Record.find({ username }).sort({ $natural: -1 }).limit(30);
        return res.status(200).json({
            message: `Data for ${username}`,
            data: records
        });
    } catch (err) {
        return res.status(400).json({
            message: "No Records Found",
            error: err.message
        });
    }
}

exports.getMembersv1 = async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json({
            message: "Members List",
            data: users
        });
    } catch (err) {
        return res.status(400).json({
            message: "No Records Found",
            error: err.message
        });
    }
}

exports.getDownloadv1 = async (req, res) => {
    const date = req.params.date;
    const PATH = path.join(path.dirname(require.main.filename), "data", `lab-${date}.csv`);
    try {
        const records = await Record.find({ date }).sort({ duration: -1, year: 1 });
        const users = await User.find({});
        const createCsvWriter = csvwriter.createObjectCsvWriter;
        const csvWriter = createCsvWriter({
            path: PATH,
            header: [
                { id: 'sno', title: 'S.No.' },
                { id: 'date', title: 'Date' },
                { id: 'fullname', title: 'Name' },
                { id: 'stdno', title: 'Std.No.' },
                { id: 'branch', title: 'Branch' },
                { id: 'year', title: 'Year' },
                { id: 'in', title: 'Entry' },
                { id: 'out', title: 'Exit' },
                { id: 'duration', title: 'Duration' },
            ]
        });

        let data = [];
        let sno = 0;
        let row = {};
        let object = {};
        records.forEach(record => {
            sno++;
            object = users.find(({ username }) => username === record.username);
            row = {
                sno,
                date,
                fullname: object.fullname,
                stdno: object.stdno,
                branch: object.branch,
                year: object.year,
                in: record.in,
                out: record.out,
                duration: `${Math.floor(record.duration / 3600)}h:${Math.floor((record.duration % 3600) / 60)}m` 
            };
            data.push(row);
        });
        await csvWriter.writeRecords(data);
        res.status(200).download(PATH);
    } catch (err) {
        return res.status(400).json({
            message: "No Records Found",
            error: err.message
        });
    }
}

exports.postLoginv1 = (req, res) => {
    const { username, password } = req.body;
    if (username !== "admin@bdcoe") {
        return res.status(401).json({
            message: "Invalid Username",
            error: "Unauthorised"
        });
    }
    if (password !== process.env.ADMIN_PASSKEY) {
        return res.status(403).json({
            message: "Invalid Password",
            error: "Forbidden"
        });
    }
    const _id = username; //fetch from db
    const token = jwt.sign({ id: _id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 604800000
    }).status(302).redirect("/admin/dashboard");
}

exports.getLogoutv1 = (req, res) => {
    return res.cookie("jwt", '', {
        httpOnly: true,
        maxAge: 1
    }).status(200).redirect("/admin/login");
}
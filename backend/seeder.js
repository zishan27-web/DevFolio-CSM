const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Admin = require("./models/adminModel");
const bcrypt = require("bcryptjs");

dotenv.config();
connectDB();

const importData = async() =>{
    try {
        await Admin.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const hashedpass = await bcrypt.hash("zishan@786123",  salt);

        const admin = new Admin({
            username: "admin",
            password: hashedpass,
        });

        await admin.save();
        console.log("Admin User Imported Successfully!");
        process.exit();
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};

importData();
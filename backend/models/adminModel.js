const mongoose = require('mongoose');
const bcrypt =  require("bcryptjs");

const adminSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required: [true, "Please provide the project name"], 
            trim: true,
        },
        password:{
            type: String,
            reqiured: [true, "Please provide a password"],
            minlength: 6,
        }
    }
);


adminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema)
module.exports = Admin;
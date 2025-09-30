const express = require('express');
const router = express.Router();
const User = require("../models/adminModel")
const jwt = require("jsonwebtoken")
require("dotenv").config();

router.post('/login', async(req, res)=>{
    const {username, password} = req.body;

    const user = await User.findOne({username});

    if(user && (await user.matchPassword(password)))
    {
        const payload = {
            id: user._id, // This is the data we want to encode in the token
            username: user.username
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );
        res.json({
            // _id: user._id,
            // username: user.username,
            token: token
        });
    }
    else{
        res.status(401).send('Invalid credentials');
    }
});

module.exports = router;
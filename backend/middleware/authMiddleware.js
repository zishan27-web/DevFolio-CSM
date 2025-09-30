const jwt = require("jsonwebtoken");
require("dotenv").config()

const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, process.env.JWT_SECRET);
            next();
        } catch (error) {
            res.status(401).send('Not authorized, token failed');
        }
    }
    if (!token) {
        res.status(500).send('Not authorized, no token');
    }
};

module.exports = { protect };
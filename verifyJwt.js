require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
app.use(cookieParser());

exports.verifyJwt = async (req, res, next) => {

    const token = req.cookies.accessToken;
    
    if (!token) {
        return res.status(401).json({ message: '401 Forbidden: No token provided' });
    }

    // Verify the token
    jwt.verify(
        token, 
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: '403 Forbidden: Token is invalid' });
            }
            req.user = decoded.username; 
            console.log('verified');// Add the decoded username to the request object
            next(); // Proceed to the next middleware or route handler
        }
    );
};

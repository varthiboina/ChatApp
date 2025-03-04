const app = require('../server')
const User = require('../Entity/User')
const RefreshToken = require('../Entity/RefreshToken')

require('dotenv').config();
const jwt = require('jsonwebtoken');
exports.refreshTokenLogic = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) {
            console.log('No JWT found in cookies');
            return res.sendStatus(401);  // Send response and return immediately
        }

        const refreshToken = cookies.jwt;

        const rf = await RefreshToken.findOne({ refreshToken });
        if (!rf) {
            console.log('Refresh token not found in the database');
            return res.sendStatus(403);  // Send response and return immediately
        }

        const foundUserId = rf.userId;
        const foundUser = await User.findOne({ _id: foundUserId });

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
            if (err) {
                console.log('Error verifying refresh token');
                return res.sendStatus(403);  // Send response and return immediately
            }

            const accessToken = jwt.sign(
                { username: foundUser.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );

            console.log('Access token generated successfully');
            return res.json({ accessToken });  // Send response only here
        });

    } catch (err) {
        console.error('Error in refreshTokenLogic:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

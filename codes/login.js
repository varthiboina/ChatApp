//const app = require('../server')
const User = require('../Entity/User')
const bcrypt = require('bcrypt')
const RefreshToken = require('../Entity/RefreshToken')
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
app.use(cookieParser());
require('dotenv').config();
const jwt = require('jsonwebtoken');
exports.loginlogic = async (req, res) => {
    try {
       const { username, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      const user = await User.findOne({ username });

       if(user)
        {
           const check = await bcrypt.compare(password , user.password);
           if(check)
            {
              const thisaccessToken = jwt.sign(
                { "username" : user.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn : '30s'}
              );
              const thisrefreshToken = jwt.sign(
                { "username" : user.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn : '1d'}
              );

              const usersRefreshToken = new RefreshToken({userId : user._id , token: thisrefreshToken 
                , expiresAt : new Date(Date.now() +  24 * 60 * 60 * 1000)});
                await usersRefreshToken.save();
              res.cookie('accessToken' , thisaccessToken , {httpOnly: true , maxAge :  60 * 60 * 1000})
              res.cookie('refreshToken', thisrefreshToken , {httpOnly: true , maxAge : 24 * 60 * 60 * 1000});
             //  console.log("thisaccesstoken = " + req.cookies.accessToken);
              const serializedData = encodeURIComponent(JSON.stringify(user._id));
              const accessToken= thisaccessToken;
            // /  console.log(accessToken);
              res.json({accessToken: accessToken , userId : user._id})
             // res.redirect(`/chat?data=${serializedData}`);
            }
        }  
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }


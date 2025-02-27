
const mongoose = require('mongoose')
exports.mongoDBConnect = () => mongoose.connect("mongodb://localhost:27017/chatapplication" ,{}).then(() =>
    console.log("Connected to mongoDB")).catch((err) =>
    {
        console.log("*ERROR* connect to the mongoBD")
    })


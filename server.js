const express = require('express');
const mongoose = require('mongoose');
const { createServer } = require('node:http');
const { websocket } = require('./codes/websocket');
const { join } = require('node:path');
const path = require('path');
const mongodbModule = require('./config/db');
const {userCreation}  = require('./codes/create_user');
const {loginlogic}  = require('./codes/login');


const app = express();
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
const server = createServer(app);
mongodbModule.mongoDBConnect();
websocket(app, server);

app.get('/welcome',(req,res) =>
    {
        res.render('welcomePage', {appName : "ChatApp"});
    })
app.get('/chat', (req, res) => {
    const data = JSON.parse(decodeURIComponent(req.query.data));
    res.sendFile(join(__dirname, './public/index.html'));
});
app.post('/create-user', userCreation, (req, res) => {
    const { username, email } = req.body;
    const newUser = { username, email };
    console.log('User created:', newUser);
    // res.render('userCreated', { user: newUser });
});
app.post('/login', loginlogic, (req, res) => {
    const { username, email } = req.body;
    const newUser = { username, email };
    console.log('Login Successful');
    // res.render('userCreated', { user: newUser });
});

app.get('/create-user', (req, res) => {
    res.render('createUser');
});
app.get('/login', (req, res) => {
    res.render('login');
});
server.listen(9000, () => {
    console.log('Server running at http://localhost:9000');
});

module.exports = app;

const express = require('express');
const { createServer } = require('node:http');
const { websocket } = require('./codes/websocket');
const { join } = require('node:path');

const app = express();
const server = createServer(app);

websocket(app, server);

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, './public/index.html'));
});

server.listen(9000, () => {
    console.log('Server running at http://localhost:9000');
});

module.exports = app;

const express = require('express');
const app = express();
const fs = require('fs');
const http = require('http');
const bodyParser = require('body-parser');
const router = require('./router');
const HTTP_PORT = 8000;

// app.setMaxListeners(Infinity)

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(router);

http.createServer(app).listen(HTTP_PORT, () => {
    console.log(`http server start ${HTTP_PORT}`)
});

const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser');
const router = require('./router');
const jwt = require('jsonwebtoken');
const HTTPS_PORT = 8001;
const HTTP_PORT = 8000;

const options = {
    key: fs.readFileSync('./privatekey.pem'),
    cert: fs.readFileSync('./certificate.pem')
};

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(router);
app.use((err, req, res, next) => {
    if(err !== null) {
        return res.send({success: false, msg: 'error'})
    }
    next();
})

http.createServer(app).listen(HTTP_PORT, () => {
    console.log(`http server start ${HTTP_PORT}`)
});

https.createServer(options, app).listen(HTTPS_PORT, () => {
    // console.log(`env: ${process.env.NODE_ENV}`);
    console.log(`https server start ${HTTPS_PORT}`);
});
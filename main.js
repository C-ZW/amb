const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser');
const router = require('./router');
const cors = require('cors');
const HTTPS_PORT = 8001;
const HTTP_PORT = 8000;

const options = {
    key: fs.readFileSync('./privatekey.pem'),
    cert: fs.readFileSync('./certificate.pem')
};

app.setMaxListeners(Infinity)

app.use(cors());
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(router);

http.createServer(app).listen(HTTP_PORT, () => {
    console.log(`http server start ${HTTP_PORT}`)
});

https.createServer(options, app).listen(HTTPS_PORT, () => {
    // console.log(`env: ${process.env.NODE_ENV}`);
    console.log(`https server start ${HTTPS_PORT}`);
});
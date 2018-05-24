const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const router = require('./router');
const jwt = require('jsonwebtoken');
const PORT = 8000;

const options = {
    key: fs.readFileSync('./privatekey.pem'),
    cert: fs.readFileSync('./certificate.pem')
};

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(router);

https.createServer(options, app).listen(8000, () => {
    console.log(`env: ${process.env.NODE_ENV}`);
    console.log(`server start ${PORT}`);
})
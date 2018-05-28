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
app.use((err, req, res, next) => {
    if(err !== null) {
        return res.send({success: false, msg: 'error'})
    }
    next();
})

https.createServer(options, app).listen(PORT, () => {
    console.log(`env: ${process.env.NODE_ENV}`);
    console.log(`server start ${PORT}`);
})
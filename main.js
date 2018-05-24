const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = require('./router');
const jwt = require('jsonwebtoken');
const PORT = 8000;

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(router);

app.listen(PORT, () => {
    console.log(`env: ${process.env.NODE_ENV}`);
    console.log(`server start ${PORT}`);
});
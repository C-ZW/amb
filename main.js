const express = require('express');
const app = express();

const PORT = 8000;

app.use(express.static(`${__dirname}/public`));

console.log(`env: ${process.env.NODE_ENV}`);

const router = require('./router');
app.use(router);

app.listen(PORT, () => {
    console.log(`server start ${PORT}`);
});
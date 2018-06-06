const router = require('express').Router();
const jwt = require('jsonwebtoken');
const msgHelper = require('../helper/msgHelper');

const secretKey = require('../config/config').jwt_secret;

router.use((req, res, next) => {
    let token = req.body.token ||
        req.param('token') ||
        req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.send(msgHelper(false, 'Failed to authenticate token.'));
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send(msgHelper(false, 'No token provided.'));
    }
});

module.exports = router;
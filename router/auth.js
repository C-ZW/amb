'use strict'
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const msgHelper = require('../helper/msgHelper');
const db = require('../helper/dbAccessor');
const secretKey = require('../config/config').jwt_secret;

router.use((req, res, next) => {
    let token = req.body.token ||
        req.query.token ||
        req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.send(msgHelper(false, 'Failed to authenticate token.'));
            } else {
                req.decoded = decoded;
                req.db = db;
                next();
            }
        });
    } else {
        return res.status(403).send(msgHelper(false, 'No token provided.'));
    }
});

module.exports = router;
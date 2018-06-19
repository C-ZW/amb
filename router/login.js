'use strict'
const router = require('express').Router();
const hashing = require('../helper/core/hashing');
const secret = require('../config/config').secret;
const msgHelper = require('../helper/msgHelper');
const jwt = require('jsonwebtoken');
const jwtScret = require('../config/config').jwt_secret;
const validator = require('validator');
const db = require('../helper/DBAccessor');

function createToken(userId) {
    let payload = {
        userId: userId
    }

    let token = jwt.sign(payload, jwtScret, {
        expiresIn: 6000
    });

    return token;
}

router.post('/login', async (req, res) => {
    const data = req.body;
    const account = validator.escape(data.account);
    const password = hashing(data.password, secret);
    console.log(req.body)
    try{
        let userId = await db.login(account, password);
        if(userId !== null) {
            res.send(msgHelper(true, createToken(userId)));
        } else {
            res.send(msgHelper(false, 'password or account error'));
        }
    } catch(err) {
        res.send(msgHelper(false, 'login error: ' + err));
    }
});

module.exports = router;
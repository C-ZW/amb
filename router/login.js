const router = require('express').Router()
const Sequelize = require('sequelize');
const Users = require('../models').Users;
const hashing = require('../helper/hashing');
const secret = require('../config/config').secret;
const msgHelper = require('../helper/msgHelper');
const jwt = require('jsonwebtoken');
const jwtScret = require('../config/config').jwt_secret;
const validator = require('validator');

function createToken(userId) {
    let payload = {
        userId: userId
    }

    let token = jwt.sign(payload, jwtScret, {
        expiresIn: 6000
    });

    return token;
}

router.post('/login', (req, res) => {
    const data = req.body;
    Users.findOne({
        where: {
            account: validator.escape(data.account),
            password: hashing(data.password, secret)
        },
        raw: true
    }
        )
        .then((data) => {
            if(data !== null) {
                res.send({
                    success: true,
                    message: createToken(data.user_id)});

            } else {
                res.send(msgHelper(false, 'password error'));
            }
        })
        .catch((err) => {
            console.log(err)
            res.send(msgHelper(false, err));
        });
});

module.exports = router;
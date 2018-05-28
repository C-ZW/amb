const router = require('express').Router()
const Sequelize = require('sequelize');
const Users = require('../models').Users;
const hashing = require('../helper/hashing');
const secret = require('../config/config').secret;
const msgHelper = require('../helper/msgHelper');

router.post('/login', (req, res) => {
    const data = req.body;
    Users.findOne({
        where: {
            account: data.account,
            password: hashing(data.password, secret)
        },
        raw: true
    }
        )
        .then((data) => {
            if(data !== null) {
                res.send(msgHelper(true));
            } else {
                res.send(msgHelper(false, 'password error'));
            }
        })
        .catch((err) => {
            res.send(msgHelper(false));
        });
});

module.exports = router;
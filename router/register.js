const router = require('express').Router();
const Users = require('../models').Users;
const hashing = require('../helper/hashing');
const secret = require('../config/config').secret;
const Sequelize = require('sequelize');
const msgHelper = require('../helper/msgHelper');
const validator = require('validator');

router.post('/register', (req, res) => {
    const data = req.body;
    if(!isValidAccount(data)) {
        res.send(msgHelper(false, 'valid account error'));
        return;
    }

    Users.create({
        account: validator.escape(data.account),
        password: hashing(data.password, secret)
    })
    .then(() => {
        res.send(msgHelper(true, ''));
    })
    .catch(Sequelize.ValidationError, function (msg) {
        if(msg.name === 'SequelizeUniqueConstraintError') {
            res.send(msgHelper(false, 'Account already existed.'));
        }
    })
    .catch((err) => {
        res.send(msgHelper(false, err));
    });
})

function isValidAccount(data) {
    const isFullFill = data !== undefined || 
        data.account !== undefined || 
        data.password !== undefined;
    
    return isFullFill;
}

module.exports = router;
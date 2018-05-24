const router = require('express').Router();
const Users = require('../../models').Users;
const hashing = require('../../helper/hashing');
const secret = require('../../config/config').secret;
const Sequelize = require('sequelize');

router.post('/register', (req, res) => {
    const data = req.body;
    if(!isValidAccount(data)) {
        res.send({success: false, message: 'valid account error'});
        return;
    }

    Users.create({
        account: data.account,
        password: hashing(data.password, secret)
    })
    .then(() => {
        res.send({success: true, meaasge: ''});
    })
    .catch(Sequelize.ValidationError, function (msg) {
        if(msg.name === 'SequelizeUniqueConstraintError') {
            res.send({success: false, message: 'Account already existed.'});
        }
    });
})

function isValidAccount(data) {
    const isFullFill = data !== undefined || 
        data.account !== undefined || 
        data.password !== undefined;

    return isFullFill;
}

module.exports = router;
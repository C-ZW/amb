const router = require('express').Router();
const hashing = require('../helper/hashing');
const secret = require('../config/config').secret;
const msgHelper = require('../helper/msgHelper');
const validator = require('validator');
const db = require('../helper/DBAccessor');

router.post('/register', async (req, res) => {
    const data = req.body;
    if (!isValidAccount(data)) {
        res.send(msgHelper(false, 'valid account error'));
        return;
    }

    try {
        let acc = validator.escape(data.account);
        let pw = hashing(data.password, secret);
        let result = await db.createUser(acc, pw);
        res.send(msgHelper(true, result));
    } catch (err) {
        res.send(msgHelper(false, err));
    }
});

function isValidAccount(data) {
    const isFullFill = data !== undefined ||
        data.account !== undefined ||
        data.password !== undefined;

    return isFullFill;
}

module.exports = router;
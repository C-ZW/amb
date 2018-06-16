const router = require('express').Router();
const msgHelper = require('../helper/msgHelper');

router.get('/history', async (req, res) => {
    let userInfo = req.decoded;

    if (userInfo === undefined) {
        res.send(msgHelper(false, 'something wrong'));
        return;
    }
    
    try{
        let result = await req.db.getUserHistories(userInfo.userId);
        res.send(msgHelper(true, result));
    } catch (err) {
        res.send(msgHelper(false, 'hisory error: ' + err));
    }
});

module.exports = router;
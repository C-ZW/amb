const router = require('express').Router();
const sequelize = require('../models').sequelize

router.get('/history', (req, res) => {
    let userInfo = req.decoded;

    if(userInfo === undefined) {
        res.send({success: false, msg: 'something wrong'});
        return;
    }
    
    let postHistories = `select *, 'post' as type from user_post_histories where user_id='${userInfo.userId}'`
    let commentHistories = `select *, null, 'comment' as type from user_comment_histories where user_id='${userInfo.userId}'`

    let query = `${postHistories} union all ${commentHistories}`

    sequelize.query(query, {
        raw: true
    })
        .then((data) => {
            res.send({ success: true, msg: data[0] })
        })
        .catch((err) => {
            console.log(err)
            res.send({ success: false, msg: err })
        });
});

module.exports = router;
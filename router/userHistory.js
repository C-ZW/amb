const router = require('express').Router();
const sequelize = require('../models').sequelize
// todo implement

router.get('/history', (req, res) => {
    let user = req.user;
    let postId = req.query.postId;
    let postHistories = `select *, 'post' as type from user_post_histories where user_id='28e22b97-d4c6-48fc-a087-192fc71ca878'`
    let commentHistories = `select *, 'comment' as type from user_comment_histories where user_id='28e22b97-d4c6-48fc-a087-192fc71ca878'`
    let query = `${postHistories} union all ${commentHistories}`
    
    sequelize.query(query, {
        raw: true
    })
        .then((data) => {
            res.send({ success: true, msg: data })
        })
        .catch((err) => {
            console.log(err)
            res.send({ success: false, msg: err })
        });
});

module.exports = router;
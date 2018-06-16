const router = require('express').Router();
const sequelize = require('../models').sequelize;
const msgHelper = require('../helper/msgHelper');
const UserPostHistory = require('../models').UserPostHistory
const UserCommentHistory = require('../models').UserCommentHistory
const Posts = require('../models').Posts;
const Comments = require('../models').Comments;

router.get('/history', (req, res) => {
    let userInfo = req.decoded;

    if (userInfo === undefined) {
        res.send(msgHelper(false, 'something wrong'));
        return;
    }

    UserPostHistory.findAll({
        attributes: ['post_id'],
        include: [{ model: Posts }],
        where: {
            user_id: userInfo.userId
        }
    })
        .then((data) => {
            let result = {};

            UserCommentHistory.findAll({
                attributes: ['comment_id'],
                include: [{ model: Comments }],
                where: {
                    user_id: userInfo.userId
                }
            })
                .then(d => {
                    postTemplate(result, data);
                    commentTemplate(result, d);
                    return result;
                })
                .then((r) => {
                    res.send(r);
                })
                .catch(err => {
                    res.send(msgHelper(false, 'err' + err))
                });
        })
        .catch(err => {
            res.send(msgHelper(false, 'err: ' + err))
        });
});

function postTemplate(container, posts) {
    container.post = [];
    for (let i of posts) {
        container.post.push(i.post);
    }
    return container;
}

function commentTemplate(container, comments) {
    container.comment = [];

    for (let i of comments) {
        container.comment.push(i.comment);
    }
    return container;
}

module.exports = router;
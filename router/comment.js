const router = require('express').Router()
const validator = require('validator');
const Comments = require('../models').Comments;
const CommentHistories = require('../models').UserCommentHistory;
const uuidV4 = require('uuid');
const signatureGenerator = require('../helper/signature');
const salt = require('../config/config').commentSalt;
const msgHelper = require('../helper/msgHelper');

router.post('/comment', (req, res) => {
    if (!isValidComment(req.body)) {
        res.send({ success: false, msg: 'comment format error' });
        return;
    }

    let userInfo = req.decoded;
    let query = req.body;
    let signature = signatureGenerator(userInfo.userId, query.post_id, salt);
    let comment = commentTemplate(req.body, signature);

    Comments.create(comment)
        .then((data) => {
            recordCommentHistory({
                comment_id: comment.comment_id,
                user_id: userInfo.userId,
                post_id: req.body.post_id
            })
        })
        .then((data) => {
            res.send({ success: true, msg: '' });
        })
        .catch((err) => {
            res.send({ success: false, msg: err });
        })
});

router.put('/comment', (req, res) => {
    let userInfo = req.decoded;
    let query = req.body;
    let commentId = query.id;
    let content = query.content;

    if(!validator.isUUID(commentId)) {
        res.send(msgHelper(false, 'id format error'));
        return;
    }

    Comments.findOne({
        attributes: [
            'post_id'
        ],
        where: {
            comment_id: commentId
        },
        raw: true
    })
        .then((data) => {
            let signature = signatureGenerator(userInfo.userId, data.post_id, salt);
            Comments.update({
                content: validator.escape(content)
            }, {
                    where: {
                        comment_id: commentId,
                        signature: signature
                    }
                })
                .then((d) => {
                    if (d[0] === 0) {
                        res.send({ success: false, msg: 'check comment_id or user id' })
                    }
                    res.send({ success: true, msg: data })
                })
                .catch((err) => {
                    throw err
                })
        })
        .catch((err) => {
            res.send(err)
        });
})

router.delete('/comment', (req, res) => {
    let commentId = req.query.id;

    if (commentId === undefined) {
        res.send(msgHelper(false, 'require comment id'));
        return;
    }

    if(!validator.isUUID(commentId)) {
        res.send(msgHelper(false, 'id format error'));
        return;
    }

    let userInfo = req.decoded;
    
    CommentHistories.destroy({
        where: {
            user_id: userInfo.userId,
            comment_id: commentId
        }
    })
        .then((data) => {
            if (data === 0) {
                throw 'no found';
            }
            deleteComment(commentId);
            return data;
        })
        .then((data) => {
            res.send(msgHelper(true, data));
        })
        .catch((err) => {
            res.send(msgHelper(false, err));
        });
});

function deleteComment(commentId) {
    Comments.destroy({
        where: {
            comment_id: commentId
        }
    })
        .then((data) => {
            // console.log(data)
        })
        .catch((err) => {
            // console.log(err)
            throw err;
        })
}

function recordCommentHistory(data) {
    CommentHistories.create({
        comment_id: data.comment_id,
        user_id: data.user_id,
        post_id: data.post_id
    })
        .catch((err) => {
            throw err;
        });
}

function isValidComment(comment) {
    return comment.created_time === undefined ||
        comment.content === undefined ||
        validator.toDate(comment.created_time) === null ||
        validator.isUUID(comment.post_id);
}

function commentTemplate(comment, signature) {
    return {
        comment_id: uuidV4(),
        post_id: validator.escape(comment.post_id),
        content: validator.escape(comment.content),
        created_time: validator.toDate(comment.created_time),
        signature: signature
    }
}

router.get('/comment', (req, res) => {
    let commentId = req.query.id;
    if (commentId === undefined) {
        res.send({ success: false, msg: 'require comment id' });
        return;
    }
    
    if (!validator.isUUID(commentId, 4)) {
        res.send({ success: false, msg: 'id format error' });
        return;
    }

    Comments.findOne({
        attributes: ['post_id'],
        where: {
            comment_id: commentId
        },
        raw: true
    })
        .then((data) => {
            res.send({ success: true, msg: data })
        })
        .catch((err) => {
            res.send({ success: false, msg: err });
        });
});

module.exports = router;
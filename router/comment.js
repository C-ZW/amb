'use strict'
const router = require('express').Router()
const validator = require('validator');
const uuidV4 = require('uuid');
const signatureGenerator = require('../helper/core/signature');
const salt = require('../config/config').commentSalt;
const msgHelper = require('../helper/msgHelper');

router.get('/comments', async (req, res) => {
    let query = req.query;
    try {
        if (!validator.isUUID(query.post_id)) {
            res.send(msgHelper(false, 'wrong post id'));
        }
        
        let result = await req.db.getComments(query.post_id);
        for (let i = 0; i < result.length; i++) {
            let isCreator = await req.db.isCommentCreator(req.decoded.userId, query.post_id, result[i].comment_id);
            result[i].isCreator = isCreator;
        }
        res.send(msgHelper(true, result));
    } catch (err) {
        res.send(msgHelper(false, 'get comments error' + err));
    }
});

router.post('/comment', async (req, res) => {
    if (!isValidComment(req.body)) {
        const msgHelper = require('../helper/msgHelper');
        res.send(msgHelper(false, 'comment format error'));
        return;
    }

    let userInfo = req.decoded;
    let query = req.body;
    let signature = signatureGenerator(userInfo.userId, query.post_id, salt);
    let comment = commentTemplate(req.body, signature);

    try {
        let result = await req.db.createComment(comment, userInfo.userId);
        res.send(msgHelper(true, result));
    } catch (err) {
        res.send(msgHelper(false, 'post comment error' + err));
    }
});

router.put('/comment', async (req, res) => {
    let userInfo = req.decoded;
    let query = req.body;
    let commentId = query.id;
    let content = query.content;

    if (!validator.isUUID(commentId)) {
        res.send(msgHelper(false, 'id format error'));
        return;
    }

    try {
        content = validator.escape(content);
        let result = await req.db.updateComment(userInfo.userId, commentId, content);
        res.send(msgHelper(true, result));
    } catch (err) {
        res.send(msgHelper(false, 'put comment error: ' + err));
    }
})

router.delete('/comment', async (req, res) => {
    let commentId = req.query.id;

    if (commentId === undefined) {
        res.send(msgHelper(false, 'require comment id'));
        return;
    }

    if (!validator.isUUID(commentId)) {
        res.send(msgHelper(false, 'id format error'));
        return;
    }

    let userInfo = req.decoded;

    try {
        let result = await req.db.deleteComment(commentId, userInfo.userId);
        res.send(msgHelper(true, result));
    } catch (err) {
        res.send(msgHelper(false, 'delete comment error: ' + err));
    }

});

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

router.get('/comment', async (req, res) => {
    let commentId = req.query.id;
    if (commentId === undefined) {
        res.send(msgHelper(false, 'require comment id'));
        return;
    }

    if (!validator.isUUID(commentId, 4)) {
        res.send(msgHelper(false, 'id format error'));
        return;
    }

    try {
        let result = await req.db.getComment(commentId);
        res.send(msgHelper(true, result));
    } catch (err) {
        res.send(msgHelper(false, 'get comment error: ' + err));
    }
});

module.exports = router;
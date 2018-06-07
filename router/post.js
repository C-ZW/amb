const router = require('express').Router();
const Posts = require('../models').Posts;
const msgHelper = require('../helper/msgHelper');
const Sequelize = require('sequelize');
const UserPostHistory = require('../models').UserPostHistory;
const uuidV4 = require('uuid');
const chai = require('chai');
const validator = require('validator');
const signatureGenerator = require('../helper/signature');
const signatureSalt = require('../config/config').signatrueSalt;

router.post('/post', (req, res) => {
    let data = req.body;
    let userInfo = req.decoded;
    let postId = uuidV4();

    if (req.decoded === undefined) {
        res.send(msgHelper(false, 'something wrong'));
        return;
    }

    if (createPostCheck(data)) {
        res.send(msgHelper(false, 'post require title, created_time'));
        return;
    }

    Posts.create(postTemplate(postId, data, req.decoded.userId))
        .then(() => {
            recordHistory(userInfo.userId, postId);
        })
        .then(() => {
            res.send(msgHelper(true));
        })
        .catch(Sequelize.ValidationError, (err) => {
            res.send(msgHelper(false, err));
        })
        .catch((err) => {
            res.send(msgHelper(false, err));
        });
});

router.get('/post', (req, res) => {
    let query = req.query;
    let userInfo = req.decoded;
    
    if (!validator.isUUID(query.post_id, 4)) {
        res.send(msgHelper(false, 'post_id format error'));
        return;
    } else if (req.decoded == undefined) {
        res.send(msgHelper(false, 'something wrong'));
        return;
    } else {
        let userSignature = signatureGenerator(userInfo.userId, query.post_id, signatureSalt);
        
        Posts.findOne({
            where: {
                post_id: query.post_id
            }
        })
            .then((data) => {
                if (data.signature === userSignature) {
                    res.send(creatorView(data));
                } else {
                    res.send(commonUserView(data))
                }
            })
            .catch((err) => {
                res.send(err);
            });
    }
});

router.delete('/post', (req, res) => {
    let userInfo = req.decoded;
    if(req.query.post_id === undefined) {
        res.send(msgHelper(false, 'require post_id'));
        return;
    }

    let postId = validator.escape(req.query.post_id);

    UserPostHistory.destroy({
        where: {
            user_id: userInfo.userId,
            post_id: postId
        }
    })
    .then((data) => {
        if(data === 0) {
            throw 'no found';
        }
        deletePost(postId);
        return data;
    })
    .then((data) => {
        res.send(msgHelper(true, data));
    })
    .catch((err) => {
        res.send(msgHelper(false, err));
    });
});

router.put('/post', (req, res) => {
    let userInfo = req.decoded;
    let query = req.body;
    let postId = query.post_id;
    let title = query.title;
    let content = query.content;
    let signature = signatureGenerator(userInfo.userId, postId, signatureSalt);
    
    Posts.update(updatePostTemplate(title, content), {
        where: {
            post_id: postId,
            signature: signature
        }
    })
    .then((data) => {
        if(data[0] === 0) {
            throw 'check user id or post id'
        }
        res.send(msgHelper(true, ''));
    })
    .catch((err) => {
        res.send(msgHelper(false, err));
    });
});

function updatePostTemplate(title, content) {
    let toUpdate = {};
    if(title !== undefined) {
        toUpdate.title = validator.escape(title);
    }
    
    if(content !== undefined) {
        toUpdate.content = validator.escape(content);
    }
    return toUpdate;
}

function deletePost(postId) {
    Posts.destroy({
        where: {
            post_id: postId
        }
    })
    .then((data) => {
        if(data === 0) {
            throw 'err'
        }
    })
    .catch((err) => {
        console.log(err)
    });
}

router.get('/posts', (req, res) => {
    Posts.findAll({
        limit: 100,
        order: [['created_time', 'DESC']],
        raw: true
    })
        .then((posts) => {
            res.send(posts.map(post => commonUserView(post)));
        })
        .catch((err) => {
            res.send(msgHelper(false, err));
        });
});

function commonUserView(post) {
    return {
        post_id: post.post_id,
        title: validator.unescape(post.title),
        content: validator.unescape(post.content),
        created_time: post.created_time
    }
}

function creatorView(post) {
    return {
        post_id: post.post_id,
        title: validator.unescape(post.title),
        content: validator.unescape(post.content),
        created_time: post.created_time,
        like: post.like,
        dislike: post.dislike,
        popularity: post.popularity
    }
}

function postTemplate(postId, post, userId) {
    chai.should().exist(postId, 'post id shoud exist');
    return {
        post_id: postId,
        title: validator.escape(post.title),
        content: validator.escape(post.content),
        created_time: validator.toDate(post.created_time),
        signature: signatureGenerator(userId, postId, signatureSalt)
    }
}

function createPostCheck(post) {
    let isEmpty = post.title === undefined ||
        post.title === '' ||
        validator.toDate(post.created_time) === null;

    return isEmpty;
}

function recordHistory(userId, postId) {
    chai.should().exist(userId, 'user id shoud exist');
    chai.should().exist(postId, 'post id shoud exist');

    UserPostHistory.create({
        user_id: userId,
        post_id: postId,
        preference_type: 'creator'
    })
        .then(() => {
            console.log('post history success record');
        })
        .catch((err) => {
            console.log(err);
        })
}

module.exports = router;
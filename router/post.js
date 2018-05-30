const router = require('express').Router();
const Posts = require('../models').Posts;
const msgHelper = require('../helper/msgHelper');
const Sequelize = require('sequelize');
const UserPostHistory = require('../models').UserPostHistory;
const uuidV4 = require('uuid');
const chai = require('chai');

router.post('/post', (req, res) => {
    let data = req.body;
    let userInfo = req.decoded;
    let postId = uuidV4();

    if (createPostCheck(data)) {
        res.send(msgHelper(false, 'post require title, created_time'));
    } else {
        Posts.create(postTemplate(postId, data))
            .then(() => {
                recordHistory(userInfo.userId, postId);
            })
            then(() => {
                res.send(msgHelper(true));
            })
            .catch(Sequelize.ValidationError, (err) => {
                res.send(msgHelper(false, err));
            });
    }
});

function postTemplate(postId, post) {
    chai.should().exist(postId, 'post id shoud exist');
    return {
        post_id: postId,
        title: post.title,
        content: post.content,
        created_time: post.created_time
    }
}

router.get('/post', (req, res) => {
    let query = req.query;

    if (!uuidValidate(query.post_id)) {
        res.send(msgHelper(false, 'post_id format error'));
    } else {

        // TODO: implement common user and creator view

        Posts.findOne({
            where: {
                post_id: query.post_id
            }
        })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.send(err);
            });
    }
});

router.get('/posts', (req, res) => {
    // Posts.find()
    res.end();
});

function uuidValidate(uuid) {
    let uuidRule = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRule.test(uuid);
}

function createPostCheck(post) {
    return post.title === undefined ||
        post.title === '' ||
        post.created_time === undefined;
}

function recordHistory(userId, postId) {
    chai.should().exist(userId, 'user id shoud exist');
    chai.should().exist(postId, 'post id shoud exist');
    
    UserPostHistory.create({
        user_id: userId,
        post_id: postId
    })
    .then(() => {
        console.log('post history success record');
    })
    .catch((err) => {
        console.log(err);
    })
}

module.exports = router;
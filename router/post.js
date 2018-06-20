'use strict'
const router = require('express').Router();
const Posts = require('../models').Posts;
const msgHelper = require('../helper/msgHelper');
const Sequelize = require('sequelize');
const uuidV4 = require('uuid');
const validator = require('validator');
const signatureGenerator = require('../helper/core/signature');
const signatureSalt = require('../config/config').signatureSalt;

router.post('/post', async (req, res) => {
    let data = req.body;
    let postId = uuidV4();

    if (req.decoded === undefined) {
        res.send(msgHelper(false, 'something wrong'));
        return;
    }

    if (createPostCheck(data)) {
        res.send(msgHelper(false, 'post require title, created_time'));
        return;
    }

    try {
        let result = await req.db.createPost(postId, data, req.decoded.userId);
        res.send(msgHelper(true, result));
    } catch (err) {
        res.send(msgHelper(false, 'create post error: ' + err));
    }
});

let popularityCounter = [];
let counter = 0;

function updatePostPopularity() {
    for (let i in popularityCounter) {
        Posts.update({
            popularity: Sequelize.literal('popularity + ' + popularityCounter[i])
        }, {
                where: {
                    post_id: i
                }
            })
            .then(() => {
                counter = 0;
                popularityCounter = [];
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

setInterval(() => {
    updatePostPopularity();
}, 5000)

router.get('/post', async (req, res) => {
    let query = req.query;

    if (!validator.isUUID(query.id, 4)) {
        res.send(msgHelper(false, 'post_id format error'));
        return;
    } else if (req.decoded == undefined) {
        res.send(msgHelper(false, 'something wrong'));
        return;
    } else {
        try {
            let result = await req.db.getPost(req.decoded.userId, query.id);

            if (Object.keys(result).length === 0) {
                res.send(msgHelper(true, result));
                return;
            }

            if (popularityCounter[query.id] === undefined) {
                popularityCounter[query.id] = 0;
            }
            popularityCounter[query.id]++;

            let isCreator = await req.db.isPostCreator(req.decoded.userId, query.id);
                result.isCreator = isCreator;
            
            res.send(msgHelper(true, result));
        } catch (err) {
            res.send(msgHelper(false, 'get post err: ' + err));
        }
    }
});

router.delete('/post', async (req, res) => {
    let userInfo = req.decoded;
    let postId = req.query.id;

    if (postId === undefined) {
        res.send(msgHelper(false, 'require post_id'));
        return;
    }

    if (!validator.isUUID(postId, 4)) {
        res.send(msgHelper(false, 'id fromat error'));
        return;
    }

    try {
        let result = await req.db.deletePost(userInfo.userId, postId);
        res.send(msgHelper(true, result));
    } catch(err) {
        res.send(msgHelper(false, 'err: ' + err));
    }
});

router.put('/post', async (req, res) => {
    let userInfo = req.decoded;
    let query = req.body;
    let postId = query.id;
    let title = query.title;
    let content = query.content;
    let signature = signatureGenerator(userInfo.userId, postId, signatureSalt);

    if (!validator.isUUID(postId, 4)) {
        res.send(msgHelper(false, 'id format error'));
        return;
    }

    try {
        let result = await req.db.updatePost(postId, title, content, signature);
        res.send(msgHelper(true, result));
    } catch(err) {
        res.send(msgHelper(false, err));
    }
});

router.get('/posts', async (req, res) => {
    try {
        let result = await req.db.getPosts()
        res.send(result)
    } catch (err) {
        res.send(false, 'get post err: ' + err);
    }
});

function createPostCheck(post) {
    let isEmpty = post.title === undefined ||
        post.title === '' ||
        validator.toDate(post.created_time) === null;

    return isEmpty;
}

module.exports = router;
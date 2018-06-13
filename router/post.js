const router = require('express').Router();
const Posts = require('../models').Posts;
const msgHelper = require('../helper/msgHelper');
const Sequelize = require('sequelize');
const UserPostHistory = require('../models').UserPostHistory;
const uuidV4 = require('uuid');
const chai = require('chai');
const validator = require('validator');
const signatureGenerator = require('../helper/signature');
const signatureSalt = require('../config/config').signatureSalt;
const CommentHistories = require('../models').UserCommentHistory;
const Comments = require('../models').Comments;
const db = require('../helper/db');

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
        let result = await db.createPost(postId, data, req.decoded.userId);
        res.send(msgHelper(true, result));
    } catch (err) {
        res.send(msgHelper(false, 'error: ' + err));
    }
});

let popularityCounter = [];

function updatePostPopularity() {
    for (let i in popularityCounter) {
        Posts.update({
            popularity: Sequelize.literal('popularity + ' + popularityCounter[i])
        }, {
                where: {
                    post_id: i
                }
            })
            .then((data) => {
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
            let result = await db.getPost(req.decoded.userId, query.id);
            if (popularityCounter[id] === undefined) {
                popularityCounter[id] = 0;
            }
            popularityCounter[id]++;
            res.send(msgHelper(true, result));
        } catch (err) {
            res.send(msgHelper(false, err));
        }
    }
});

router.delete('/post', (req, res) => {
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

    UserPostHistory.destroy({
        where: {
            user_id: userInfo.userId,
            post_id: postId
        }
    })
        .then((data) => {
            if (data === 0) {
                throw 'no found';
            }

            CommentHistories.destroy({
                where: {
                    post_id: postId
                }
            })
                .then(() => {
                    Comments.destroy({
                        where: {
                            post_id: postId
                        }
                    })
                        .catch((err) => {
                            console.log(err);
                        })
                })
                .then(() => {
                    deletePost(postId);
                })
                .catch((err) => {
                    console.log(err);
                });


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
    let postId = query.id;
    let title = query.title;
    let content = query.content;
    let signature = signatureGenerator(userInfo.userId, postId, signatureSalt);

    if (!validator.isUUID(postId, 4)) {
        res.send(msgHelper(false, 'id format error'));
        return;
    }

    Posts.update(updatePostTemplate(title, content), {
        where: {
            post_id: postId,
            signature: signature
        }
    })
        .then((data) => {
            if (data[0] === 0) {
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
    if (title !== undefined) {
        toUpdate.title = validator.escape(title);
    }

    if (content !== undefined) {
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
            if (data === 0) {
                throw 'err'
            }
        })
        .catch((err) => {
            console.log(err)
        });
}

router.get('/posts', async (req, res) => {
    try {
        let result = await db.getPosts()
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
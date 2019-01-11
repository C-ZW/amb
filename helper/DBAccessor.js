'use strict'
const Bll = require('../core/Bll');
const models = require('../models');
const template = require('./template');
const Sequelize = require('sequelize');
const signatureSalt = require('../config/config').signatureSalt;
const commentSalt = require('../config/config').commentSalt;
const signatureGenerator = require('../core/signature');
const validator = require('validator');

class DBAccess {
    updateComment(commentId, content, signature, t) {
        return models.Comments.update({
            content: content
        }, {
                where: {
                    comment_id: commentId,
                    signature: signature
                },
                transaction: t
            })
            .then((data) => {
                if (data[0] === 0) {
                    throw 'check comment id or user id';
                }
                return 'upadte comment success';
            })
            .catch((err) => {
                throw 'update comment error: ' + err;
            })
    }

    createComment(comment, t) {
        return models.Comments.create(comment, {
            transaction: t
        })
            .then(() => {
                return 'create comment success';
            })
            .catch((err) => {
                throw 'create comment error: ' + err;
            });
    }

    createCommentHistory(comment, userId, t) {
        return models.UserCommentHistory.create({
            comment_id: comment.comment_id,
            user_id: userId,
            post_id: comment.post_id
        }, {
                transaction: t
            })
            .then(() => {
                return 'create comment history success';
            })
            .catch((err) => {
                throw 'create comment history err: ' + err;
            });
    }

    getComment(commentId) {
        return models.Comments.findOne({
            attributes: ['post_id', 'content', 'created_time'],
            where: {
                comment_id: commentId
            },
            raw: true
        })
            .then((data) => {
                if (data === null) {
                    throw ' comment no found';
                }
                return data;
            })
            .catch((err) => {
                throw ' get comment error' + err;
            });
    }

    getComments(postId) {
        return models.Comments.findAll({
            attributes: ['comment_id', 'content', 'created_time', 'signature'],
            order: [['created_time', 'DESC']],
            where: {
                post_id: postId
            },
            raw: true
        })
            .then((data) => {
                return data;
            })
            .catch((err) => {
                throw 'get comments error: ' + err;
            });
    }

    login(account, password) {
        return models.Users.findOne({
            attributes: ['user_id'],
            where: {
                account: account,
                password: password
            },
            raw: true
        })
            .then((data) => {
                return data.user_id;
            })
            .catch((err) => {
                throw 'login error: ' + err;
            });
    }

    getPostHistories(userId, t) {
        return models.UserPostHistory.findAll({
            attributes: ['post_id'],
            include: [{ model: models.Posts }],
            where: {
                user_id: userId
            },
            transaction: t
        })
            .then((data) => {
                return data
            })
            .catch(err => {
                throw 'get post histories error: ' + err;
            });
    }

    getCommentHistories(userId, t) {
        return models.UserCommentHistory.findAll({
            attributes: ['comment_id'],
            include: [{ model: models.Comments }],
            where: {
                user_id: userId
            },
            transaction: t
        })
            .then(data => {
                return data;
            })
            .catch(err => {
                throw 'get comment histories error: ' + err;
            });
    }



    createUser(account, password, t) {
        return models.Users.create({
            account: account,
            password: password
        }, {
                transaction: t
            }
        )
            .then(() => {
                return 'register success';
            })
            .catch(Sequelize.ValidationError, (msg) => {
                throw 'Account already existed.';
            })
            .catch((err) => {
                throw 'register error: ' + err;
            });
    }

    updatePost(postId, title, content, signature, t) {
        return models.Posts.update(template.updatePostTemplate(title, content), {
            where: {
                post_id: postId,
                signature: signature
            },
            transaction: t
        })
            .then((data) => {
                if (data[0] === 0) {
                    throw 'check user id or post id'
                }
                return 'update success';
            })
            .catch((err) => {
                throw 'update post error: ' + err;
            });
    }

    isCommentCreator(userId, postId, commentId, t) {

        return models.Comments.findOne({
            where: {
                comment_id: commentId,
                signature: signatureGenerator(userId, postId, commentSalt)
            },
            raw: true,
            transaction: t
        })
            .then(data => {
                return data !== null;
            })
            .catch(err => {
                throw err;
            })
    }

    isPostCreator(userId, postId, t) {
        return models.Posts.findOne({
            where: {
                post_id: postId,
                signature: signatureGenerator(userId, postId, signatureSalt)
            },
            raw: true,
            transaction: t
        })
            .then(data => {
                return data !== null;
            })
            .catch(err => {
                throw err;
            });
    }

    getPostIdByComment(commentId) {
        return models.Comments.findOne({
            attributes: ['post_id'],
            where: {
                comment_id: commentId
            },
            raw: true
        })
            .then(data => {
                return data.post_id;
            })
            .catch(err => {
                throw 'getPostIdByComment error: ' + err;
            })
    }

    getPosts() {
        return models.Posts.findAll({
            limit: 100,
            order: [['created_time', 'DESC']],
            raw: true
        })
            .then((posts) => {
                return posts.map(template.commonUserView)
            })
            .catch(err => {
                return 'get posts error ' + err;
            });
    }

    createPostHistory(userId, postId, t) {
        return models.UserPostHistory.create({
            user_id: userId,
            post_id: postId,
            preference_type: 'creator'
        }, {
                transaction: t
            })
            .then((data) => {
                return data;
            })
            .catch((err) => {
                throw 'create post history error: ' + err;
            });
    }

    getPost(id, signature, t) {
        return models.Posts.findOne({
            where: {
                post_id: id
            },
            transaction: t
        })
            .then((data) => {
                if (data === null) {
                    throw 'post id error';
                }

                if (data.signature === signature) {
                    return template.creatorView(data);
                } else {
                    return template.commonUserView(data);
                }
            })
            .catch((err) => {
                throw 'get post error: ' + err;
            });
    }

    createPost(userId, postId, post, t) {
        return models.Posts.create({
            post_id: postId,
            title: validator.escape(post.title),
            content: validator.escape(post.content),
            created_time: validator.toDate(post.created_time),
            signature: signatureGenerator(userId, postId, signatureSalt)
        }, {
                transaction: t
            })
            .catch(Sequelize.ValidationError, (err) => {
                throw `create post validation error: ${err}`;
            })
            .catch((err) => {
                throw `create post error: ${err}`;
            });
    }

    deleteComments(commentId, postId, t) {
        let condition = {};
        if (commentId !== undefined && commentId !== null) {
            condition.comment_id = commentId;
        }

        if (postId !== undefined && postId !== null) {
            condition.post_id = postId;
        }

        return models.Comments.destroy({
            where: condition,
            transaction: t
        })
            .catch(err => {
                throw 'delete comment err: ' + err;
            });
    }

    deleteCommentHistories(commentId, postId, userId, t) {
        let condition = {};
        if (commentId !== undefined && commentId !== null) {
            condition.comment_id = commentId;
        }

        if (postId !== undefined && postId !== null) {
            condition.post_id = postId
        }

        if (userId !== undefined && userId !== null) {
            condition.user_id = userId;
        }

        return models.UserCommentHistory.destroy({
            where: condition,
            transaction: t
        })
            .then((data) => {
                return data;
            })
            .catch(err => {
                throw 'delete comment histories error: ' + err;
            });
    }

    deletePostHistories(userId, postId, t) {
        return models.UserPostHistory.destroy({
            where: {
                user_id: userId,
                post_id: postId
            },
            transaction: t
        })
            .catch(err => {
                throw 'delete post histories err: ' + err;
            });
    }

    deletePost(postId, t) {
        return models.Posts.destroy({
            where: {
                post_id: postId
            },
            transaction: t
        })
            .then((data) => {
                if (data === 0) {
                    throw 'to be deleted post no found';
                }
            })
            .catch((err) => {
                throw 'delete post err: ' + err;
            });
    }
}

module.exports = new Bll(new DBAccess());